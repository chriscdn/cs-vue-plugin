<template>
	<div>
		<!-- get rid of div -->
		<Autocomplete :placeholder="placeholder" v-model="localValue" :width="width" :loading="loading" :search-input.sync="searchText" :readonly="readonly" :items="items">
			<template v-slot:item="data">
				<img v-if="data.item.type == USER" :src="`${$img}guy.gif`" />
				<img v-else-if="data.item.type == GROUP" :src="`${$img}2-guys.gif`" />
				<span v-html="formatChoice(data)"></span><!-- {{ slotProps.item.value }} -->
			</template>
		</autocomplete>
	</div>
</template>
<script>
import Autocomplete from './Autocomplete.vue'
const get = require('lodash.get')
const debounce = require('lodash.debounce')

export default {
	components: { Autocomplete },

	props: {
		value: {
			type: Number,
			required: false
		},
		users: {
			type: Boolean,
			default: true
		},
		groups: {
			type: Boolean,
			default: false
		},
		width: {
			type: [String, Number],
			default: '100%'
		}
	},

	model: {
		prop: 'value',
		event: 'change'
	},

	data() {
		return {
			loading: false,
			searchText: null,
			readonly: false,
			pleaseWait: false,
			items: []
		}
	},

	computed: {
		localValue: {
			set(value) {
				// console.log('UserPicker emitting: ', value)
				// this.$emit('change', get(value, 'data'))
				this.$emit('change', value)
			},
			get() {
				return this.value
			}
		},
		options() {
			let where_type = null

			if (this.users && this.groups) {
				where_type = null // defaults to both
			} else if (this.users) {
				where_type = this.USER
			} else if (this.groups) {
				where_type = this.GROUP
			}

			return { where_type }
		},
		placeholder() {
			if (this.pleaseWait) {
				return 'Loading...'
			} else if (this.users && this.groups) {
				return 'Search for user or group...'
			} else if (this.users) {
				return 'Search for user...'
			} else if (this.groups) {
				return 'Search for group...'
			} else {
				return ''
			}
		},
		USER() {
			return this.$session.members.USER
		},
		GROUP() {
			return this.$session.members.GROUP
		}
	},

	methods: {
		querySelections: debounce(function(v) {
			this.loading = true

			this.$session.members.userQuery(v, this.options, 'v1')
				.then(response => {
					this.items = response.data.data.map(item => ({
						text: get(item, 'name_formatted'),
						value: get(item, 'id'),
						type: get(item, 'type')
					}))
				})
				.finally(() => this.loading = false)
		}, 500),

		formatChoice(slotProps) {
			return get(slotProps, 'item.text', '')
		},

		loadInitialValue() {
			let initialValue = this.value

			if (initialValue) {
				this.pleaseWait = true
				this.readonly = true
				this.loading = true

				this.$session.members.member(initialValue, 'v1')
					.then(response => {
						let value = get(response, 'data.data.id')
						let type = get(response, 'data.data.type')
						let text = get(response, 'data.data.name')

						if (value) {
							this.items = [{ type, text, value }]
							this.select = value
						}
					})
					.finally(() => {
						this.pleaseWait = false
						this.readonly = false
						this.loading = false
					})
			}
		}
	},
	watch: {
		searchText(val) {
			val && val !== this.select && this.querySelections(val)
		},
		value: {
			handler() {
				// TODO: this catches ALL changes, including edits using the widget.
				// this might not be so bad... but it does create extra network requests
				// to think about ....
				this.loadInitialValue()
			},
			immediate: true
		},
	},
	mounted() {
		// this.loadInitialValue()
	}
}
</script>
<style lang="less" scoped>
// spacing between user/group icon and label
img {
	margin-right: 0.5em;
}
</style>