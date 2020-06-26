<template>
	<div>
		<flat-pickr v-model="localValue" :config="localOptions" @on-close="onClose" @on-change="onClose"/>
		<cs-button @click="now" v-if="showNow">{{ 'now' }}</cs-button>
		<cs-button @click="endOfDay" v-if="showEndOfDay">{{ 'end of day' }}</cs-button>

		<cs-button @click="clear">{{ 'clear' }}</cs-button>
	</div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component'
// import 'flatpickr/dist/flatpickr.css'
import 'flatpickr/dist/themes/airbnb.css'
const moment = require('moment')

export default {
	components: { flatPickr },
	props: {
		value: {
			type: [Number, String, Date, null],
			default: null
		},

		enableTime: {
			type: Boolean,
			default: false
		},

		// format changes what v-model emits
		format: {
			type: Function,
			default: value => value
		},
		showNow: {
			type: Boolean,
			default: true
		},
		// https://flatpickr.js.org/options/
		options: {
			type: Object,
			default: () => ({})
		}
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	computed: {
		localValue: {
			set(value) {
				// value is formatted according to the formatDate
				// function.  Silly. We emit in the onClose event.
				// this.$emit('change', value)
			},
			get() {
				return this.value
			}
		},
		localOptions() {
			return {
				formatDate: this.formatDate,
				enableTime: this.enableTime,
				time_24hr: true,
				defaultHour: 0,
				defaultMinute: 0,
				// altInput: true,
				// altFormat: this.$jsLongDateFormat,
				// allowInput: true,
				// dateFormat: 'Z',
				...this.options
			}
		},
		showEndOfDay() {
			return this.enableTime
		}
	},
	methods: {
		formatDate(input) {
			// this is what you see in the user interface
			let d = moment(input)
			return this.enableTime ? d.format(this.$jsLongDateFormat) : d.format(this.$jsShortDateFormat)
		},
		onClose(selectedDates) {
			const d = selectedDates[0]
			this.$emit('change', this.format(d))
		},
		clear() {
			this.$emit('change', null)
		},
		now() {
			this.$emit('change', this.format(Date.now()))
		},
		endOfDay() {
			let d = moment(this.localValue || Date.now())
			d.hours(23)
			d.minutes(59)
			d.seconds(59)
			this.$emit('change', this.format(d))
		}
	}
}
</script>
<style lang="less" scoped>
.flatpickr-input {
	background-color: #FFF;
}
</style>