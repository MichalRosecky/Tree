<template>
<div class="hello">
  <div class="tree">
    <tree ref='tree' :treeData="treeData" :options="options"/>
  </div>
    <div class="display">
    <pre>
      <p v-for="item in formated">
        <span>id: {{item.id}} , </span><span> label: {{item.label}}  , </span><span> sort: {{item.sort}} , </span><span> parentId: {{item.parentId}} </span>
      </p>
    </pre>
    <a class="button is-dark" @click="getMovement">get data clickMe</a>
  </div>

</div>
</template>

<script>
//import Tree from './tree/tree.vue'
import Tree from 'vue-drag-sort-tree'
export default {
  name: 'hello',
  data() {
    return {
      formated: [],
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
        label: 'id: 1',
        open: true,
        checked: false,
        parentId: null,
        visible: true,
        searched: false,
        children: [{
            id: 2,
            label: 'id: 2',
            checked: false,
            parentId: 1,
            searched: false,
            visible: true,
            children: []
          },
          {
            label: 'id: 3',
            open: true,
            checked: false,
            id: 3,
            parentId: 1,
            visible: true,
            searched: false,
            children: [{
                id: 4,
                parentId: 3,
                label: 'id: 4',
                visible: true,
                searched: false,
                checked: false,
                children: []
              },
              {
                id: 5,
                label: 'id: 5',
                parentId: 3,
                searched: false,
                visible: true,
                checked: false,
                children: [],
              }
            ]
          },
          {
            label: 'id: 6',
            open: true,
            checked: false,
            id: 6,
            parentId: 1,
            visible: true,
            searched: false,
            children: [{
                id: 7,
                parentId: 6,
                label: 'id: 7',
                checked: false,
                searched: false,
                visible: true,
                children: []
              },
              {
                id: 8,
                label: 'id: 8',
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
  },
  methods: {
    getMovement(){
      this.formated = this.$refs.tree.getFomatedData();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.hello {
 display: flex;
 justify-content: space-around;
}
.tree{
  min-width: 30vw;

}
.display{
  min-width: 30vw;
  margin-top: 20px;
}
.test-item-search-class{
  justify-content: center;
}
</style>
