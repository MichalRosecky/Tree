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

 ## Usage

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
export default {
  name: 'hello',
    components: { Tree },
      data() {
        return {
         options: {
            injectComponent: "", // you can custom the content of the tree item, if it empty , component will use default.
            sortKey: 'order',                   
            parentKey: 'parentId',
            searchKey: 'label',
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
      this.formated = this.$refs.tree.getFomatedData();
    }
  }
 }
```
 ## Contact me
 vimmingshe@gmail.com

[1]:https://github.com/VimMing/Tree/blob/master/demonstration.gif
