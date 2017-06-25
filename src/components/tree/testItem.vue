<template>
<div class="card">
  <header class="card-header">
    <a class="card-header-icon">
      <span class="icon vim-handle-default is-small">
        <i class="fa fa-hand-o-down" title="拖拽排序"></i>
      </span>
    </a>
    <p class="card-header-title">
      {{data.label}}
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
        <div class="field-label is-normal">
          <label class="label">title</label>
        </div>
        <div class="field-body">
          <div class="field is-grouped">
            <p class="control is-expanded has-icons-left">
              <input class="input" type="text" placeholder="title" v-model="data.label">
            </p>
          </div>
        </div>
      </div>
      <!-- <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">content</label>
        </div>
        <div class="field-body">
          <div class="field is-grouped">
            <p class="control is-expanded has-icons-left">
              <input class="input" type="text" placeholder="url" v-model="data.content.url">
            </p>
          </div>
          <div class="field">
            <p class="control is-expanded has-icons-left has-icons-right">
              <input class="input" placeholder="target" v-model="data.content.target">
            </p>
          </div>
        </div>
      </div>
      <div class="field is-horizontal flex-baseline"> -->
        <!-- <div class="field-label is-normal">
          <label class="label">status</label>
        </div>
        <div class="field-body">
          <div class="field is-grouped">
            <p class="control is-expanded has-icons-left">
              <vb-switch :checked="status" v-model="status" type="success"></vb-switch>

            </p>
          </div>

        </div>
      </div> -->

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
  props: ['data'],
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    status: {
      set() {
        this.data.status = this.data.status ? 0 : 1;
        //  console.log(this.data.status);
      },
      get() {
        if (parseInt(this.data.status)) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.card {
    p {
        margin: 0;
    }
}
</style>
