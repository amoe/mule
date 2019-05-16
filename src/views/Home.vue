<template>
  <div class="home">
    <el-header>MULE</el-header>

    <el-select v-model="documentName"
               filterable
               allow-create>
      <el-option v-for="item in availableDocuments"
                 :key="item"
                 :label="item"
                 :value="item">
      </el-option>
    </el-select>
    
     <el-tree :data="treeData"
              v-on:node-click="handleNodeClick">
      <span class="custom-tree-node" slot-scope="{ node, data }">

        <span>{{node.label}}</span>
        <span>{{node.linkedAnnotation}}</span>

        <el-dropdown trigger="hover" @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="deleteCommand(node, data)">Delete</el-dropdown-item>
            <el-dropdown-item :command="addChildCommand(node, data)">Add child</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        
        </span>
      </span>       
     </el-tree>

    <el-button v-on:click="addRoot">Add root node</el-button>

    <el-input type="textarea"
              :value="prettyTree"
              rows="8"
              disabled>
    </el-input>

    <el-button v-on:click="write">Save</el-button>
  </div>
</template>

<script lang="ts">
    import Vue from 'vue';
import PouchDB from 'pouchdb';
import Promise from 'bluebird';
import {ELEMENT_UI_DEMO_HIERARCHY} from '@/large-hierarchy';
import {cloneDeep, includes} from 'lodash';
import {OptionsNode, Document, NodeCommand} from '@/types';
import {DataService} from '@/data-service';
import {isMessageBoxInputData} from '@/type-guards';

function makeSleep() {
    return new Promise(resolve => setTimeout(resolve, 5000));
}

function makeNamedCommand(name: string, node: any, data: any): NodeCommand {
    return {
        command: name,
        node,
        data
    }
}

// this function is taken from the element UI demo.
function removeDestructive(node: any, data: any) {
    const parent = node.parent;
    const children = parent.data.children || parent.data;
    const index = children.findIndex((d: any) => d.id === data.id);
    children.splice(index, 1);
}


function appendDestructive(data: OptionsNode, newNode: OptionsNode) {
    // Setup reactive child array if not already there
    if (!data.children) {
        Vue.set(data, 'children', []);
    }
    
    // Shut tsc up.
    if (data.children === undefined) throw new Error("can't happen");
    
    data.children.push(newNode);
}


export default Vue.extend({
    name: 'home',
    data() {
        return {
            documentName: 'main',
            availableDocuments: [] as string[],
            treeData: [] as OptionsNode[],
            dataService: new DataService(),
        };
    },
    created() {
        console.log("data service is %o", this.dataService);
        
        this.refreshAvailable();
        this.loadData(this.documentName);
    },
    methods: {
        refreshAvailable() {
            this.dataService.getDocumentNames().then(names => {
                console.log("document names: %o", names);
                this.availableDocuments = names;
            }).catch(error => {
                console.log("error: %o", error);
            });
        },
        write() {
            // should do an update
            this.dataService.update(this.documentName, {'tree': this.treeData}).then(response => {
                this.$message("Saved latest revision.");
            }).catch(error => {
                this.$message.error("update had error: " + error);
            });
        },
        handleNodeClick(node: OptionsNode) {
            //            node.label = "MERKED";
        },
        handleCommand(commandObject: NodeCommand) {
            console.log("command is %o", commandObject.command);
            
            if (commandObject.command === 'delete') {
                console.log("value of data is %o", commandObject.data);
                removeDestructive(commandObject.node, commandObject.data);
            } else if (commandObject.command === 'addChild') {
                const message = "What should the name of the leaf node be?";
                const title = "Add node";
                const options = {};

                this.$prompt(message, title, options).then(data => {
                    if (isMessageBoxInputData(data)) {
                        const inputValue = data.value;

                        const newNode: OptionsNode = {
                            value: inputValue,
                            label: inputValue,
                            linkedAnnotation: null
                        };

                        appendDestructive(commandObject.data, newNode);
                    }
                }).catch(error => {
                    console.log("error is %o", error);
                });
            }
        },
        deleteCommand(node: any, data: any) {
            return makeNamedCommand('delete', node, data);
        },
        addChildCommand(node: any, data: any) {
            return makeNamedCommand('addChild', node, data);
        },
        loadData(documentName: string): void {
            const loadingInstance = this.$loading({fullscreen: true});
            
            this.dataService.getLatestVersion(this.documentName).then(document => {
                this.treeData = document.tree;
                console.log("retrieved a document %o", document);
                loadingInstance.close();
            }).catch(error => {
                this.$message.error("Cannot read document '" + documentName + "': " + error.message);
                this.treeData = [];
                
                loadingInstance.close();
            });
            
        },
        addRoot(): void {
            const message = "What should the name of the node be?";
            const title = "Add root node";
            const options = {};
            
            this.$prompt(message, title, options).then(data => {
                if (isMessageBoxInputData(data)) {
                    const inputValue = data.value;
                    
                    console.log("data is %o", data);
                    
                    const newNode: OptionsNode = {
                        value: inputValue,
                        label: inputValue,
                        linkedAnnotation: null
                    };

                    this.treeData.push(newNode);
                }
            }).catch(error => {
                console.log("error is %o", error);
            });
        },
    },
    watch: {
        documentName(newName, oldName): void {
            console.log("available documents list is %o", this.availableDocuments);

            if (includes(this.availableDocuments, newName)) {
                this.loadData(newName);
            } else {
                this.treeData = [];

                this.dataService.update(newName, {'tree': this.treeData}).then(response => {
                    this.refreshAvailable();
                    this.loadData(newName);
                }).catch(error => {
                    this.$message.error("update had error: " + error);
                });
            }
        }
    },
    computed: {
        prettyTree(): string {
            return JSON.stringify(this.treeData, null, 4);
        }
    }
});
</script>
