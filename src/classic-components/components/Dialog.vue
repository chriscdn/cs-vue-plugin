<template>
	<transition name="fade" >
		<div v-if="dialog" class="modal">
			<div ref="content" class="modal-content" :style="[innerStyle]" v-click-outside="closeDialog">
				<slot></slot>
			</div>
		</div>
	</transition>
</template>

<script>
import ClickOutside from 'vue-click-outside'
// import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

export default {
	props: {
		value: {
			type: Boolean,
			required: false
		},
		width: {
			type: String,
			default: '600px'
		}
	},
	model: {
		prop: 'value',
		event: 'change'
	},	
	directives: {
		ClickOutside
	},
	data() {
		return {
			dialog: false
		}
	},
	methods: {
		closeDialog() {
			if (this.dialog) {
				this.dialog = false
			}	
		}
	},
	computed: {
		innerStyle() {
			return {
				width: this.width
			}
		}
	},
	
	watch: {
		value: {
			handler(value) {
				this.dialog = value
			},
			immediate: true
		},
		async dialog(value) {
			this.$emit('change', value)

			/*if (value) {
				await this.$nextTick()
				disableBodyScroll(this.$refs.content)
			} else {
				enableBodyScroll(this.$refs.content)
			}*/
		}
	}
}
</script>

<style lang="less" scoped>
.modal {
	position: fixed;
	z-index: 1;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.4);
	
	.modal-content {
		background-color: #fff;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 10px;
		max-height: 80vh;
		overflow: auto;
		border-radius: 8px;
	}
}

.fade-enter-active, .fade-leave-active {
	transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
}
</style>