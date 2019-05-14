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
    }
});
</script>
