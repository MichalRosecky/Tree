<template>
<div class="vue-tree" :id="treeOptions.treeId">
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
  <div class="vim-tree"  v-on:mousedown="dragStart" v-on:mousemove="dragMove" v-on:mouseup="dragStop">
    <tree-node :treeData='treeDataNode' :treeOptions="treeOptions" :includeInfo="includeInfo" @handlecheckedChange="handlecheckedChange"></tree-node>
  </div>
  <div v-show="placeEl" class="placeHolder" :class="treeOptions.placeClass"></div>
  <ul v-show="dragEl" class="dragel" :class="[treeOptions.listClass , treeOptions.dragClass]"></ul>
  </div>
</template>
<script>
import TreeNode from './tree-node.vue'
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
      includeInfo: [],
      treeOptions: {
        treeId: 'treeId-'+new Date().getTime(),
        listNodeName: 'ul',
        itemNodeName: 'li',
        listClass: 'vim-ul-default',
        itemClass: 'vim-li-default',
        dragClass: 'vim-dragel-default',
        handleClass: 'vim-handle-default',
        placeClass: 'vim-placeholder-default',
        noDragClass: 'dd-nodrag',
        emptyClass: 'vim-empty-default',
        sortKey: 'sort',
        parentKey: 'parentId',
        searchKey: 'label',
        childrenKey: "children",
        searchCls: '',
        searchShow: false,
        injectComponent: "",
        threshold: 20,
      },
    }
  },
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

  },
  mounted() {
    this.root = document.getElementById(this.treeOptions.treeId);
  },
  methods: {
    closest(el ,selector){
      while(el){
        if(el.matches(selector)){
          return el;
        }
        el = el.parentElement;
      }
      return null;
    },
    parent(el, selector){
      el = el.parentElement;
      while(el){
        if(el.matches(selector)){
          return el;
        }
        el = el.parentElement;
      }
      return null;
    },
    prev(el, selector){
      //el = el.previousSibling;
      el = el.previousElementSibling;
      //debugger;
      while(el){
        if(el.matches(selector)){
          return el;
        }
      el = el.previousElementSibling;
      }
      return null;
    },
    next(el, selector){
      //el = el.nextSibling;
      el = el.nextElementSibling;
      while(el){
        if(el.matches(selector)){
          return el;
        }
        el = el.nextElementSibling;
      }
      return null;
    },
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
      var handle, mouse = this.mouse, target = e.target, dragItem, opt = this.treeOptions, placeEl, dragEl;
      mouse.offsetX = e.offsetX;
      mouse.offsetY = e.offsetY;
      mouse.startX = mouse.lastX = e.pageX;
      mouse.startY = mouse.lastY = e.pageY;

      if(window.jQuery){
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

        this.placeEl = true;
        placeEl = $('.'+opt.placeClass);
        placeEl.css('height', dragItem.height());
        this.placeElObj = placeEl;


        this.dragEl = true;
        dragEl = $('.'+opt.dragClass);
        this.dragElObj = dragEl;
        dragEl.children().remove();
        dragEl.css('width', dragItem.width());

        // move dragItem to the dragEl
        dragItem.after(placeEl);
        dragItem[0].parentNode.removeChild(dragItem[0]);
        dragItem.appendTo(dragEl);
        dragEl.css({
          'left': e.pageX - mouse.offsetX,
          'top': e.pageY - mouse.offsetY
        });
      }else{
        if(!target.classList.contains(opt.handleClass)){
          target = this.closest(target , '.' + opt.handleClass);
        }
        if (!target || this.dragEl) {
          return;
        }
        e.preventDefault();

        dragItem = this.closest(target , opt.itemNodeName);
        this.oldP = this.parent(dragItem, opt.listNodeName);

        this.placeEl = true;
        [placeEl] = this.root.getElementsByClassName(opt.placeClass);

        placeEl.style.height = dragItem.offsetHeight + "px";

        this.dragEl = true;
        [dragEl] = this.root.getElementsByClassName(opt.dragClass);
        dragEl.innerHTML = '';
        dragEl.style.width = dragItem.offsetWidth + "px";

        dragItem.parentNode.insertBefore(placeEl, dragItem);
        dragItem.parentNode.removeChild(dragItem);
        dragEl.appendChild(dragItem);

        dragEl.style.left = (e.pageX - mouse.offsetX) + "px";
        dragEl.style.top = (e.pageY - mouse.offsetY) + "px";
        this.placeElObj = placeEl;
        this.dragElObj = dragEl;
      }


    },
    setMouse: function(e){
      var mouse = this.mouse;
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
    },
    moveHJquery: function(e){
      var dragEl = this.dragElObj , placeEl = this.placeElObj, parent, prev, expand, next, opt = this.treeOptions , list, mouse = this.mouse;
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
          if (!next.length && placeEl.closest(opt.itemNodeName)) {
            placeEl.closest(opt.itemNodeName).after(placeEl);
          }
        }


    },
    moveH: function(e){
        var dragEl = this.dragElObj , placeEl = this.placeElObj, parent, prev, expand, next, opt = this.treeOptions , list, mouse = this.mouse;
          // reset move distance on x-axis for new phase
          mouse.distAxX = 0;
          prev = this.prev(placeEl, opt.itemNodeName);
          expand = prev ? this.includeInfo[prev.dataset.id].nodeExpand : false;
          if(mouse.distX > 0 && expand){
            list = prev.querySelectorAll(opt.itemNodeName);
            if(!list.length){
              list = document.createElement(opt.listNodeName);
              list.className = opt.listClass;
              list.appendChild(placeEl);
              prev.appendChild(list);
            }else{
              list = list[list.length - 1];
              list.appendChild(placeEl);
            }
          }
          if(mouse.distX < 0){
            next = this.next(placeEl, opt.itemNodeName);
            parent = this.closest(placeEl, opt.itemNodeName);
            if(!next && parent){
              // have bug
              if(!parent)
                debugger;
              parent.parentElement.insertBefore(placeEl, parent.nextSibling);
            }

          }
    },
    moveVJquery: function(e){
      var dragEl = this.dragElObj , placeEl = this.placeElObj, parent, prev, expand, next, opt = this.treeOptions , list, mouse = this.mouse;
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
    },
    moveV: function(e){
        var dragEl = this.dragElObj , placeEl = this.placeElObj, parent, prev, expand, next, opt = this.treeOptions , list, mouse = this.mouse;
        this.pointEl = document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop));
        if(this.pointEl.classList.contains(opt.handleClass)){
          this.pointEl = this.parent(this.pointEl , opt.itemNodeName);
        }
        if(!this.pointEl || !this.pointEl.classList.contains(opt.itemClass)) return;
      //  debugger;
        var before = e.offsetY < (this.pointEl.offsetHeight / 2);
        if(before){
          this.pointEl.parentElement.insertBefore(placeEl, this.pointEl);
        }else{
          this.pointEl.parentElement.insertBefore(placeEl, this.pointEl.nextSibling);
        }
    },
    dragMove: function(e){

      var dragEl = this.dragElObj, opt = this.treeOptions, mouse = this.mouse, left = e.pageX - mouse.offsetX, top = e.pageY - mouse.offsetY ;
      if(this.dragEl){
        this.setMouse(e);
        window.jQuery ? dragEl.css({'left': left, 'top': top}) : (dragEl.style.left = `${left}px` , dragEl.style.top=`${top}px`);
          /*** move horizontal*/
          if(mouse.dirAx && opt.threshold <= mouse.distAxX){
            // reset move distance on x-axis for new phase
             window.jQuery ? this.moveHJquery(e) : this.moveH(e);
          }
          /* move vertical*/
          if(!mouse.dirAx){
              var isEmpty = false;
               window.jQuery ? this.moveVJquery(e): this.moveV(e);
          }
      }
    },
    dragStop: function(e){
      e =  e.touches ? e.touches[0] : e;
      //debugger;
      var el,opt, target, newParent, oldParent, newParentId, targetId, oldParentId, newSort, oldSort, dragEl, placeEl, children;
      if(this.dragEl){
      //debugger;
        opt = this.treeOptions;
        placeEl= this.placeElObj;
        dragEl=  this.dragElObj;
         el = window.jQuery ? dragEl.children(opt.itemNodeName).first() : dragEl.querySelector(opt.itemNodeName);

         //newSort = window.jQuery ? placeEl.prevAll(opt.itemNodeName).length : this.prevL(placeEl, opt.itemNodeName);
         newParentId =window.jQuery ? placeEl.closest('li').data('id') : (this.closest(placeEl, opt.itemNodeName) ? this.closest(placeEl, opt.itemNodeName).dataset.id : 0);
         targetId = window.jQuery ? el.data('id'): el.dataset.id;
         newParentId = parseInt(newParentId);
         targetId = parseInt(targetId);
         target = this.dataMap.get(targetId);
         oldParentId = parseInt(target[opt.parentKey]);
         //newParent = this.dataMap.get(newParentId);
         //oldParent  = this.dataMap.get(oldParentId);
         //oldSort = target[opt.sortKey];
         if(newParentId)
           this.includeInfo[newParentId].nodeCL++;
        if(oldParentId)
           this.includeInfo[oldParentId].nodeCL--;

          window.jQuery ? el[0].parentNode.removeChild(el[0]) : el.parentNode.removeChild(el);
          window.jQuery ? placeEl.after(el) : placeEl.parentElement.insertBefore(el, placeEl);

        this.newP = window.jQuery ? el.parent(opt.listNodeName) : this.parent(el, opt.listNodeName);
        children = window.jQuery ? this.oldP.children(opt.itemNodeName) : this.oldP.childNodes;

        this.setSort(children, opt);

        children = window.jQuery ? this.newP.children(opt.itemNodeName) : this.newP.childNodes;

        this.setSort(children, opt);

        target[opt.parentKey] = newParentId;

         this.placeEl = false;
         this.dragEl = false;

        // console.log("oldSort:" + oldSort + " newSort:" + newSort);
    }
  },
  setSort(children, opt){
    for(var i = 0, j = 0; i < children.length; i++){
      let item, tempId, tempObj;
      if(window.jQuery){
        item = $(children[i]);
        tempId = item.data('id');
      }else{
          if(children[i].matches(opt.itemNodeName)) tempId = children[i].dataset.id;
          else
            continue;
      }
      tempId = parseInt(tempId);
      tempObj = this.dataMap.get(tempId);
      debugger;
      tempObj[opt.sortKey] = j++;
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

<style lang="scss">
.vim-tree {
  margin: 1em 0 0 1em;
  padding: 0;
  padding-bottom: 1px;
  list-style: none;
  color: #00d1b2;
  position: relative;
  ul {
    list-style: none;
    margin: 1em 0 0 1em;
    position: relative;
  }
  ul:before{
    content: "";
    display: block;
    width: 0;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-left: 1px solid;
  }
  li{
    margin: 1em 0 0;
    padding: 0 0 0 1.5em;
    line-height: 2em;
    font-weight: bold;
    position: relative;
  }

  li:before {
    content: "";
    display: block;
    width: 10px;
    height: 0;
    border-top: 1px solid;
    margin-top: -1px;
    position: absolute;
    top: 1em;
    left: 0;
  }

  li>span.vim-tree-expand-collapse{
    position: relative;
    left: -27px;
    top: 4px;
    margin-right: -23px;
    float: left;
  }
  li:last-child:before {
    background: white;
    height: auto;
    top: 1em;
    bottom: 0;
  }

}
.vim-tree:before{
  content: "";
  display: block;
  width: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-left: 1px solid;
}

.placeHolder{
  margin: 5px 0;
  padding: 0;
  min-height: 30px;
  background: #f2fbff;
  border: 1px dashed #b6bcbf;
  box-sizing: border-box;
  line-height: 20px;
  list-style: none;
  position: relative;
}

.dragel{
  position: absolute;
  pointer-events: none;
  z-index: 999;
}

</style>
