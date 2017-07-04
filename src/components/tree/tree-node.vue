<template>
<ul class="vim-ul-default">
  <li v-for="(item, index) in nodeData" :data-id="item.id"  v-show="showHide[item.id].nodeVisible"  class="vim-li-default">

    <span class="icon vim-tree-expand-collapse" v-if="showHide[item.id].nodeCL > 0" @click.stop='handleNodeExpand(item.id)'>
      <i :class="showHide[item.id].nodeExpand ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "></i>
    </span>
    <component v-if="treeOptions.injectComponent" :is="treeOptions.injectComponent" :data="item">
    </component>
    <tree-node v-if="item[treeOptions.childrenKey].length > 0" :includeInfo="includeInfo" :treeData="item[treeOptions.childrenKey]"  :treeOptions="treeOptions">
    </tree-node>
  </li>
</ul>
</template>

<script>
export default {
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
  // watch:{
  //   moveData: {
  //     handler: function(val, oldVal){
  //       var oldP, newP, t, oldF = 0, newF = 0, opt = this.treeOptions, arr = [], oldSort, newSort, that = this;
  //       if(val.status){
  //     //    debugger;
  //         oldP = val.oldParentId, newP = val.newParentId, t = this.dataMap.get(val.targetId), oldSort = val.oldSort, newSort = val.newSort;
  //         this.nodeData.forEach(function(item, index){
  //           if(item[opt.parentKey] == newP)
  //             newF = 1;
  //           if(item[opt.parentKey] == oldP)
  //             oldF = 1;
  //
  //           if(item.id == newP && item[opt.childrenKey].length == 0 && opt.added == false ){
  //             item[opt.childrenKey].push(t);
  //             opt.added = true;
  //           }
  //
  //           if(item.id == oldP && item[opt.childrenKey].length == 1){
  //             item[opt.childrenKey] = [];
  //             opt.removed = true;
  //             debugger
  //           }
  //         });
  //
  //         //
  //         // if(this.nodeData.length == 1 && this.nodeData[0].id == t.id && opt.removed == false){
  //         //   debugger;
  //         //   this.nodeData = null;
  //         //   opt.removed = true;
  //         // }
  //
  //
  //       }
  //       // newParent == oldParent
  //       if(newF == 1 && oldF == 1){
  //
  //       }
  //       if(newF ==1 && oldF == 0 && opt.added == false){
  //         //debugger;
  //         this.nodeData.forEach(function(item){
  //            if(item[opt.sortKey] < newSort){
  //              arr[item[opt.sortKey]] = item;
  //            }
  //            if(newSort <= item[opt.sortKey]){
  //              arr[item[opt.sortKey] + 1] = item;
  //              item[opt.sortKey]++;
  //            }
  //         });
  //         arr[newSort] = t;
  //         opt.added = true;
  //       //  debugger;
  //       }
  //       if(newF == 0 && oldF == 1 && opt.removed == false){
  //       //  debugger
  //         this.nodeData.forEach(function(item){
  //            if(item[opt.sortKey] < oldSort && item.id != t.id){
  //              arr[item[opt.sortKey]] = item;
  //            }
  //            if(oldSort < item[opt.sortKey] && item.id != t.id){
  //              arr[item[opt.sortKey] - 1] = item;
  //              item[opt.sortKey]--;
  //            }
  //         });
  //         opt.removed = true;
  //       //  debugger;
  //       }
  //
  //       if( (oldF || newF)){
  //         debugger;
  //         if(arr.length > 0){
  //           this.nodeData = null;
  //           this.nodeData = arr;
  //           if(this.nodeData[0][opt.parentKey] == 3){
  //             debugger;
  //             console.log(this.nodeData);
  //           }
  //         }
  //       }
  //       if(opt.removed && opt.added){
  //         this.updateAction.s = newSort;
  //         this.updateAction.p = newP;
  //         this.updateAction.t = t.id;
  //       }
  //       return ;
  //     },
  //     deep: true
  //   }
  // },
  computed: {

  },
  created() {
    this.nodeData = (this.treeData || []).slice(0);
    this.moveData = this.moveTreeData;
    this.showHide = (this.includeInfo || []).slice(0);
  },
  methods: {
    handleNodeExpand(id) {
      //this.nodeDataExclude[id].expand = !this.nodeDataExclude[id].expand;
      debugger;
      var target;
      if(window.jQuery){
        target = $(event.target).closest('li');
        target.children('ul').toggle();
      }

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
