<template>
<div class="help">
  <h2>Create a new taxonomy</h2>

  <p>
    The document selector can be used to create a new taxonomy.  When you start
    typing into this selector, a box will appear underneath it.  Click on the 
    text to begin a new document with a blank taxonomy.
  </p>

  <h2>Save a taxonomy</h2>
  <p>
    Click Save.  This will update the selected taxonomy, as stored on the server.
  </p>

  <h2>Delete a node</h2>
  <p>
    Hover over the down-arrow icon next to a node and click 'Delete'.  Note that
    this will also delete all of the node's children.
  </p>

  <h2>Add a child node</h2>

  <p>
    Hover over the down-arrow icon next to a node and a menu will appear.  Click
    'Add node'.  This will prompt you for the name of the node.
  </p>

  <h2>Set node annotation</h2>
  <p>
    The node displays its annotation to its right.  Click on the annotation
    to set its value.
  </p>

  <h2>Unlink node</h2>
  <p>
    Again, use the menu, and click 'Unlink'.  This will remove its annotation.
  </p>

  <h2>Caveats</h2>

  <p>Node names should be unique at the moment.</p>
  <p>Annotation names are stored as plain strings.  There's no linkage between them.</p>
  <p>There's no way to change the parent node of a node or subtree (i.e. move it).</p>
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
