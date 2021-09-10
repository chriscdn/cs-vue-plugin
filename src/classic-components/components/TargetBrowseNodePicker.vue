<template>
    <span>
        <slot :openWindow="openWindow" :clear="clear">
            <div class="rhnodeselect">
                <input ref="input" type="text" :value="name" @focus="openWindow" />
                <button @click="openWindow">{{ browseButtonLabel }}</button>
                <button @click="clear">{{ clearButtonLabel }}</button>
                <div v-html="breadcrumbString"></div>
            </div>
        </slot>
    </span>
</template>

<script>
const buildUrl = require('build-url')
import get from 'lodash.get'
const cookies = require('js-cookie')

export default {
    model: {
        prop: 'value',
        event: 'change',
    },
    props: {
        title: {
            type: String,
            default: 'Target Browse',
        },
        objid: {
            type: Number,
            default: null,
            // required: false,
            // default: parseInt(cookies.get('TargetBrowseObjID')) || 0
        },
        selectperm: {
            type: Number,
            default: 2, // read permissions
        },
        width: {
            type: Number,
            default: 800,
        },
        height: {
            type: Number,
            default: 600,
        },
        selectScreen: {
            type: Array,
            default: () => [],
        },
        browseButtonLabel: {
            type: String,
            default: 'Browse Content Server...',
        },
        clearButtonLabel: {
            type: String,
            default: 'clear',
        },
        value: {
            type: Number,
            default: null,
            // required: false,
        },
    },
    data() {
        return {
            dataid: this.value,
            breadcrumb: '',
        }
    },
    computed: {
        uniqueID() {
            return `targetbrowse_${this._uid}`
        },

        breadcrumbString() {
            if (this.breadcrumb) {
                return `Path: ${this.breadcrumb.replace(':', ' &#9654; ')}`
            } else {
                return null
            }
        },

        globalCallbackFunctionName() {
            return `${this.uniqueID}_DoSelection`
        },

        selectScreenString() {
            if (this.selectScreen.length) {
                return {
                    selectScreen: `{${this.selectScreen.join(',')}}`,
                }
            } else {
                return null
            }
        },

        urlParams() {
            // console.log(this.selectScreen)
            return {
                func: 'll',
                objAction: 'targetBrowse',
                headerLabel: this.title,
                objid: this.targetBrowseObjID(),
                selectPerm: this.selectperm,
                ...this.selectScreenString,
                formname: 'ignored',
                fieldPrefix: this.uniqueID,
            }
        },

        url() {
            return buildUrl(this.$cgi, {
                queryParams: this.urlParams,
            })
        },

        name() {
            return (this.breadcrumb || '').split(':').slice(-1)[0]
        },

        windowParams() {
            return `width=${this.width},height=${this.height},resizable=yes,menubar=no,scrollbars=yes,toolbar=yes`
        },
    },
    watch: {
        dataid(value) {
            this.$emit('updated', {
                dataid: value,
                name: this.name,
                breadcrumb: this.breadcrumb,
            })
        },
    },
    async mounted() {
        window[this.globalCallbackFunctionName] = this.callback

        if (this.dataid) {
            const response = await this.$session.nodes.ancestors(this.dataid)
            this.breadcrumb = get(response, 'data.ancestors', [])
                .map(item => item.name)
                .join(':')
        }
    },
    beforeDestroy() {
        delete window[this.globalCallbackFunctionName]
    },
    methods: {
        openWindow() {
            window.open(this.url, 'WindowName', this.windowParams)
            if (this.$refs.input) {
                this.$refs.input.blur()
            }
        },
        targetBrowseObjID() {
            // not computed, since cookies are not reactive
            return this.objid || parseInt(cookies.get('TargetBrowseObjID')) || 0
        },
        didCloseWindow() {
            console.log('didClose')
        },
        callback(dataid, breadcrumb) {
            this.$emit('change', dataid)
            this.dataid = dataid
            this.breadcrumb = breadcrumb
        },
        clear() {
            this.$emit('change', null)
            this.dataid = null
            this.breadcrumb = null
        },
    },
}
</script>

<style lang="less" scoped>
.rhnodeselect {
    input[type='text'] {
        width: 20em;

        div {
            font-size: 0.9em;
        }
    }

    > button {
        margin-left: 0.2em;
    }
}
</style>
