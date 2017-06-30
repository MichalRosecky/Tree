const pinyin = require('chinese-to-pinyin')
export default class TreeStore {
  constructor (data) {

    this.data=data.data;
    this.options = {
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
      parentKey: 'parent_id',
      searchKey: 'name',
      searchCls: '',
      searchShow: true,
      injectComponent: "",
      group: 0,
      maxDepth: 5,
      threshold: 20
    };
    this.reset();
    this.$ = window.jQuery;

    this.hasPointerEvents = (function() {
      var el = document.createElement('div'),
      docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
          return false;
        }
      el.style.pointerEvents = 'auto';
      el.style.pointerEvents = 'x';
      docEl.appendChild(el);
      var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
      docEl.removeChild(el);
      return !!supports;
    })();

    this.dataMap = new Map();
    this.dataExclude = [];


    for (let option in data.options) {
      if(data.options.hasOwnProperty(option))
        this.options[option] = data.options[option];
    }


    const _traverseNodes = (root) => {
      let i = 0;
      for (let node of root) {
        this.dataMap.set(node.id, node);
        this.dataExclude[node.id] = {visible: true, expand: true};
        node[this.options.sortKey] = i++;
        if (node.children && node.children.length > 0) _traverseNodes(node.children)
      }
    }
    _traverseNodes(this.data)
  }

  // changeCheckStatus (node) {
  //   const _traverseUp = (node) => {
  //     if (node.checked && node.parentId) {
  //       let parent = this.getNode(node.parentId)
  //       parent.checked = this.sameSilibingChecked(node.parentId, node.id)
  //       _traverseUp(parent)
  //     } else {
  //       if (!node.checked && node.parentId) {
  //         let upparent = this.getNode(node.parentId)
  //         upparent.checked = false
  //         if (upparent.parentId) {
  //           _traverseUp(upparent)
  //         }
  //       }
  //     }
  //   }
  //
  //   const _traverseDown = (node) => {
  //     if (node.children && node.children.length > 0) {
  //       for (let child of node.children) {
  //         child.checked = node.checked
  //         _traverseDown(child)
  //       }
  //     }
  //   }
  //   _traverseUp(node)
  //   _traverseDown(node)
  // }
  reset() {
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
    this.dragEl = null;
    this.dragRootEl = null;
    this.dragDepth = 0;
    this.hasNewRoot = false;
    this.pointEl = null;
  }
  loadDragComponent(){
    if(this.$){
      this.isSupportJqueryDragElement();
    }
  }

  isSupportJqueryStartEvent(e){
    var list = this;
    var handle = $(e.target), mouse = list.mouse, target, dragItem;


    if (!handle.hasClass(list.options.handleClass)) {
      if (handle.closest('.' + list.options.noDragClass).length) {
        return;
      }
      handle = handle.closest('.' + list.options.handleClass);
    }
    if (!handle.length || list.dragEl) {
      return;
    }

    list.isTouch = /^touch/.test(e.type);
    if (list.isTouch && e.touches.length !== 1) {
      return;
    }

    e.preventDefault();

    e =  e.touches ? e.touches[0] : e;
    target = $(e.target);
    dragItem = target.closest(list.options.itemNodeName);

    list.placeEl.css('height', dragItem.height());

    mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
    mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
    mouse.startX = mouse.lastX = e.pageX;
    mouse.startY = mouse.lastY = e.pageY;

    list.dragRootEl = list.el;

    list.dragEl = list.$(document.createElement(list.options.listNodeName)).addClass(list.options.listClass + ' ' + list.options.dragClass);
    list.dragEl.css('width', dragItem.width());

    dragItem.after(list.placeEl);
    dragItem[0].parentNode.removeChild(dragItem[0]);
    dragItem.appendTo(list.dragEl);

    $(document.body).append(list.dragEl);
    list.dragEl.css({
      'left': e.pageX - mouse.offsetX,
      'top': e.pageY - mouse.offsetY
    });

  }

  isSupportJqueryMoveEvent(e){
    var list = this;
          if (list && list.dragEl) {
            e.preventDefault();
            e =  e.touches ? e.touches[0] : e;
            var list, parent, prev, next, depth, opt = list.options, mouse = list.mouse;
    debugger;
            list.dragEl.css({
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

          }

  }

  isSupportJqueryDragElement(){
    var list = this;
    var hasTouch = 'ontouchstart' in document;

    list.w = list.$(document);
    list.el = list.$('#'+list.options.treeId);

    debugger;
    list.placeEl = $('<div class="' + list.options.placeClass + '"/>');


    var onStartEvent = function(e) {
        //debugger;
        list.isSupportJqueryStartEvent(e);
    };

    var onMoveEvent = function(e) {
      list.isSupportJqueryMoveEvent(e);
    };

    if (hasTouch) {
      list.el[0].addEventListener('touchstart', onStartEvent, false);
      window.addEventListener('touchmove', onMoveEvent, false);
      // window.addEventListener('touchend', onEndEvent, false);
      // window.addEventListener('touchcancel', onEndEvent, false);
    }

    list.el.on('mousedown', onStartEvent);
    list.w.on('mousemove', onMoveEvent);
    // list.w.on('mouseup', onEndEvent);

  }
  isNullOrEmpty (world) {
    if (world) {
      return world.trim().length === 0
    }
    return true
  }
  filterNodes (keyworld, searchOptions) {
    const _filterNode = (val, node) => {
      if (!val) return true
      if (searchOptions.useEnglish) {
        return node.label.indexOf(val) !== -1
      } else {
        return this.toPinYin(node.label, searchOptions.useInitial).indexOf(this.toPinYin(keyworld.toLowerCase(), searchOptions.useInitial, true)) !== -1
      }
    }

    const _syncNodeStatus = (node) => {
      if (node.parentId) {
        let parentNode = this.getNode(node.parentId)
        if (node.visible) {
          parentNode.visible = node.visible
          _syncNodeStatus(parentNode)
        }
      }
    }

    let filterFunc = (searchOptions.customFilter && typeof (searchOptions.customFilter) === 'function') ? searchOptions.customFilter : _filterNode
    this.datas.forEach(node => {
      debugger;
      node.visible = filterFunc(keyworld, node)
      node.searched = false
      if (node.visible) {
        if (!this.isNullOrEmpty(keyworld)) {
          node.searched = true
        }
        _syncNodeStatus(node)
      }
    })
  }

  getNode (key) {
    return this.datas.get(key)
  }
  sameSilibingChecked (parentId, currentId) {
    let parent = this.datas.get(parentId)
    let sbIds = []
    parent.children.forEach(x => {
      if (x.id !== currentId) sbIds.push(x.id)
    })
    for (let id of sbIds) {
      let node = this.getNode(id)
      if (!node.checked) return false
    }
    return true
  }
  toPinYin (keyworld, useInitial) {
    if (/^[a-zA-Z]/.test(keyworld)) {
      return keyworld
    }
    let fullpinyin = pinyin(keyworld, {
      filterChinese: true,
      noTone: true
    })
    if (useInitial) {
      let res = ''
      fullpinyin.split(' ').forEach(w => {
        if (!(/[a-zA-Z]/.test(w))) {
          res += w
        } else {
          res += w.slice(0, 1)
        }
      })
      return res
    } return fullpinyin
  }
}
