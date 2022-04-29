<template>
  <span
    ><a href="#" @click.prevent="click"><slot></slot></a>&nbsp;<img
      v-if="arrowImage"
      :src="arrowImage"
  /></span>
</template>

<script>
export default {
  props: ['field', 'localsortkeypath', 'sortbyfield'],
  computed: {
    reverseField() {
      return '-' + this.field
    },
    arrowImage() {
      if (this.field == this.sortbyfield) {
        return this.$img + 'sort-up.gif'
      } else if (this.reverseField == this.sortbyfield) {
        return this.$img + 'sort-down.gif'
      } else {
        return ''
      }
    },
  },
  methods: {
    click() {
      if (this.field == this.sortbyfield) {
        this.$emit('sortclick', {
          field: this.reverseField,
          localsortkeypath: this.localsortkeypath,
          ascending: false,
        })
      } else {
        this.$emit('sortclick', {
          field: this.field,
          localsortkeypath: this.localsortkeypath,
          ascending: true,
        })
      }
    },
  },
}
</script>