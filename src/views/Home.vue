<template>
  <div class="home">
    <el-input v-model="documentName"></el-input>
    
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

    <button v-on:click="write">Write</button>
  </div>
</template>

<script lang="ts">
    import Vue from 'vue';
import PouchDB from 'pouchdb';
import Promise from 'bluebird';
import {ELEMENT_UI_DEMO_HIERARCHY} from '@/large-hierarchy';
import {cloneDeep} from 'lodash';
import {OptionsNode, Document, NodeCommand} from '@/types';
import {DataService} from '@/data-service';

function makeSleep() {
    return new Promise(resolve => setTimeout(resolve, 5000));
}

const DOCUMENT_NAME = 'main';
const ID_PROPERTY = '_id';
const REV_PROPERTY = '_rev';


function getId(documentName: string): string {
    if (documentName.includes(':')) {
        throw new Error("bad documentname");
    }

    const timestamp: string = new Date().toISOString();
    return documentName + ":" + timestamp;
}

function fromCouch(response: any): any {
    return response.tree;
}

function toCouch(treeData: any, documentName: string): any {
    const container = {
        [ID_PROPERTY]: getId(documentName),
        tree: treeData
    };
    
    return container;
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
            treeData: [] as OptionsNode[],
        };
    },
    created() {
        const dataService = new DataService();

        console.log("data service is %o", dataService);

        const documentName = "main0";
        const documentContent = {tree: []};
        
        dataService.update(documentName, documentContent).then(response => {
            console.log("update worked");
        }).catch(error => {
            console.log("update had error", error);
        });
        

        console.log("secret is %o", process.env.VUE_APP_SECRET);

        // const loadingInstance = this.$loading({fullscreen: true});

        // this.couchdb.get(DOCUMENT_NAME).then(response => {
        //     this.treeData = fromCouch(response);
        //     loadingInstance.close();
        // }).catch (error => {
        //     this.$message.error("cannot read document");
        //     loadingInstance.close();
        // });
    },
    methods: {
        write() {
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

    },
    computed: {
        couchTree(): any {
            return toCouch(this.treeData, this.documentName);
        }
    }
});
</script>
