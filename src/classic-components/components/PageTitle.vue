<template>
  <h1>
    {{ title
    }}<span v-if="subtitle"
      >: <span class="rhmuted">{{ subtitle }}</span></span
    >
  </h1>
</template>

<script>
export default {
  props: ['title', 'subtitle'],
}
</script>

<style scoped lang="less">
.rhmuted {
  color: #999;
}
</style>