<template>
	<!--  -->
	<v-dialog ref="dialog" v-model="dialog" :return-value.sync="localDate" persistent width="290px">
		<template v-slot:activator="{ on, attrs }">
			<v-text-field :value="localDateFormatted" append-icon="mdi-calendar-range" readonly v-bind="$attrs" v-on="on"></v-text-field>
		</template>
		<v-date-picker v-model="localDate" scrollable clearable :range="true">
			<v-spacer></v-spacer>
			<v-btn text color="primary" @click="dialog = false">Cancel</v-btn>
			<v-btn text color="primary" @click="okClicked">OK</v-btn>
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
			wtf: []
			// theDate: new Date().toISOString().substr(0, 10)
		}
	},
	computed: {
		range() {
			return Array.isArray(this.value)
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
		}
	}
}
</script>