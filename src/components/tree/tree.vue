<template>
<div class="vue-tree">
  <div class="field has-addons" :class="store.options.searchCls" v-show="store.options.searchShow">
    <p class="control is-expanded">
      <input class="input" type="text" placeholder="search">
    </p>
    <p class="control">
      <a class="button is-success">
        <span class="icon">
          <i class="fa fa-search"></i>
        </span>
      </a>
    </p>
  </div>
  <div class="vim-tree" :id="store.options.treeId">
    <tree-node :treeData='treeDataNode' :treeDataExclude="store.dataExclude" :option="store.options" @handlecheckedChange="handlecheckedChange"></tree-node>
  </div>
</div>
</template>
<script>
import TreeNode from './tree-node.vue'
import TreeStore from './tree-store'
export default {
  name: 'tree',
  props: {
    treeData: [Array],
    options: [Object]
  },
  data() {
    return {
      search: null
    }
  },
  computed: {
    treeDataNode(){
      return this.store.data;
    }
  },
  created() {
    this.isTree = true
    this.store = new TreeStore({
      data: (this.treeData || []).slice(0),
      options: this.options
    })
    var self = this;
    // this.store.data.forEach(function (node) {
    //   self.$watch('node', function () { console.log("hello world"); }, { deep: true, immediate: true });
    // });

  },
  mounted() {
    this.store.loadDragComponent();
  },
  watch: {
    search: function(val) {
      this.store.filterNodes(val, this.options.search)
    }
  },
  methods: {
    handlecheckedChange(node) {
      this.store.changeCheckStatus(node)
    },
    // getSelectedNodes () {
    //   const allnodes = this.store.datas
    //   let selectedNodes = []
    //   for (let [, node] of allnodes) {
    //     if (node.checked) {
    //       selectedNodes.push(node)
    //     }
    //   }
    //   return selectedNodes
    // },
    // getSelectedNodeIds () {
    //   const allnodes = this.store.datas
    //   let selectedNodeIds = []
    //   for (let [, node] of allnodes) {
    //     if (node.checked) {
    //       selectedNodeIds.push(node.id)
    //     }
    //   }
    //   return selectedNodeIds
    // }
  },
  components: {
    TreeNode
  }
}
</script>

<style>
.vim-tree,
.vim-tree ul {
  margin: 1em 0 0 1em;
  padding: 0;
  list-style: none;
  color: #00d1b2;
  position: relative;
}

.vim-tree ul {
  margin-left: 0.5em;
}


/* (indentation/2) */

.vim-tree ul:before,
.vim-tree:before {
  content: "";
  display: block;
  width: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-left: 1px solid;
}

.vim-tree li {
  margin: 1em 0 0;
  padding: 0 0 0 1.5em;
  /* indentation + .5em */
  line-height: 2em;
  /* default list item's `line-height` */
  font-weight: bold;
  position: relative;
}

.vim-tree li:before {
  content: "";
  display: block;
  width: 10px;
  /* same with indentation */
  height: 0;
  border-top: 1px solid;
  margin-top: -1px;
  /* border top width */
  position: absolute;
  top: 1em;
  /* (line-height/2) */
  left: 0;
}

.vim-tree li:last-child:before {
  background: white;
  /* same with body background */
  height: auto;
  top: 1em;
  /* (line-height/2) */
  bottom: 0;
}

.vim-empty-default,
.vim-li-default,
.vim-placeholder-default {
  position: relative;
  margin: 0;
  padding: 0;
  min-height: 30px;
  //  font-size: 13px;
  line-height: 20px;
  list-style: none;
}

.vim-li-default>span.vim-tree-expand-collapse {
  position: relative;
  left: -27px;
  top: 4px;
  margin-right: -23px;
  float: left;
}

.vim-li-default>button {
  display: block;
  position: relative;
  cursor: pointer;
  float: left;
  width: 25px;
  height: 20px;
  margin: 5px 0;
  padding: 0;
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
  border: 0;
  background: transparent;
  font-size: 12px;
  line-height: 1;
  text-align: center;
  font-weight: bold;
  top: 5px;
}

.vim-li-default>button:before {
  content: '+';
  display: block;
  position: absolute;
  width: 100%;
  text-align: center;
  text-indent: 0;
}

.vim-li-default>button[data-action="collapse"]:before {
  content: '-';
}

.vim-empty-default,
.vim-placeholder-default {
  margin: 5px 0;
  padding: 0;
  min-height: 30px;
  background: #f2fbff;
  border: 1px dashed #b6bcbf;
  box-sizing: border-box;
}

.vim-empty-default {
  border: 1px dashed #bbb;
  min-height: 100px;
  background-color: #e5e5e5;
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
}

.vim-handle-default {
  min-width: 30px;
  text-decoration: none;
}

.vim-dragel-default {
  position: absolute;
  pointer-events: none;
  z-index: 999;
}
</style>
