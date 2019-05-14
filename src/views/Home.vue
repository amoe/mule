<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import PouchDB from 'pouchdb';

interface Document {
};

export default Vue.extend({
    name: 'home',
    mounted() {
        this.$nextTick(() => {
            console.log("foo");
            const db = new PouchDB<Document>("http://localhost:5984");
            console.log(db);
            db.info();
        });
    },
    methods: {
        // initialCreate(db) {
        //     db.put(sampleDocument).then(response => {
        //         console.log("put worked, %o", response);
        //         this.updateExisting(db);
        //     }).catch(error => {
        //         console.log("put failed, %o", error);
        //     });
        // },
        // updateExisting(db) {
        //     db.get(DOCUMENT_NAME).then(response => {
        //         return db.put({
        //             "_id": DOCUMENT_NAME,
        //             "_rev": response._rev,
        //             "meaningOfLife": 43
        //         });
        //     }).then(response => {
        //         console.log("update succeeded, %o", response);
        //         this.postUpdateFetch(db);
        //     }).catch(error => {
        //         console.log("get failed, %o", error);
        //     });
        // },
        // postUpdateFetch(db) {
        //     db.get(DOCUMENT_NAME).then(response => {
        //         console.log("post-update fetch succeeded, %o", response);
        //     }).catch(error => {
        //         console.log("post update fetch failed, %o", error);
        //     });
        // },
    }
});
</script>
