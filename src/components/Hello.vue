<template>
<div class="hello">
  <div class="tree">
    <tree ref='tree' :treeData="treeData" :options="options" />
  </div>
  <div class="display">
    <pre>
      <p v-for="item in formated">
        <span>id: {{item.id}} , </span><span> sort: {{item.sort}} , </span><span> parentId: {{item.parentId}} </span>
      </p>
    </pre>
    <a class="button is-dark" @click="getMovement">get data clickMe</a>
  </div>
</div>
</template>

<script>
import Tree from './tree/index'
//import Tree from '../../dist/index.js'
import t from "./tree/cell.vue"
import  "./tree/tree.scss"
const tree = Tree(t);
export default {
  name: 'hello',
  data() {
    return {
      formated: [],
      options: {
      },
      treeData: [{
        id: 1,

        open: true,
        parentId: null,
        children: [{
            id: 2,
            parentId: 1,
            children: []
          },
          {

            open: true,
            id: 3,
            parentId: 1,
            children: [{
                id: 4,
                parentId: 3,
                children: []
              },
              {
                id: 5,

                parentId: 3,
                children: [],
              }
            ]
          },
          {

            open: true,
            id: 6,
            parentId: 1,
            children: [{
                id: 7,
                parentId: 6,
                children: []
              },
              {
                id: 8,

                parentId: 6,
                children: []
              }
            ]
          }
        ]
      }]
    }
  },
  components: {
    tree
  },
  methods: {
    getMovement() {
      this.formated = this.$refs.tree.reformatData();
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

.tree {
  min-width: 30vw;
}

.display {
  min-width: 30vw;
  margin-top: 20px;
}

</style>
