<template>
	<div>
		<!-- <slot v-bind:schema="schema"> -->
		<select v-if="lwidget == 'select'" v-model="valueLocal">
			<option v-for="choice in choices" :key="choice.value" :value="choice.value">{{ choice.text }}</option>
		</select>
		<UserPicker v-else-if="lwidget == 'user'" v-model="valueLocal" :groups="false" />
		<UserPicker v-else-if="lwidget == 'usergroup'" v-model="valueLocal" :groups="true" />
		<DatePicker v-else-if="lwidget == 'date'" v-model="valueLocal" :enableTime="false" :format="formatDateString" />
		<DatePicker v-else-if="lwidget == 'datetime'" v-model="valueLocal" :enableTime="true" :format="formatDateTimeString" />
		<input v-else type="search" v-model="valueLocal" :maxlength="maxLength" />
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
		}
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	data() {
		return {}
	},
	computed: {
		valueLocal: {
			set(value) {
				// const setValue = this.isDefinedAndNotBlankString(value) ? value : null
				this.$emit('change', value)
			},
			get() {
				return this.value
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
		hasErrors() {
			return !!this.errors.length
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
		}
		
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
</style>