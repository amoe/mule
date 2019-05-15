<template>
  <div class="home">
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

function makeSleep() {
    return new Promise(resolve => setTimeout(resolve, 5000));
}

const DOCUMENT_NAME = 'main0';
const ID_PROPERTY = '_id';
const REV_PROPERTY = '_rev';


function getDatabase(): PouchDB.Database<Document> {
    return new PouchDB<Document>(
        "http://localhost:5984/alice",
        {
            'auth': {
                'username': 'admin',
                'password': 'admin'
            }
        }
    );
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
            treeData: [] as OptionsNode[],
            couchdb: getDatabase()
        };
    },
    created() {
        const loadingInstance = this.$loading({fullscreen: true});

        this.couchdb.get(DOCUMENT_NAME).then(response => {
            delete response[ID_PROPERTY];
            delete response[REV_PROPERTY];
//            this.jsonInput = JSON.stringify(response);


            this.treeData = response.tree;

            console.log("value is now %o", response);
            loadingInstance.close();
        }).catch (error => {
            this.$message.error("cannot read document");
            loadingInstance.close();
        });
    },
    methods: {
        write() {
            this.couchdb.put(this.couchTree).then(response => {
                console.log("put worked, %o", response);
            }).catch(error => {
                
                if (error.name === 'conflict') {
                    console.log("conflict, attempting update");
                    return this.couchdb.get(DOCUMENT_NAME).then(response => {
                        this.couchdb.put(
                            Object.assign(
                                {},
                                this.couchTree,
                                {[REV_PROPERTY]: response._rev}
                            )
                        ).then(response => {
                            this.$message("Updated successfully");
                        }).catch(error => {
                            this.$message.error("update failed");
                        });
                    }).catch (error => {
                        this.$message.error("could not retrieve existent object");
                    });
                } else {
                    this.$message.error("put failed: " + error);
                }
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

    },
    computed: {
        couchTree(): any {
            const container = {
                [ID_PROPERTY]: DOCUMENT_NAME,
                tree: cloneDeep(this.treeData)
            };
            
            return container;
        }
    }
});
</script>
