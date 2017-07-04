<template>
<div class="vue-tree">
  <div class="field has-addons" :class="treeOptions.searchCls" v-show="treeOptions.searchShow">
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
  <div class="vim-tree" :id="treeOptions.treeId" v-on:mousedown="dragStart" v-on:mousemove="dragMove" v-on:mouseup="dragStop">
    <tree-node  :treeData='treeDataNode' :treeOptions="treeOptions" :includeInfo="includeInfo" @handlecheckedChange="handlecheckedChange"></tree-node>
  </div>
  <div v-show="placeEl" :class="treeOptions.placeClass"></div>
  <ul v-show="dragEl" :class="[treeOptions.listClass , treeOptions.dragClass]"></ul>
  </div>
</template>
<script>
import TreeNode from './tree-node.vue'
//import TreeStore from './tree-store'
import Vue from 'vue'
export default {
  name: 'tree',
  props: {
    treeData: [Array],
    options: [Object]
  },
  data() {
    return {
      search: null,
      treeDataNode: [],
      dragEl: false,
      placeEl: false,
      moveData: [],
      updateAction: {
        s: "",
        p: "",
        t: ""
      },
      includeInfo: [],
      treeOptions: {
        treeId: 'treeId-'+new Date().getTime(),
        listNodeName: 'ul',
        itemNodeName: 'li',
        rootClass: 'dd',
        listClass: 'vim-ul-default',
        itemClass: 'vim-li-default',
        dragClass: 'vim-dragel-default',
        handleClass: 'vim-handle-default',
        placeClass: 'vim-placeholder-default',
        noDragClass: 'dd-nodrag',
        emptyClass: 'vim-empty-default',
        sortKey: 'sort',
        parentKey: 'parentId',
        searchKey: 'name',
        childrenKey: "children",
        searchCls: '',
        searchShow: false,
        injectComponent: "",
        group: 0,
        maxDepth: 5,
        threshold: 20,
        removed: false,
        added: false
      },
    }
  },
  // watch:{
  //   moveData: {
  //     handler: function(val, oldVal){
  //       console.log(val);
  //     },
  //     deep: true
  //   },
  // updateAction: {
  //   handler: function(val, oldVal){
  //     var t = this.dataMap.get(val.t);
  //     t[this.treeOptions.sortKey] = val.s;
  //     t[this.treeOptions.parentKey] = val.p;
  //     //console.log(this.dataMap.get(3));
  //     //console.log(this.dataMap.get(4));
  //   },
  //   deep: true
  // },
  //   search: function(val) {
  //     //this.store.filterNodes(val, this.options.search)
  //   }
  // },
  created() {

    for (let option in this.options) {
      if(this.options.hasOwnProperty(option))
        this.treeOptions[option] = this.options[option];
    }

    this.dataMap = new Map();
    const _traverseNodes = (root) => {
      let i = 0;
      for (let node of root) {
        this.dataMap.set(node.id, node);
        this.includeInfo[node.id] = {};
        this.includeInfo[node.id].nodeVisible = true;
        this.includeInfo[node.id].nodeExpand = true;
        this.includeInfo[node.id].nodeCL = node.children.length;
        node[this.treeOptions.sortKey] = i++;
        if (node.children && node.children.length > 0) _traverseNodes(node.children)
      }
    }
    this.treeData = this.treeData instanceof Array ? this.treeData: [this.treeData];
    _traverseNodes(this.treeData);
    this.treeDataNode = this.treeData;



    this.reset();

    //this.$watch('this.moveData', function (newValue, oldValue) { console.log(newValue); }, { deep: true });
  },
  mounted() {

  },
  methods: {
    getFomatedData(){
      var res = [];
      var opt = this.treeOptions;
      this.dataMap.forEach(function(item){
        var temp = {};
        for(var key in item){
          if(key != opt.childrenKey){
            temp[key] = item[key];
          }
        }
        res.push(temp);
      });
      return res;
    },
    userOperation(){
      return this.moveData;
    },
    dragStart: function(e){
      var handle, mouse = this.mouse, target, dragItem, opt = this.treeOptions, placeEl, dragEl;
      if(window.jQuery){

        // get mouse's offset
        mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
        mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
        mouse.startX = mouse.lastX = e.pageX;
        mouse.startY = mouse.lastY = e.pageY;

        //$ = window.jQuery;
        handle = $(e.target);
        if (!handle.hasClass(opt.handleClass)) {
          if (handle.closest('.' + opt.noDragClass).length) {
            return;
          }
          handle = handle.closest('.' + opt.handleClass);
        }
        if (!handle.length || this.dragEl) {
          return;
        }

        e.preventDefault();
        target = $(e.target);
        dragItem = target.closest(opt.itemNodeName);

        this.oldP = dragItem.parent(opt.listNodeName);

        //debugger
        //set the placeEl
        this.placeEl = true;
        placeEl = $('.'+opt.placeClass);
        placeEl.css('height', dragItem.height());
        // set the dragEl
        this.dragEl = true;
        dragEl = $('.'+opt.dragClass);
        dragEl.children().remove();
        dragEl.css('width', dragItem.width());

        // move dragItem to the dragEl
        dragItem.after(placeEl);
        dragItem[0].parentNode.removeChild(dragItem[0]);
        dragItem.appendTo(dragEl);

// debugger;
        dragEl.css({
          'left': e.pageX - mouse.offsetX,
          'top': e.pageY - mouse.offsetY
        });


      }
    },
    dragMove: function(e){

      var dragEl, placeEl, parent, prev, expand, next, opt , list, mouse ;
      if(this.dragEl){
        if(window.jQuery){
          opt = this.treeOptions, mouse = this.mouse , dragEl= $('.'+opt.dragClass), placeEl= $('.'+opt.placeClass);
          dragEl.css({
            'left': e.pageX - mouse.offsetX,
            'top': e.pageY - mouse.offsetY
          });
          // mouse position last events
          mouse.lastX = mouse.nowX;
          mouse.lastY = mouse.nowY;
          // mouse position this events
          mouse.nowX = e.pageX;
          mouse.nowY = e.pageY;
          // distance mouse moved between events
          mouse.distX = mouse.nowX - mouse.lastX;
          mouse.distY = mouse.nowY - mouse.lastY;
          // direction mouse was moving
          mouse.lastDirX = mouse.dirX;
          mouse.lastDirY = mouse.dirY;
          // direction mouse is now moving (on both axis)
          mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
          mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
          // axis mouse is now moving on
          var newAx = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

          // do nothing on first move
          if (!mouse.moving) {
            mouse.dirAx = newAx;
            mouse.moving = true;
            return;
          }

          // calc distance moved on this axis (and direction)
          if (mouse.dirAx !== newAx) {
          mouse.distAxX = 0;
          mouse.distAxY = 0;
          } else {
          mouse.distAxX += Math.abs(mouse.distX);
          if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
            mouse.distAxX = 0;
          }
          mouse.distAxY += Math.abs(mouse.distY);
          if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
            mouse.distAxY = 0;
          }
          }
          mouse.dirAx = newAx;
          /*** move horizontal*/

          if(mouse.dirAx && opt.threshold <= mouse.distAxX){
            // reset move distance on x-axis for new phase
              mouse.distAxX = 0;
              prev = placeEl.prev(opt.itemNodeName);
            //  debugger;
              expand = prev.length ? this.includeInfo[prev.data('id')].nodeExpand : false;
              // increase horizontal level if previous sibling exists and is not collapsed
              if(mouse.distX > 0 && expand){
                list = prev.find(opt.listNodeName).last();
                if(!list.length){
                  list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
                  list.append(placeEl);
                  prev.append(list);
                }else{
                  // else append to next level up
                  list = prev.children(opt.listNodeName).last();
                  list.append(placeEl);
                }
              }
              // decrease horizontal level
            if (mouse.distX < 0) {
              //debugger;
              // we can't decrease a level if an item preceeds the current one
              next = placeEl.next(opt.itemNodeName);
              if (!next.length) {
                placeEl.closest(opt.itemNodeName).after(placeEl);
              }
            }
          }

          /* move vertical*/
          if(!mouse.dirAx){
              var isEmpty = false;
              // find list item under cursor

              this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));

              if (this.pointEl.hasClass(opt.handleClass)) {
                this.pointEl = this.pointEl.parent(opt.itemNodeName);
              }
              if (this.pointEl.hasClass(opt.emptyClass)) {
                isEmpty = true;
              } else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
                return;
              }
              var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
              // if empty create new list to replace empty placeholder
              if (isEmpty) {
                list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
                list.append(placeEl);
                this.pointEl.replaceWith(list);
              } else if (before) {
                this.pointEl.before(placeEl);
              } else {
                this.pointEl.after(placeEl);
              }
          }
        }

      }
    },
    dragStop: function(e){
      e =  e.touches ? e.touches[0] : e;
      //debugger;
      var el,opt, target, newParent, oldParent, newParentId, targetId, oldParentId, newSort, oldSort, dragEl, placeEl, moveData, children;
      if(this.dragEl){
        console.log(this.treeDataNode);
        opt = this.treeOptions;
        placeEl= $('.'+opt.placeClass);
        dragEl= $('.'+opt.dragClass);
         el = dragEl.children(opt.itemNodeName).first();
         // have bug
         newSort = placeEl.prevAll(opt.itemNodeName).length;
         newParentId =placeEl.closest('li').data('id');
         targetId = el.data('id');
         target = this.dataMap.get(targetId);
         oldParentId = target[opt.parentKey];
         newParent = this.dataMap.get(newParentId);
         oldParent  = this.dataMap.get(oldParentId);
         oldSort = target[opt.sortKey];
         if(newParentId)
           this.includeInfo[newParentId].nodeCL++;
        if(oldParentId)
           this.includeInfo[oldParentId].nodeCL--;
        //debugger;
        moveData =  {
          parentchange: targetId +" : " + oldParentId + "=>" + newParentId,
          sortChange: oldSort + "=>" + newSort
         }
         this.moveData.push(moveData);

          el[0].parentNode.removeChild(el[0]);
          placeEl.after(el);

        this.newP = el.parent(opt.listNodeName);
        children = this.oldP.children(opt.itemNodeName);
//debugger;
        for(var i = 0; i < children.length; i++){
          let item = $(children[i]);
          let tempId = item.data('id');
          let tempObj = this.dataMap.get(tempId);
          tempObj[opt.sortKey] = i;
        }

        children = this.newP.children(opt.itemNodeName);

        for(var i = 0; i < children.length; i++){
          let item = $(children[i]);
          let tempId = item.data('id');
          let tempObj = this.dataMap.get(tempId);
          tempObj[opt.sortKey] = i;
        }

        target[opt.parentKey] = newParentId;

         this.placeEl = false;
         this.dragEl = false;

         console.log("oldSort:" + oldSort + " newSort:" + newSort);
    }
  },
    reset: function(){
      this.mouse = {
        offsetX: 0,
        offsetY: 0,
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
        nowX: 0,
        nowY: 0,
        distX: 0,
        distY: 0,
        dirAx: 0,
        dirX: 0,
        dirY: 0,
        lastDirX: 0,
        lastDirY: 0,
        distAxX: 0,
        distAxY: 0
      };
    this.isTouch = false;
    this.moving = false;
    this.dragEl = false,
    this.placeEl = false,
    this.dragRootEl = null;
    this.dragDepth = 0;
    this.hasNewRoot = false;
    this.pointEl = null;
    },
    handlecheckedChange(node) {
      this.store.changeCheckStatus(node)
    },
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
