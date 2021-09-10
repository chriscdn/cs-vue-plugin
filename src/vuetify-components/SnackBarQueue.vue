<template>
    <v-snackbar v-model="show" :color="snackbar.color" :timeout="snackbar.timeout" top center
        >{{ snackbar.text }}
        <v-btn dark icon @click.prevent="show = false">
            <v-icon>mdi-close</v-icon>
            <!-- this will depend on which icons are used -->
        </v-btn>
    </v-snackbar>
</template>

<script>
import Vue from 'vue'

// This component will eventually be on npm as @chriscdn/v-snackbar-queue

export default {
    props: {
        color: {
            type: String,
            default: 'primary',
        },
        timeout: {
            type: Number,
            default: 6000,
        },
    },

    data() {
        return {
            snackbar: {}, //  { ...defaultOptions },
            defaultSnackbar: {
                // ...defaultOptions,
                color: this.color,
                timeout: this.timeout,
            },
            show: false,
            items: [],
        }
    },
    watch: {
        show(value) {
            if (!value) {
                this.$nextTick(() => {
                    this.processNext()
                })
            }
        },
    },
    beforeCreate() {
        Vue.prototype.$snackbar = (text, options) => this.queue(text, options)
        Vue.prototype.$snackbarerror = (text, options) =>
            this.queue(text, {
                color: 'error',
                ...options,
            })
    },
    methods: {
        processNext() {
            let next = this.items.shift()

            if (next) {
                this.snackbar = next
                this.show = true
            }
        },

        queue(text, options = {}) {
            this.items.push({
                ...this.defaultSnackbar,
                ...options,
                text,
            })

            if (!this.show) {
                this.processNext()
            }
        },
    },
}
</script>

<style lang="less">
.v-snack {
    font-size: 1.2em !important;
}
</style>
