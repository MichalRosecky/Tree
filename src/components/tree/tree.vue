<template>
<div :id="treeOptions.treeId">

  <div class="vim-tree" v-on:mousedown="dragStart" v-on:mousemove="dragMove" v-on:mouseup="dragStop">
    <tree-node :treeData='treeDataNode' :treeOptions="treeOptions" :includeInfo="includeInfo"></tree-node>
  </div>

  <div v-show="placeEl" class="placeHolder"></div>
  <ul v-show="dragEl" class="dragEl"></ul>

</div>
</template>

<script>

  import TreeNode from './tree-node.vue'
  import {nextNode, prevNode, parentNode, closestNode} from './util'

  export default {
  name: 'tree',
  props: {
    treeData: [Array],
    options: [Object]
  },
  data() {
    return {
      treeDataNode: [],
      dragEl: false,
      placeEl: false,
      includeInfo: [],
      treeOptions: {
        treeId: 'treeId-' + new Date().getTime(),
        handleClass: 'handle',
        sortKey: 'sort',
        parentKey: 'parentId',
        childrenKey: "children",
        threshold: 5,
      },
    }
  },
  created() {
    Object.assign(this.treeOptions, this.options);

    this.dataMap = new Map();
    const _traverseNodes = (root) => {
      let i = 0;
      for (let node of root) {
        this.dataMap.set(node.id, node);

        this.includeInfo[node.id] = {
          "nodeVisible": true,
          "nodeExpand": true,
          "nodeCL": node.children.length
        };
        node[this.treeOptions.sortKey] = i++;
        if (node.children && node.children.length > 0) _traverseNodes(node.children)
      }
    }
    this.treeData = this.treeData instanceof Array ? this.treeData : [this.treeData];

    _traverseNodes(this.treeData);
    this.treeDataNode = this.treeData;


    this.reset();

  },
  mounted() {
    let opt = this.treeOptions;
    this.root = document.getElementById(this.treeOptions.treeId);
    [this.dragElObj] = this.root.getElementsByClassName("dragEl");
    [this.placeElObj] = this.root.getElementsByClassName("placeHolder");
    document.body.appendChild(this.dragElObj);
  },

  methods: {
    reformatData() {
      var res = [];
      var opt = this.treeOptions;
      this.dataMap.forEach(function(item) {
        let temp = {};
        for (let key in item) {
          if (key != opt.childrenKey) {
            temp[key] = item[key];
          }
        }
        res.push(temp);
      });
      return res;
    },

    dragStart: function(e) {
      var mouse = this.mouse,
        target = e.target,
        dragItem, opt = this.treeOptions,
        placeEl, dragEl;
      mouse.offsetX = e.offsetX;
      mouse.offsetY = e.offsetY;
      mouse.startX = mouse.lastX = e.pageX;
      mouse.startY = mouse.lastY = e.pageY;

      if (!target.classList.contains(opt.handleClass)) {
        target = closestNode(target, '.' + opt.handleClass);
      }
      if (!target || this.dragEl) {
        return;
      }
      e.preventDefault();

      dragItem = closestNode(target, "li");
      this.oldP = parentNode(dragItem, "ul");

      this.placeEl = true;
      placeEl = this.placeElObj;

      placeEl.style.height = dragItem.offsetHeight + "px";

      this.dragEl = true;
      dragEl = this.dragElObj;
      dragEl.innerHTML = '';
      dragEl.style.width = dragItem.offsetWidth + "px";

      dragItem.parentNode.insertBefore(placeEl, dragItem);
      dragItem.parentNode.removeChild(dragItem);
      dragEl.appendChild(dragItem);

      dragEl.style.left = (e.pageX - mouse.offsetX) + "px";
      dragEl.style.top = (e.pageY - mouse.offsetY) + "px";

    },
    setMouse: function(e) {
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
    moveH: function(e) {
      let placeEl = this.placeElObj, parent, prev, expand, next, opt = this.treeOptions,
        list, mouse = this.mouse;
      // reset move distance on x-axis for new phase
      mouse.distAxX = 0;

      prev = prevNode(placeEl, "li");
      expand = prev ? this.includeInfo[prev.dataset.id].nodeExpand : false;
      if (mouse.distX > 0 && expand) {
        list = prev.querySelectorAll("ul");
        if (list.length === 0) {
          list = document.createElement("ul").appendChild(placeEl);
          prev.appendChild(list);
        } else {
          list = list[list.length - 1];
          list.appendChild(placeEl);
        }
      }
      if (mouse.distX < 0) {
        next = nextNode(placeEl, "li");
        parent = closestNode(placeEl, "li");
        if (!next && parent) {
          parent.parentElement.insertBefore(placeEl, parent.nextSibling);
        }

      }
    },
    moveV: function(e) {
      let placeEl = this.placeElObj, opt = this.treeOptions, pointEl;

      pointEl = document.elementFromPoint(e.pageX - (document.body.scrollLeft || window.pageXOffset), e.pageY - (window.pageYOffset || document.documentElement.scrollTop));
      if (pointEl.tagName.toLowerCase() !== "li") {
        pointEl = parentNode(pointEl, "li", this.root);
      }
      if (!pointEl) return;
      var before = e.offsetY < (pointEl.offsetHeight / 2);

      if (before) {
        pointEl.parentElement.insertBefore(placeEl, pointEl);
      } else {
        pointEl.parentElement.insertBefore(placeEl, pointEl.nextSibling);
      }
    },
    dragMove: function(e) {

      var dragEl = this.dragElObj,
        opt = this.treeOptions,
        mouse = this.mouse,
        left = e.pageX - mouse.offsetX,
        top = e.pageY - mouse.offsetY;
      if (this.dragEl) {
        this.setMouse(e);
        dragEl.style.left = `${left}px`; dragEl.style.top = `${top}px`;

        /*** move horizontal*/
        if (mouse.dirAx && opt.threshold <= mouse.distAxX && mouse.moving) {
          // reset move distance on x-axis for new phase
          this.moveH(e);
        }

        /* move vertical*/
        else if (!mouse.dirAx && mouse.moving && opt.threshold <= mouse.distAxY) {
          this.moveV(e);
        }
      }
    },
    dragStop: function(e) {
      e = e.touches ? e.touches[0] : e;
      let el, opt, target, newParentId, targetId, oldParentId, dragEl, placeEl, children;
      /*if element be dragged */
      if (this.dragEl) {
        opt = this.treeOptions;
        placeEl = this.placeElObj;
        dragEl = this.dragElObj;
        el = dragEl.querySelector("li");

        /*parent element is li*/
        newParentId = parseInt(closestNode(placeEl, "li") ? closestNode(placeEl, "li").dataset.id : 0);
        targetId = parseInt(el.dataset.id);

        target = this.dataMap.get(targetId);
        oldParentId = parseInt(target[opt.parentKey]);

        if (newParentId)
          this.includeInfo[newParentId].nodeCL++;
        if (oldParentId)
          this.includeInfo[oldParentId].nodeCL--;

        el.parentNode.removeChild(el);
        /*there not exist ul in the li element */
        if(placeEl.parentElement.tagName.toLowerCase() === "li"){
          let ul = placeEl.parentNode.querySelector("ul");
           ul = ul ? ul : document.createElement('ul');
           ul.appendChild(el);
           placeEl.parentNode.appendChild(ul);
        }else
          placeEl.parentElement.insertBefore(el, placeEl);

        this.newP = parentNode(el, "ul");
        children = this.oldP.childNodes;

        this.setSort(children, opt);

        children = this.newP.childNodes;

        this.setSort(children, opt);

        target[opt.parentKey] = newParentId;

        this.placeEl = false;
        this.dragEl = false;

      }
    },
    setSort(children, opt) {
      for (var i = 0, j = 0; i < children.length; i++) {
        let tempId, tempObj;
        if (children[i].matches("li")) tempId = children[i].dataset.id;
        else
          continue;
        tempId = parseInt(tempId);
        tempObj = this.dataMap.get(tempId);
        tempObj[opt.sortKey] = j++;
      }
    },
    reset: function() {
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
      this.moving = false;
      this.dragEl = false;
      this.placeEl = false;
    },
  },
  components: {
    TreeNode
  }
}
</script>

<style lang="scss">
  $border-color: #00d1b2;
  .vim-tree {
    text-align: left;
    * {
      list-style: none;
    }
    .collapse-expand {
      position: absolute;
      margin-left: -1rem;
      cursor: pointer;
      border: 5px solid transparent;
      line-height: 1;
      margin-top: -.2rem;
    }
  }
  .placeHolder {
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


  .dragEl {
    position: absolute;
    pointer-events: none;
    z-index: 999;
  }
</style>
