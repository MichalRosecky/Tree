<template>
  <div>
    hello world
    <tx>
        <template scope="scope">
          <button>Detail</button>
          <button>Edit</button>
        </template>
    </tx>
  </div>
</template>

<script>
import tx from "./tx.vue"
console.log(tx.components);
  export default {
    components: {
      tx
    },
    methods: {

    }
  }
</script>

