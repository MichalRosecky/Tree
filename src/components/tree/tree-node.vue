<template>
<ul>
  <li v-for="(item, index) in nodeData" :data-id="item.id"  v-show="showHide[item.id].nodeVisible">
    <span class="collapse-expand"v-if="showHide[item.id].nodeCL > 0" @click.stop='handleNodeExpand(item.id)'>
      {{ showHide[item.id].nodeExpand ? "+" : "-"}}
    </span>
    <div class="handle">
      <cell :d="item"></cell>
    </div>
    <tree-node v-if="item[treeOptions.childrenKey].length > 0" :includeInfo="includeInfo" :treeData="item[treeOptions.childrenKey]"  :treeOptions="treeOptions">
    </tree-node>
  </li>
</ul>
</template>

<script>
  import t from "./cell.vue";
  import {closestNode} from "./util"
  export default {
  components: {
    "cell": t,
  },
  name: 'treeNode',
  props: {
    treeData: [Array],
    treeOptions: [Object],
    includeInfo: [Array]
  },
  data() {
    return {
      nodeData: [],
      showHide: []
    }
  },
  computed: {

  },
  created() {
    this.nodeData = (this.treeData || []).slice(0);
    this.showHide = (this.includeInfo || []).slice(0);
  },
  methods: {
    handleNodeExpand(id) {
      closestNode(event.target, 'li').querySelector('ul').style.display = !this.showHide[id].nodeExpand ? "block" : "none";
      this.showHide[id].nodeExpand = !this.includeInfo[id].nodeExpand;
    },
  }
}
</script>
