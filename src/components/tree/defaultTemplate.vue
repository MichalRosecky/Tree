<template>
<div class="card">
  <header class="card-header">
    <a class="card-header-icon">
      <span class="icon is-small" :class="opt.handleClass">
        <i class="fa fa-hand-o-down" title="拖拽排序"></i>
      </span>
    </a>
    <p class="card-header-title">
      {{data[opt.searchKey]}}
    </p>
    <a class="card-header-icon" @click="visible= !visible">
      <span class="icon">
        <i class="fa" :class="visible ? 'fa-angle-down' : 'fa-angle-up'"></i>
      </span>
    </a>
  </header>
  <div class="card-content" v-show="visible">
    <div class="content">
      <div class="field is-horizontal">
        <div class="field-body">
          <div class="field is-grouped">
            <p class="control is-expanded has-icons-left">
              <span>content</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// import VbSwitch from 'vue-bulma-switch'
export default {
  components: {
    // VbSwitch
  },
  name: "testItem",
  props: ['data', 'opt'],
  data() {
    return {
      visible: false,
    }
  },
}
</script>

<style scoped>
.card {
    p {
        margin: 0;
    }
}
</style>
