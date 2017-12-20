<template>
  <span>{{item.id}}</span>
</template>

<script>
  export default {
    props: {
      d: [Object]
    },
    data() {
      return {
        item: {}
      }
    },
    mounted(){
      this.item = this.d;
    }
  }
</script>
