<template>
	<span v-if="dataid">
		<a href="#" class="functionMenuHotspot" @click.prevent="onclick" :id="aid">
			<img v-if="isModernFunctionMenu" :src="`${$img}spacer.gif`" alt="Functions">
			<img v-else :src="image" :id="xid" @mouseover="onmouseover" @mouseout="onmouseout" border="0" alt="Functions" title="Functions" />
		</a>
		<div v-once :id="zid" class="functionMenuDiv" ref="functionMenuDiv"></div>
	</span>
</template>
<script>
export default {
	props: {
		dataid: {
			type: Number,
			required: true
		},
		func: {
			type: String,
			default: ''
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
		},
		isModernFunctionMenu() {
			return !!window.functionMenuExpansionStatus
		},
		aid() {
			return this.isModernFunctionMenu ? this.xid : null
		},
		xid() {
			return `x${this.dataid}${this.uniqueid}`
		},
		zid() {
			return `z${this.dataid}${this.uniqueid}` 
		}
	},
	methods: {
		onclick(event) {
			// should probably assert these functions are available
			window.setSectionName(this.uniqueid)
			window.showFunctionMenu2('', this.dataid, event, '', this.func)
			window.setSectionName('')
			return false
		},
		onmouseover() {
			this.image = `${this.$img}webdoc/actions_hover.png`
		},
		onmouseout() {
			this.image = `${this.$img}webdoc/actions.png`
		}
	},
	watch: {
		// reset the cached menu
		dataid() {
			let ele = this.$refs.functionMenuDiv
			if (ele) {
				while (ele.firstChild) {
					ele.removeChild(ele.firstChild)
				}
			}
		}
	},
	mounted() {
		if (!this.isModernFunctionMenu) {
			this.onmouseout()
		}
	}
}
</script>