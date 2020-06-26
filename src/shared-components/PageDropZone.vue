<template>
	<div>
		<slot v-bind:active="active"></slot>
	</div>
</template>
<script>
export default {
	props: {
		mimetypes: {
			type: Array,
			default: () => null
		}
	},
	data() {
		return {
			active: false,
			lastTarget: null
		}
	},
	// lastTarget: null,
	methods: {
		isFile(event) {
			return event.dataTransfer.types.some(item => item === "Files")
		},
		dragenter(event) {
			if (this.isFile(event)) {
				this.lastTarget = event.target
				// console.log('dragenter')
				this.active = true
			}
		},
		dragleave(event) {
			event.preventDefault()
			// e.preventDefault();
			if (event.target === this.lastTarget || event.target === window.document) {

				// this.$emit('active', true)
				this.active = false


			}
			// event.stopPropagation()
			// console.log('dragleave called')
		},
		dragover(event) {
			event.preventDefault()
			// event.stopPropagation()
			// console.log('dragover called')
		},
		drop(event) {
			event.preventDefault()

			this.$emit('predrop')

			if (event.dataTransfer && event.dataTransfer.files.length) {
				let files = Array.from(event.dataTransfer.files)

				if (this.mimetypes) {
					files = files.filter(file => this.mimetypes.includes(file.type))
				}
				// console.log(files)

				this.$emit('drop', files)
				// this.$emit('active', false)
			}

			this.active = false
		}
	},
	mounted() {
		window.addEventListener('dragenter', this.dragenter)
		window.addEventListener('dragleave', this.dragleave)
		window.addEventListener('dragover', this.dragover)
		window.addEventListener('drop', this.drop)
	},
	beforeDestroy() {
		window.removeEventListener('dragenter', this.dragenter)
		window.removeEventListener('dragleave', this.dragleave)
		window.removeEventListener('dragover', this.dragover)
		window.removeEventListener('drop', this.drop)
	}
}
</script>
<style lang="less" scoped>
</style>