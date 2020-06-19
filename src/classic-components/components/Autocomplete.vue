<template>
	<div class='autocomplete' :style="[style]" v-click-outside="fakeBlur">
		<div class="d-flex">
			<slot name="prepend" v-bind:item="localValue"></slot>
			<input ref="input" type="search" v-model="inputText" autocomplete="off" :class="{invalidSelection: !this.isValidSelection}" :placeholder="placeholder" :readonly="readonly" @keydown="keydown" @search="clearInput" @keydown.38.prevent="currentFocus = Math.max(-1, currentFocus - 1)" @keydown.40.prevent="currentFocus = Math.min(items.length-1, currentFocus + 1)" @keydown.enter.prevent="select(currentFocus)" @focus="setFocus" @keydown.tab="fakeBlur" />
		</div>
		<!-- <transition name="custom"> -->
		<div class="autocomplete-items" v-if="focus && items.length && inputText.length">
			<div v-for="(item, index) in items" :key="index" class="autocomplete-item" :class="{'autocomplete-active': currentFocus==index}" @click="select(index)">
				<slot name="item" v-bind:item="item">{{ item }}</slot>
			</div>
		</div>
		<!-- </transition> -->
	</div>
</template>
<script>
import ClickOutside from 'vue-click-outside'
const get = require('lodash.get')

export default {
	props: {

		value: {
			type: [String, Object, Number],
			required: false
		},
		itemValue: {
			type: String,
			default: 'value'
		},
		itemText: {
			type: String,
			default: 'text'
		},
		returnObject: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: 'Start typing...'
		},
		readonly: {
			type: Boolean,
			default: false
		},
		width: {
			type: [String, Number],
			default: '100%'
		},
		items: {
			type: Array,
			default: () => []
		},
		loading: {
			// not implemented yet
			type: Boolean,
			default: false
		}
	},
	directives: {
		ClickOutside
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	data() {
		return {
			inputText: '', // this.displayValueFormatter(this.value),
			currentFocus: -1,
			focus: false
		}
	},
	computed: {
		style() {
			return {
				width: isNaN(this.width) ? this.width : `${this.width}px`
			}
		},
		localValue: {
			set(value) {
				if (!value) {
					this.$emit('change', null)
				} else if (this.returnObject) {
					this.$emit('change', value)
				} else {
					this.$emit('change', get(value, this.itemValue))
				}
			},
			get() {
				return this.isObject(this.value) ? this.value : this.items.find(item => get(item, this.itemValue) == this.value)
			}
		},
		isValidSelection() {
			// return (this.inputText.length == 0 && this.localValue == null) || (this.localValue !== null)
			return !!this.localValue
		},
	},
	methods: {
		select(index) {
			let selectedItem = this.items[index]

			// on selection we force an immediate blur
			// this order matters...
			this.$refs.input.blur()

			this.fakeBlur()

			this.localValue = selectedItem
			this.destroyWatcher()
			this.inputText = selectedItem[this.itemText]
		},

		setFocus() {
			this.focus = true
		},
		// we fake blur due to an IE11 bug, which fires blur() when 
		// using the scrollbar
		fakeBlur() {
			this.focus = false
		},
		isObject(obj) {
			typeof obj == 'object' && obj instanceof Object && !(obj instanceof Array)
		},
		clearInput(event) {
			this.createWatcher()
			this.localValue = null
		},
		keydown(event) {
			this.createWatcher()
			// doesn't handle backspaces
			// if (String.fromCharCode(event.keyCode).match(/(\w|\s)/g)) {
			// 	this.localValue = null
			// }
		},
		createWatcher() {
			if (!this.$watcher) {
				this.$watcher = this.$watch('inputText', value => {
					this.localValue = null
				})
			}
		},
		destroyWatcher() {
			if (this.$watcher) {
				this.$watcher()
				this.$watcher = null
			}
		}
	},
	watch: {
		inputText(value) {
			this.$emit('update:search-input', value)
		},

		items() {
			this.currentFocus = -1

			if (this.localValue) {
				this.destroyWatcher()
				this.inputText = get(this.localValue, this.itemText, '')
			}
		},

		localValue(value) {
			if (value) {
				// conso
				// this.inputText = get(value, this.itemText, '')
			}
		},

		focus(value) {
			if (value) {
				// focus
			} else {
				// blur
				if (this.localValue) {
					// all good, keep it
				} else {
					// otherwise, clear the text field
					this.createWatcher()
					this.inputText = null
				}
			}
		}
		// value(v) {
		// 	console.log(`value: ${v}`)
		// }
	},
	mounted() {
		// console.log(`mounted: ${this.value}`)
		this.createWatcher()
	}
}
</script>
<style lang="less" scoped>
.autocomplete {
	width: 100%;
	display: inline-block;
	position: relative;

	input {
		width: 100%;
		padding: 0.5em;
		border: 1px #CCC solid;
	}

	.autocomplete-items {
		position: absolute;
		border: 1px solid #d4d4d4;
		border-bottom: none;
		border-top: none;
		z-index: 99;
		/*position the autocomplete items to be the same width as the container:*/
		top: 100%;
		left: 0;
		right: 0;
		max-height: 50em;
		overflow-y: scroll;

		.autocomplete-item {
			padding: 10px;
			cursor: pointer;
			background-color: #fff;
			border-bottom: 1px solid #d4d4d4;
			display: flex;
			align-items: center;
			font-size: 1.2em;

			&:hover {
				/*when hovering an item:*/
				background-color: #e9e9e9;
			}
		}
	}

	.autocomplete-active {
		/*when navigating through the items using the arrow keys:*/
		background-color: DodgerBlue !important;
		color: #ffffff;
	}
}
</style>