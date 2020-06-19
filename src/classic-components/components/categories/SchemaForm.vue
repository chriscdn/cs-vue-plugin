<template>
	<div v-if="loaded" class="rhcore">
		<slot v-bind:schema="schema" v-bind:categories="categories" v-bind:saveCategories="saveCategories" v-bind:validate="validate"></slot>
	</div>
</template>

<script>
const get = require('lodash.get')
const has = require('lodash.has')
const set = require('lodash.set')
import validator from '../../../utils/json-schema'

export default {
	components: {},

	props: {
		dataid: {
			type: Number,
			required: true
		},
		schemas: {
			type: Array,
			default: () => []
		}
	},

	data() {
		return {
			schema: {},
			categories: {},
			validation: [],
			payload: {
				errors: {} // hack to get the dependency injection to remain reactive for the ErrorMessages.vue component
			}
		}
	},
	computed: {
		loaded() {
			return !!Object.keys(this.categories).length
		},
		errors() {
			const results = {}

			this.validation.forEach(item => {
				const sKeypath = item.dataPath.slice(1)
				const message = `This field ${item.message}.`
				const messages = get(results, sKeypath, [])

				messages.push(message)

				results[sKeypath] = messages
			})

			return results
		}
	},
	methods: {

		setter(keypath, value) {

			// NB! This keypath may not end with an array index! The
			// lodash.set function will break reactivity in this case.
			// 
			// Good: keypath = a.b[0].c = [value]
			// BAD: keypath = a.b[0].c[0] = value

			if (has(this.categories, keypath)) {
				set(this.categories, keypath, value)
			} else {
				throw new Error('SchemaForm::set invalid keypath.')
			}
		},

		getter(keypath) {
			return get(this.categories, keypath)
		},

		validate() {
			this.validation = validator(this.schema, this.categories)
		},
		async saveCategories() {
			const response = await this.$session.postForm(`/api/v1/rh/nodes/${this.dataid}/categories/`, {
				categories: this.categories
			})

			this.schema = get(response, 'data.schema')
			this.categories = get(response, 'data.categories')
		},
		async loadCategories() {
			this.$session.get(`/api/v1/rh/nodes/${this.dataid}/categories/`, {
					params: {
						schemas: JSON.stringify(this.schemas)
					}
				})
				.then(response => {
					this.schema = get(response, 'data.schema')
					this.categories = get(response, 'data.categories')
				})
		}
	},
	provide() {
		return {
			payload: this.payload
		}
	},
	mounted() {
		// this.dataid = 301235
		this.loadCategories()
	},
	watch: {
		categories: {
			handler(value) {
				this.$emit('update:categories', value)
			},
			deep: true
		},
		errors(v) {
			this.payload.errors = v
		}
	}
}
</script>