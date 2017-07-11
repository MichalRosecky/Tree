# tree

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
            injectComponent: "defaultTemplate", // you can custom the content of the tree item
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
            children: [{
                id: 2,
                order: 0,
                label: 'id: 2',
                parentId: 1,
                children: []
               }]
           }
          ]
    },
   methods: {
    getdata(){
      this.formated = this.$refs.tree.getFomatedData();
    }
  }
 }
 
 // defaultTemplate.vue
 <template>
<div class="card">
  <header class="card-header">
    <p class="card-header-title" :class="opt.handleClass" > {{data[opt.searchKey]}}</p>
    <a class="card-header-icon" @click="visible= !visible"></a>
  </header>
  <div class="card-content" v-show="visible"><span>content</span></div>
</div>
</template>
<script>
export default {
  name: "defaultTemplate",
  props: ['data', 'opt'],
  data() {
    return {
      visible: false,
    }
  },
}
</script>
// you can write your custom component like above.  
```
 ## Contact me
 vimmingshe@gmail.com

[1]:https://github.com/VimMing/Tree/blob/master/demonstration.gif


