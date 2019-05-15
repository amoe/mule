<template>
  <div class="home">
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
        {{node.label}}
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

    <textarea cols="80" rows="25">
      {{treeData}}
    </textarea>

    <el-button v-on:click="write">Write</el-button>
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


function appendDestructive(data: any) {
    // Setup reactive child array if not already there
    if (!data.children) {
        Vue.set(data, 'children', []);
    }
    
    data.children.push({value: "foo", label: "blah"})
}


export default Vue.extend({
    name: 'home',
    data() {
        return {
            documentName: 'main',
            availableDocuments: [] as string[],
            treeData: [] as OptionsNode[],
            dataService: new DataService()
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
                this.$message("update worked");
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
                appendDestructive(commandObject.data);
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
                this.$message.error("cannot read document " + error);
                loadingInstance.close();
            });

        }
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
    }
});
</script>
