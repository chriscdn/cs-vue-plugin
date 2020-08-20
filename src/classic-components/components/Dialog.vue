<template>
	<transition name="fade" >
		<div v-if="localValue" class="modal" @scroll="handleScroll">
			<div class="modal-content" :style="[innerStyle]" v-click-outside="closeDialog">
				<slot></slot>
			</div>
		</div>
	</transition>
</template>

<script>
import ClickOutside from 'vue-click-outside'
// consider https://github.com/willmcpo/body-scroll-lock
export default {
	props: {
		value: {
			type: Boolean,
			required: true
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
			dialog500: false
		}
	},
	methods: {
		closeDialog() {
			if (this.dialog500) {
				this.localValue = false
			}
		},
		handleScroll(event) {
			console.log(event)
			event.preventDefault()
			event.stopPropagation()
		}
	},
	computed: {
		localValue: {
			set(value) {
				this.$emit('change', value)
			},
			get() {
				return this.value
			}
		},
		innerStyle() {
			return {
				width: this.width
			}
		}
	},
	
	watch: {
		localValue(value) {
			setTimeout(() => this.dialog500 = value, 500)
		}
	},
	mounted() {
		// window.addEventListener('scroll', this.handleScroll)
		// document.body.appendChild(this.$el)
	},
	beforeDestroy() {
		// window.removeEventListener('scroll', this.handleScroll)
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