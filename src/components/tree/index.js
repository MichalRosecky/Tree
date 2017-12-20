import VueDragSortTree from './tree.vue';

function tree(component) {
  if(component != null && component instanceof Object){
    VueDragSortTree.components.TreeNode.components.cell=component;
  }
  return VueDragSortTree;
}

export default tree;
