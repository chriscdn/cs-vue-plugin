<template>
	<!--  -->
	<v-dialog ref="dialog" v-model="dialog" :return-value.sync="localDate" persistent width="500px">
		<template v-slot:activator="{ on, attrs }">
			<v-text-field :value="localDateFormatted" :append-icon="icon" readonly v-bind="$attrs" v-on="on" @click:clear="clear"></v-text-field>
		</template>
		<v-date-picker v-model="localDate" scrollable clearable full-width :range="range" v-if="dialog">
			<v-spacer></v-spacer>
			<v-btn text color="primary" @click="dialog = false">{{ $t('Cancel') }}</v-btn>
			<v-btn text color="primary" @click="okClicked">{{ $t('OK') }}</v-btn>
		</v-date-picker>
	</v-dialog>
</template>

<script>

const arrify = require('arrify')

export default {
	props: {
		value: {
			type: [String, Array],
			required: false
		}
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	data() {
		return {
			dialog: false,
			// wtf: []
			// theDate: new Date().toISOString().substr(0, 10)
		}
	},
	computed: {
		range() {
			return Array.isArray(this.value)
		},
		icon() {
			return this.range ? 'mdi-calendar-range' : 'mdi-calendar'
		},
		localDate: {
			set(value) {
				const changeValue = this.range ? value.sort() : value
				this.$emit('change', changeValue)
			},
			get() {
				return this.value
			}
		},
		localDateFormatted() {
			return arrify(this.localDate).join(' - ')
		}
	},
	methods: {
		okClicked() {
			// this calls the localDate setter AND closes the dialog
			// if closing the dialog directly (dialog=false) then this reverts localDate with the original value
			// kind of neat and useful
			this.$refs.dialog.save(this.localDate)
		},
		clear() {
			this.localDate = this.range ? [] : null
		}
	}
}
</script>