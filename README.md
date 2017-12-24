# tree [github](https://github.com/VimMing/Tree) [npm](https://www.npmjs.com/package/vue-drag-sort-tree)

> A Vue.js component

## Effect
>

![1]


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9000
npm run dev
```
## Install

```

npm install vue-drag-sort-tree --save


```

 ## Basic Usage

```

// demo.Vue
<template>
<div class="hello">
  <div class="tree">
    <tree ref='tree' :treeData="treeData" :options="options"/>
  </div>
</template>

<script>
import Tree from 'vue-drag-sort-tree'
const tree = Tree();

export default {
  name: 'hello',
    components: { tree },
      data() {
        return {
         options: {
            sortKey: 'order',
            parentKey: 'parentId',
            childrenKey: "children",
          },
          treeData: [
            {
              id: 1,
              label: 'id: 1',
              order: 0,
              parentId: null,
              children: []
           }
          ]
    },
   methods: {
    getdata(){
      this.formated = this.$refs.tree.reformatData();
    }
  }
 }
```

## Advantage Usage

```
// tpl.vue
<template>
  <span class="dragger">{{data.id}}</span>
</template>

<script>
  export default {
    props: {
      d: [Object]
    },
    data() {
      return {
        data: {}
      }
    },
    mounted(){
      this.data = this.d;
    }
  }
</script>

// demo.vue

<script>
import Tree from 'vue-drag-sort-tree'
import tpl from 'tpl.vue'
const tree = Tree(tpl);
</script>

...         options: {
            sortKey: 'order',
            parentKey: 'parentId',
            childrenKey: "children",
            handle: "dragger"
          },
          ....



```

 ## Contact me
 vimmingshe@gmail.com

[1]:https://github.com/VimMing/Tree/blob/master/demonstration.gif
