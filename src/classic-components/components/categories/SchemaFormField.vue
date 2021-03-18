<template>
	<div :class="{'has-errors':hasErrors}">
		<select v-if="lwidget == 'select'" v-model="valueLocal" :disabled="isReadOnly">
			<option v-for="choice in choices" :key="choice.value" :value="choice.value">{{ choice.text }}</option>
		</select>
		<UserPicker v-else-if="lwidget == 'user'" v-model="valueLocal" :groups="false" :editable="editable" />
		<UserPicker v-else-if="lwidget == 'usergroup'" v-model="valueLocal" :groups="true" :editable="editable" />
		<DatePicker v-else-if="lwidget == 'date'" v-model="valueLocal" :enableTime="false" :format="formatDateString" :editable="editable" />
		<DatePicker v-else-if="lwidget == 'datetime'" v-model="valueLocal" :enableTime="true" :format="formatDateTimeString" :editable="editable" />
		<input v-else type="search" v-model="valueLocal" :maxlength="maxLength" :readonly="isReadOnly" />
		<!-- </slot> -->
		<SchemaErrorMessages :error-path="errorPath" />
	</div>
</template>
<script>
import SchemaErrorMessages from './SchemaErrorMessages.vue'
const get = require('lodash.get')
const moment = require('moment')
const arrify = require('arrify')
export default {
	components: { SchemaErrorMessages },
	props: {
		schema: {
			type: Object,
			required: true
		},
		value: {
			type: null,
			default: null
		},
		errorPath: {
			type: String,
			default: ''
		},
		widget: {
			type: String,
			default: null
		},
		editable: {
			type: Boolean,
			default: true
		},
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	// data() {
	// 	return {}
	// },
	computed: {
		valueLocal: {
			set(value) {
				this.$emit('change', this.nullify(value))
			},
			get() {
				return this.nullify(this.value)
			}
		},
		choices() {
			const enumz = get(this.schema, 'items[0].enum')

			if (enumz) {
				const items = enumz.map(item => {
					if (item) {
						return { text: item, value: item }
					} else {
						return { text: '<None>', value: null }
					}
				})

				return items
				// return [...items, {text:'fake', value:'zzzzz'}]
			} else {
				return null
			}
		},
		minItems() {
			return get(this.schema, 'maxItems')
		},
		maxItems() {
			return get(this.schema, 'maxItems')
		},
		maxLength() {
			return get(this.schema, 'items[0].maxLength')
		},
		fieldType() {
			return get(this.schema, 'items[0].type')
		},
		format() {
			return get(this.schema, 'items[0].format')
		},
		fieldTypeArray() {
			return arrify(this.fieldType)
		},
		lwidget() {
			if (this.widget) {
				return this.widget
			} else if (this.isSelect) {
				return 'select'
			} else if (this.isUserPicker) {
				return 'user'
			} else if (this.isUserGroupPicker) {
				return 'usergroup'
			} else if (this.isDatePicker) {
				return 'date'
			} else if (this.isDateTimePicker) {
				return 'datetime'
			} else {
				return 'input'
			}
		},
		isSelect() {
			return !!this.choices
		},
		isStringInput() {
			return this.fieldTypeArray.includes('string')
		},
		isUserPicker() {
			return this.fieldTypeArray.includes('integer') && this.format == 'user'
		},
		isUserGroupPicker() {
			return this.fieldTypeArray.includes('integer') && this.format == 'usergroup'
		},
		isDatePicker() {
			return this.fieldTypeArray.includes('string') && (this.format == 'date')
		},
		isDateTimePicker() {
			return this.fieldTypeArray.includes('string') && (this.format == 'date-time')
		},
		errors() {
			return get(this.payload, 'errors', {})
		},
		errorMessages() {
			return this.errors[this.errorPath]
		},
		hasErrors() {
			return this.errorMessages && !!this.errorMessages.length
		},
		isReadOnly() {
			return !this.editable
		}
	},
	methods: {
		formatDateString(value) {
			const d = moment(value)
			return d.isValid() && value ? d.format('YYYY-MM-DD') : null
		},
		formatDateTimeString(value) {
			const d = moment(value)
			return d.isValid() && value ? d.format('YYYY-MM-DDTHH:mm:ss') : null
		},
		nullify(value) {
			return value
			// value = (typeof value === 'string') ? value.trim() : value
			// return [null, undefined, ""].includes(value) ? null : value
		}
	},
	inject: ['payload'],
	mounted() {
		// this forces a nullify call on the values
		this.valueLocal = this.value
	}
}
</script>
<style lang="less" scoped>
select,
input {
	padding: 0.2em;
	width: 100%;
	border: 1px #CCC solid;
}

.has-errors {
	background-color: orange;
}
</style>