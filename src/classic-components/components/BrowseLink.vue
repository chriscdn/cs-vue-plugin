<template>
	<span v-if="noderec"><img :src="noderec.gif" v-if="image" />&nbsp;<a :href="noderec.url">{{ noderec.name }}</a>&nbsp;<FunctionMenu v-if="clickable" :dataid="noderec.dataid" /> <span v-html="noderec.modifiedImageCallback"></span></span>
</template>

<script>
import FunctionMenu from './FunctionMenu.vue'
export default {
	components: {FunctionMenu},
	props: {
		noderec: {
			type: Object
		},
		image: {
			type: Boolean,
			default: true
		},
		clickable: {
			type: Boolean,
			default: true
		}
	}
}
</script>