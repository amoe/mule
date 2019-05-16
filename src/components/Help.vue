<template>
<div class="help">
  <h1>Create a new taxonomy</h1>

  <p>
    The document selector can be used to create a new taxonomy.  When you start
    typing into this selector, a box will appear underneath it.  Click on the 
    text to begin a new document with a blank taxonomy.
  </p>

  <h1>Save a taxonomy</h1>
  <p>
    Click Save.  This will update the selected taxonomy, as stored on the server.
  </p>

  <h1>Delete a node</h1>
  <p>
    Hover over the down-arrow icon next to a node and click 'Delete'.  Note that
    this will also delete all of the node's children.
  </p>

  <h1>Add a child node</h1>

  <p>
    Hover over the down-arrow icon next to a node and a menu will appear.  Click
    'Add node'.  This will prompt you for the name of the node.
  </p>

  <h1>Set node annotation</h1>
  <p>
    The node displays its annotation to its right.  Click on the annotation
    to set its value.
  </p>

  <h1>Unlink node</h1>
  <p>
    Again, use the menu, and click 'Unlink'.  This will remove its annotation.
  </p>
</div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
  });
</script>

<style lang="less">
.help {
//    width: 10em;
    word-break: normal;
}
</style>
