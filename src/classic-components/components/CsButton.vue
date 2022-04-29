<template>
  <input type="button" v-bind="localProps" v-on="$listeners" />
</template>
<script>
export default {
  props: {},
  data() {
    return {}
  },
  computed: {
    localProps() {
      return {
        value: this.$slots.default[0].text,
        ...this.$props,
      }
    },
  },
}
</script>
<style lang="less" scoped>
@active-color: #232e72;
@disabled-color: #ddd;
input {
  color: @active-color;
  padding: 2px 15px;
  background: #ffffff;
  border: 1px solid @active-color;
  cursor: pointer;
  border-radius: 12px;
  margin: 2px 6px;

  &:hover {
    border: 1px solid black;
  }
  &[disabled],
  :disabled {
    border: 1px solid @disabled-color;
    color: @disabled-color;
  }
}
</style>