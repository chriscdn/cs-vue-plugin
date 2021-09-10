<template>
    <span v-if="noderec"
        ><img v-if="image" :src="noderec.gif"/>&nbsp;<a :href="noderec.url">{{ noderec.name }}</a
        >&nbsp;<FunctionMenu v-if="clickable" :dataid="noderec.dataid"/> <span v-html="noderec.modifiedImageCallback"></span
    ></span>
</template>

<script>
import FunctionMenu from './FunctionMenu.vue'
export default {
    components: { FunctionMenu },
    props: {
        noderec: {
            type: Object,
            default: null,
        },
        image: {
            type: Boolean,
            default: true,
        },
        clickable: {
            type: Boolean,
            default: true,
        },
    },
}
</script>
