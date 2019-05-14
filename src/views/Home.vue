<template>
  <div class="home">
    <textarea cols="80" rows="25" v-model="jsonInput">
    </textarea>

    <button v-on:click="write">Write</button>
  </div>
</template>

<script lang="ts">
    import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import PouchDB from 'pouchdb';
import Promise from 'bluebird';

interface Document {
    meaningOfLife: number
};

function makeSleep() {
    return new Promise(resolve => setTimeout(resolve, 5000));
}

const DOCUMENT_NAME = 'main';
const ID_PROPERTY = '_id';
const REV_PROPERTY = '_rev';

const sampleDocument = {
    "_id": DOCUMENT_NAME,
    "meaningOfLife": 42
};

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


export default Vue.extend({
    name: 'home',
    data() {
        return {
            jsonInput: "",
            couchdb: getDatabase()
        };
    },
    created() {
        this.couchdb.get(DOCUMENT_NAME).then(response => {
            delete response[ID_PROPERTY];
            delete response[REV_PROPERTY];
            this.jsonInput = JSON.stringify(response);
        }).catch (error => {
            console.log("cannot read document");
        });
    },
    methods: {
        write() {
            console.log("I would write");
            
            this.couchdb.put(this.currentDocument).then(response => {
                console.log("put worked, %o", response);
            }).catch(error => {
                console.log("put failed, %o", error);
                
                if (error.name === 'conflict') {
                    console.log("conflict, attempting update");
                    return this.couchdb.get(DOCUMENT_NAME).then(response => {
                        this.couchdb.put(
                            Object.assign(
                                {},
                                this.currentDocument,
                                {[REV_PROPERTY]: response._rev}
                            )
                        ).then(response => {
                            console.log("updated successfully");
                        }).catch(error => {
                            console.log("update failed");
                        });
                    }).catch (error => {
                        console.log("could not retrieve existent object");
                    });
                }
            });
        },
    },
    computed: {
        currentDocument(): any {
            const deserialized = JSON.parse(this.jsonInput);
            deserialized[ID_PROPERTY] = DOCUMENT_NAME;
            return deserialized;
        }
    }
});
</script>
