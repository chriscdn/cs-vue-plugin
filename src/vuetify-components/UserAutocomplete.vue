<template>
	<!-- attach fixes positioning in smartui -->
	<v-autocomplete attach v-bind="$attrs" v-on="$listeners" v-model="select" :loading="loading" :items="items" :search-input.sync="search" hide-no-data :prepend-inner-icon="iconForType(selectedItem)">
		<template v-slot:item="data">
			<v-icon color="primary" class="mr-1">{{ iconForType(data.item) }}</v-icon>
			{{ data.item.text }}
		</template>
	</v-autocomplete>
</template>
<!-- be sure to document the trick above for wrapping a component! -->
<script>
const get = require('lodash.get')
const debounce = require('lodash.debounce')

export default {
	// https://vuetifyjs.com/en/components/autocompletes
	props: {

	},
	data() {
		return {
			loading: false,
			items: [],
			search: null,
			select: null,
		}
	},

	computed: {
		selectedItem() {
			return this.items.find(item => item.value == this.select)
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

			// see classic-components UserPicker for
			// dealing with user or group filter

			this.$session.members.userQuery(v)
				.then(response => {
					this.items = response.data.results.map(item => ({
						text: get(item, 'data.properties.name_formatted'),
						value: get(item, 'data.properties.id'),
						type: get(item, 'data.properties.type')
					}))
				})
				.finally(() => this.loading = false)
		}, 500),

		iconForType(select) {
			if (get(select, 'type') == this.USER) {
				return 'mdi-account'
			} else if (get(select, 'type') == this.GROUP) {
				return 'mdi-account-multiple'
			} else {
				return ''
			}
			// prepend-inner-icon="search"
		},
		loadInitialValue() {
			let initialValue = get(this, '$attrs.value')

			if (initialValue) {
				this.loading = true
				this.$session.members.member(initialValue)
					.then(response => {
						let value = get(response, 'data.results.data.properties.id')
						let type = get(response, 'data.results.data.properties.type')
						let text = get(response, 'data.results.data.properties.name_formatted')

						if (value) {
							this.items = [{ type, text, value }]
							this.select = value
						}
					})
					.finally(() => this.loading = false)
			}
		}
	},
	watch: {
		search(val) {
			val && val !== this.select && this.querySelections(val)
		},
	},
	mounted() {
		this.loadInitialValue()

	}
}
</script>
<!-- <v-autocomplete
      v-model="select"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      cache-items
      class="mx-4"
      flat
      hide-no-data
      hide-details
      label="What state are you from?"
      solo-inverted
    ></v-autocomplete> -->