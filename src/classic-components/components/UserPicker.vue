<template>
  <Autocomplete
    :placeholder="placeholder"
    v-model="localValue"
    :width="width"
    :loading="loading"
    :search-input.sync="searchText"
    :items="items"
    :returnObject="returnObject"
    :combobox="combobox"
    :editable="editable"
  >
    <template v-slot:item="data">
      <img v-if="data.item.type == USER" :src="`${$img}guy.gif`" />
      <img v-else-if="data.item.type == GROUP" :src="`${$img}2-guys.gif`" />
      <span v-html="formatChoice(data)"></span>
    </template>
  </Autocomplete>
</template>
<script>
import Autocomplete from './Autocomplete.vue'
const get = require('lodash.get')
const debounce = require('lodash.debounce')

export default {
  components: { Autocomplete },

  props: {
    value: {
      type: [String, Number],
      required: false,
    },
    users: {
      type: Boolean,
      default: true,
    },
    groups: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [String, Number],
      default: '100%',
    },
    returnObject: {
      type: Boolean,
      default: false,
    },
    combobox: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  data() {
    return {
      loading: false,
      searchText: null,
      readonly: false,
      pleaseWait: false,
      items: [],
    }
  },

  computed: {
    localValue: {
      set(value) {
        this.$emit('change', value)
      },
      get() {
        return this.value
      },
    },
    options() {
      let where_type = null

      if (this.users && this.groups) {
        where_type = null // defaults to both
      } else if (this.users) {
        where_type = this.USER
      } else if (this.groups) {
        where_type = this.GROUP
      }

      return {
        where_type,
      }
    },
    placeholder() {
      if (this.pleaseWait) {
        return 'Loading...'
      } else if (this.users && this.groups) {
        return 'Search for user or group...'
      } else if (this.users) {
        return 'Search for user...'
      } else if (this.groups) {
        return 'Search for group...'
      } else {
        return ''
      }
    },
    USER() {
      return this.$session.members.USER
    },
    GROUP() {
      return this.$session.members.GROUP
    },
  },

  methods: {
    querySelections: debounce(function (v) {
      this.loading = true

      this.$session.members
        .userQuery(v, this.options, 'v2')
        .then((response) => {
          // v1
          // this.items = response.data.data.map(item => ({
          // 	text: get(item, 'name_formatted'),
          // 	value: get(item, 'id'),
          // 	type: get(item, 'type')
          // }))
          //

          // v2
          this.items = response.data.results.map((item) => ({
            id: item.data.properties.id,
            first_name: item.data.properties.first_name,
            last_name: item.data.properties.last_name,
            name: item.data.properties.name,
            name_formatted: item.data.properties.name_formatted,
            group_id: item.data.properties.group_id,
            text: item.data.properties.name_formatted,
            value: item.data.properties.id,
            type: item.data.properties.type,
            title: item.data.properties.title,
          }))
        })
        .finally(() => (this.loading = false))
    }, 500),

    formatChoice(slotProps) {
      return get(slotProps, 'item.text', '')
    },

    loadInitialValue() {
      let initialValue = this.value

      if (initialValue && !this.combobox) {
        this.pleaseWait = true
        this.readonly = true
        this.loading = true

        this.$session.members
          .member(initialValue, 'v1')
          .then((response) => {
            let value = get(response, 'data.data.id')
            let type = get(response, 'data.data.type')
            let text = get(response, 'data.data.name')

            if (value) {
              this.items = [{ type, text, value }]
              this.select = value
            }
          })
          .finally(() => {
            this.pleaseWait = false
            this.readonly = false
            this.loading = false
          })
      }
    },
  },
  watch: {
    searchText(val) {
      val && val !== this.select && this.querySelections(val)
    },
    value: {
      handler() {
        // TODO: this catches ALL changes, including edits using the widget.
        // this might not be so bad... but it does create extra network requests
        // to think about ....
        this.loadInitialValue()
      },
      immediate: true,
    },
  },
  mounted() {
    // this.loadInitialValue()
  },
}
</script>
<style lang="less" scoped>
// spacing between user/group icon and label
img {
  margin-right: 0.5em;
}
</style>