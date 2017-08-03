<template>
<ul class="vim-ul-default">
  <li v-for="(item, index) in nodeData" :data-id="item.id"  v-show="showHide[item.id].nodeVisible"  class="vim-li-default">

    <span class="icon vim-tree-expand-collapse" v-if="showHide[item.id].nodeCL > 0" @click.stop='handleNodeExpand(item.id)'>
      <i :class="showHide[item.id].nodeExpand ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "></i>
    </span>
    <component :is="treeOptions.injectComponent ? treeOptions.injectComponent : 'default-Template' " :data="item" :opt="treeOptions">
    </component>
    <tree-node v-if="item[treeOptions.childrenKey].length > 0" :includeInfo="includeInfo" :treeData="item[treeOptions.childrenKey]"  :treeOptions="treeOptions">
    </tree-node>
  </li>
</ul>
</template>

<script>
import defaultTemplate from './defaultTemplate';
export default {
  components: {
    defaultTemplate
  },
  name: 'treeNode',
  props: {
    treeData: [Array],
  //  moveTreeData: [Object],
    treeOptions: [Object],
    // dataMap: {Map},
    // updateAction: [Object]
    includeInfo: [Array]
  },
  data() {
    return {
      nodeData: [],
      moveData: {},
      showHide: []
    }
  },
  computed: {

  },
  created() {
    this.nodeData = (this.treeData || []).slice(0);
    this.moveData = this.moveTreeData;
    this.showHide = (this.includeInfo || []).slice(0);
  },
  methods: {
    closest(el ,selector){
      while(el){
        if(el.matches(selector)){
          return el;
        }
        el = el.parentElement;
      }
      return null;
    },
    handleNodeExpand(id) {
      var target;
      this.closest(event.target, 'li').querySelector('ul').style.display = !this.showHide[id].nodeExpand ? "block" : "none";
      this.showHide[id].nodeExpand = !this.includeInfo[id].nodeExpand;
    },
    handlecheckedChange(node) {
      this.$emit('handlecheckedChange', node)
    },
    handleNode(node) {
      if (this.tree.store.last) {
        if (this.tree.store.last.id === node.id) {
          this.tree.store.last.checked = !this.tree.store.last.checked
        } else {
          this.tree.store.last.checked = false
          node.checked = true
          this.tree.store.last = node
        }
      } else {
        this.tree.store.last = node
        node.checked = true
      }
      this.tree.$emit('node-click', node)
    }
  }
}
</script>
