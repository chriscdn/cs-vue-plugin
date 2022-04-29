<template>
  <FunctionMenu :dataid="versionid" :func="func" />
  <!-- <span> {{ func }}</span> -->
</template>

<script>
import FunctionMenu from './FunctionMenu.vue'

const buildUrl = require('build-url')

export default {
  props: {
    dataid: {
      type: Number,
      required: true,
    },
    versionid: {
      type: Number,
      require: true,
    },
    vernum: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    func() {
      return buildUrl('', {
        queryParams: {
          func: 'll',
          objAction: 'VersionFunctionsMenu',
          objId: this.dataid,
          vernum: this.vernum,
        },
      })

      // ?func=ll&objAction=VersionFunctionsMenu&objId=893145&vernum=4&nexturl=%2FOTCSSkyguide16_2%2Fcs%2Eexe%3Ffunc%3Dll%26objId%3D893145%26objAction%3Dversions%26nexturl%3D%252FOTCSSkyguide16_2%252Fcs%252Eexe%253Ffunc%253Dll%2526objaction%253Doverview%2526objid%253D893145
    },
  },
}
</script>

<style lang="less" scoped>
</style>