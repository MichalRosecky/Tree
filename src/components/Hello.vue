<template>
<div class="hello">
  <tree ref='tree' :treeData="treeData" :options="options" />
</div>
</template>

<script>
import Tree from './tree/tree.vue'
export default {
  name: 'hello',
  data() {
    return {
      options: {
        showCheckbox: true,
        search: {
          useInitial: true,
          useEnglish: false,
          customFilter: null
        },
        injectComponent: "testItem",
        searchCls: "test-item-search-class",
      },
      treeData: [{
        id: 1,
        label: '一级节点',
        open: true,
        checked: false,
        parentId: null,
        visible: true,
        searched: false,
        children: [{
            id: 2,
            label: '二级节点-1',
            checked: false,
            parentId: 1,
            searched: false,
            visible: true,
            children: []
          },
          {
            label: '二级节点-2',
            open: true,
            checked: false,
            id: 3,
            parentId: 1,
            visible: true,
            searched: false,
            children: [{
                id: 4,
                parentId: 3,
                label: '三级节点-1',
                visible: true,
                searched: false,
                checked: false,
                children: []
              },
              {
                id: 5,
                label: '三级节点-2',
                parentId: 3,
                searched: false,
                visible: true,
                checked: false,
                children: [],
              }
            ]
          },
          {
            label: '二级节点-3',
            open: true,
            checked: false,
            id: 6,
            parentId: 1,
            visible: true,
            searched: false,
            children: [{
                id: 7,
                parentId: 6,
                label: '三级节点-4',
                checked: false,
                searched: false,
                visible: true,
                children: []
              },
              {
                id: 8,
                label: '三级节点-5',
                parentId: 6,
                checked: false,
                searched: false,
                visible: true,
                children: []
              }
            ]
          }
        ]
      }]
    }
  },
  components: {
    Tree
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.hello {
  width: 50vw;
  height: 50vh;
  margin: auto;
}
.test-item-search-class{
  justify-content: center;
}
</style>
