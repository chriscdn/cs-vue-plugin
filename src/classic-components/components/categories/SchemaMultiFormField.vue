<template>
	<div>
		<!-- <transition-group name="item"> -->
		<!-- Using key="i" is not idea.  Perhaps we have to generate keys? This would allow it to work nicely with the transitions -->
		<div v-for="(v,i) in valueLocal" :key="i" class="d-flex my-1">
			<!-- <slot v-bind:index="i" v-bind:schema="schema"></slot> -->
			<SchemaFormField v-model="valueLocal[i]" :schema="schema" :error-path="`${errorPath}[${i}]`" class="flex-grow-1" :editable="isEditable" />
			<div class="d-flex flex-shrink-0" v-if="isEditable">
				<input v-if="canAdd" type="image" :src="`${$img}add-row.gif`" @click="add(i)" class="ml-1" width="16px" height="16px" />
				<input v-if="canRemove" type="image" :src="`${$img}delete-row.gif`" @click="remove(i)" class="ml-1" width="16px" height="16px" />
			</div>
		</div>
		<!-- </transition-group> -->
		<SchemaErrorMessages :error-path="errorPath" />
	</div>
</template>
<script>
const get = require('lodash.get')
import SchemaFormField from './SchemaFormField.vue'
import SchemaErrorMessages from './SchemaErrorMessages.vue'
export default {
	components: { SchemaFormField, SchemaErrorMessages },
	props: {
		value: {
			type: Array,
			required: true
		},
		schema: {
			type: Object,
			required: true
		},
		editable: {
			type: Boolean,
			default: true
		},
		errorPath: {
			type: String,
			default: ''
		}
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	data() {
		return {
			valueLocal: []
		}
	},
	computed: {
		// getErrors() {
		// 	return function(keypath) {
		// 		// return get(this.errors, keypath)
		// 		return this.errors[keypath] || []

		// 		// return this.errors.filter(item => item.startsWith(keypath))
		// 	}
		// },
		// valueLocal: {
		// 	get() {
		// 		return this.valueLocal
		// 	},
		// 	set(value) {
		// 		console.log('Multi valueLocal set called')
		// 		this.$emit('change', value)
		// 	}
		// },
		isEditable() {
			return this.editable
		},
		isReadOnly() {
			return !this.isEditable
		},
		canAdd() {
			// return true
			return this.count < this.maxItems
		},
		canRemove() {
			// return true
			return this.minItems < this.count
		},
		count() {
			return this.valueLocal.length
		},
		minItems() {
			return get(this.schema, 'minItems')
		},
		maxItems() {
			return get(this.schema, 'maxItems')
		}

	},
	methods: {
		add(_index) {
			this.valueLocal = [...this.valueLocal, null]
		},
		remove(index) {

			// this.valueLocal.splice(index,1)

			let myArray = [...this.valueLocal]
			myArray.splice(index, 1)
			this.valueLocal = myArray
		}
	},
	watch: {
		value: {
			handler(v) {
				this.valueLocal = v
			},
			immediate: true
		},
		valueLocal(v) {
			this.$emit('change', v)
			// console.log(`valueLocal: ${v}`)
		}
	}
}
</script>
<style lang="less" scoped>
.item-enter-active,
.item-leave-active {
	transition: all 0.3s;
}

.item-enter,
.item-leave-to {
	opacity: 0;
	transform: translateY(-1em);
}
</style>