<template>
<!-- <ul>
  <li v-for='item in nodeData' v-show="treeDataMap.get(item.id).visible" :class="[(item.children && item.children.length > 0) ? '':'leaf']">
    <i v-if="item.children && item.children.length > 0" @click.stop='handleNodeExpand(item)' :class="[item.open? 'tree-open':'tree-close','icon']">
        </i>
    <input type="checkbox" class="check" v-if="options.showCheckbox" v-model='item.checked' @click.stop="handlecheckedChange(item)" />
    <span @click="handleNode(item)" :class="{'node-selected':(item.checked && !options.showCheckbox) || item.searched }">{{item.label}}</span>

    <tree-node v-if="item.children && item.children.length > 0" :treeDataMap="treeDataMap" @handlecheckedChange="handlecheckedChange" v-show='item.open' :treeData="item.children"></tree-node>
  </li>
</ul> -->
<ul class="vim-ul-default">
  <li v-for="item in nodeData" :data-id="item.id"  v-show="nodeDataExclude[item.id].visible"  class="vim-li-default">
    <span class="icon vim-tree-expand-collapse" v-if="nodeDataExclude[item.id].childrenLength > 0" @click.stop='handleNodeExpand(item.id)'>
      <i :class="[nodeDataExclude[item.id].expand ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o']"></i>
    </span>
    <component v-if="option.injectComponent" :is="option.injectComponent" :data="item">
    </component>
    <tree-node v-if="nodeDataExclude[item.id].childrenLength > 0" :treeData="item.children" :treeDataExclude="nodeDataExclude" :option="option" v-show="nodeDataExclude[item.id].expand">
    </tree-node>
  </li>
</ul>
</template>

<script>
export default {
  name: 'treeNode',
  props: {
    treeData: [Array],
    treeDataExclude: [Array],
    option: [Object]
  },
  // watch: {
  //   nodeData: function(){
  //     console.log("hello world");
  //   }
  // },
  data() {
    return {
      //nodeData: [],
      nodeDataExclude: []
    }
  },
  computed: {

  },
  created() {
  //  console.log(this.option);
    const parent = this.$parent
    if (parent.isTree) {
      this.tree = parent
    } else {
      this.tree = parent.tree
    }

    const tree = this.tree
    if (!tree) {
      console.warn('找不到树节点')
    }
    this.nodeData = (this.treeData || []).slice(0);
    this.nodeDataExclude = (this.treeDataExclude || []).slice(0);


    // var self = this, childrenKey = self.option.childrenKey;
    // this.nodeData.forEach(function (node, i) {
    //   var children;
    //   self.$watch('node', function () { console.log("hello world"); }, { deep: true });
    // })
  },
  methods: {
    handleNodeExpand(id) {
      this.nodeDataExclude[id].expand = !this.nodeDataExclude[id].expand;
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
