<template>
	<span v-if="dataid">
		<a href="#" @click.prevent="onclick"><img :src="image" :id="'x' + dataid + uniqueid " @mouseover="onmouseover" @mouseout="onmouseout" border="0" alt="Functions" title="Functions" /></a>
		<div :id="'z' + dataid + uniqueid" class="functionMenuDiv" ref="functionMenuDiv"></div>
	</span>
</template>
	
<script>
export default {
	props: {
		dataid:{
			type: Number,
			required: true
		}
	},
	data() {
		return {
			image: ''
		}
	},
	computed: {
		uniqueid() {
			return Math.random().toString(36).substring(2, 15)
		}
	},
	methods: {
		onclick(event) {
			// should probably assert these functions are available
			window.setSectionName(this.uniqueid)
			window.showFunctionMenu2('', this.dataid, event)
			window.setSectionName('')
			return false
		},
		onmouseover() {
			this.image = this.$img + 'webdoc/actions_hover.png'
		},
		onmouseout() {
			this.image = this.$img + 'webdoc/actions.png'
		}
	},
	watch: {
		// reset the cached menu
		dataid() {
			var ele = this.$refs.functionMenuDiv
			if (ele) {
				while (ele.firstChild) {
					ele.removeChild(ele.firstChild)
				}
			}
		}
	},
	created() {
		this.onmouseout()
	}
}
</script>