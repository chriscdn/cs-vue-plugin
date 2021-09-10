<template>
    <div v-if="loaded" class="rhcore">
        <slot :schema="schema" :categories="categories" :saveCategories="saveCategories" :validate="validate" :reset="loadCategories"></slot>
    </div>
</template>
<script>
import get from 'lodash.get'
const has = require('lodash.has')
const set = require('lodash.set')
import validator from '../../../utils/json-schema'

export default {
    components: {},
    provide() {
        return {
            payload: this.payload,
        }
    },

    props: {
        dataid: {
            type: Number,
            required: true,
        },
        schemas: {
            type: Array,
            default: () => [],
        },
        loadcb: {
            type: Function,
            default: item => item,
        },
    },

    data() {
        return {
            schema: {},
            categories: {},
            validation: [],
            payload: {
                errors: {}, // hack to get the dependency injection to remain reactive for the ErrorMessages.vue component
            },
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
        },
        hasNoValidationErrors() {
            return !this.hasValidationErrors
        },
        hasValidationErrors() {
            return !!this.validation.length
        },
    },
    watch: {
        categories: {
            handler(value) {
                this.$emit('update:categories', value)
            },
            deep: true,
        },
        errors(v) {
            this.payload.errors = v
        },
    },
    mounted() {
        // this.dataid = 301235
        this.loadCategories()
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

        getter(keypath, defaultValue = null) {
            return get(this.categories, keypath, defaultValue)
        },

        validate(emit = true) {
            this.validation = validator(this.schema, this.categories)

            if (emit) {
                if (this.hasValidationErrors) {
                    this.$emit('didFailValidation')
                } else {
                    this.$emit('didPassValidation')
                }
            }

            return this.hasNoValidationErrors
        },
        async saveCategories() {
            if (this.validate(false)) {
                this.$emit('willSaveCategories')

                this.$session
                    .postForm(`/api/v1/rh/nodes/${this.dataid}/categories/`, {
                        categories: this.categories,
                    })
                    .then(response => {
                        this.schema = get(response, 'data.schema')
                        this.categories = get(response, 'data.categories')
                        this.$emit('didSaveCategories')
                    })
                    .catch(err => {
                        console.log(err)
                        this.$emit('didFailSaveCategories', get(err, 'response.data'))
                    })
            } else {
                this.$emit('didFailValidation')
            }
        },
        async loadCategories() {
            this.$session
                .get(`/api/v1/rh/nodes/${this.dataid}/categories/`, {
                    params: {
                        schemas: JSON.stringify(this.schemas),
                    },
                })
                .then(response => {
                    const items = this.loadcb(response.data)

                    this.schema = items.schema
                    this.categories = items.categories
                })
        },
    },
}
</script>
