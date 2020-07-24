const moment = require('moment')

import Session from '../session'
import Autocomplete from './components/Autocomplete.vue'
import BrowseLink from './components/BrowseLink.vue'
import CsButton from './components/CsButton.vue'
import DatePicker from './components/DatePicker.vue'
import Dialog from './components/Dialog.vue'
import DropZone from '../shared-components/DropZone.vue'
import FacetSidebar from './components/FacetSidebar.vue'
import FunctionMenu from './components/FunctionMenu.vue'
import PageDropZone from '../shared-components/PageDropZone.vue'
import PageTitle from './components/PageTitle.vue'
import Paginator from './components/Paginator.vue'
import PaginatorVue from './components/PaginatorVue.vue'
import PleaseWait from './components/PleaseWait.vue'

import SchemaForm from './components/categories/SchemaForm.vue'
import SchemaFormField from './components/categories/SchemaFormField.vue'
import SchemaMultiFormField from './components/categories/SchemaMultiFormField.vue'
import SchemaErrorMessages from './components/categories/SchemaErrorMessages.vue'

import SortHeader from './components/SortHeader.vue'
import UserLink from './components/UserLink.vue'
import UserPicker from './components/UserPicker.vue'
import TargetBrowseNodePicker from './components/TargetBrowseNodePicker.vue'
import VersionFunctionMenu from './components/VersionFunctionMenu.vue'

import {
    ToggleButton
} from 'vue-js-toggle-button'
import Toasted from 'vue-toasted'

// import 'v-slim-dialog/dist/v-slim-dialog.css'
// import SlimDialog from 'v-slim-dialog'

import './styles/common.less'
import './styles/cs-vue-plugin.less'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
    install(Vue, options) {

        Vue.use(Session, options)

        Vue.prototype.$img = options.img
        Vue.prototype.$cgi = options.baseURL

        Vue.prototype.$jsLongDateFormat = options.datelong
        Vue.prototype.$jsShortDateFormat = options.dateshort

        Vue.component('Autocomplete', Autocomplete)
        Vue.component('BrowseLink', BrowseLink)
        Vue.component('CsButton', CsButton)
        Vue.component('DatePicker', DatePicker)
        Vue.component('Dialog', Dialog)
        Vue.component('DropZone', DropZone)
        Vue.component('FacetSidebar', FacetSidebar)
        Vue.component('FunctionMenu', FunctionMenu)
        Vue.component('PageDropZone', PageDropZone)
        Vue.component('PageTitle', PageTitle)
        Vue.component('Paginator', Paginator)
        Vue.component('PaginatorVue', PaginatorVue)
        Vue.component('PleaseWait', PleaseWait)

        Vue.component('SchemaForm', SchemaForm)
        Vue.component('SchemaFormField', SchemaFormField)
        Vue.component('SchemaMultiFormField', SchemaMultiFormField)
        Vue.component('SchemaErrorMessages', SchemaErrorMessages)

        Vue.component('SortHeader', SortHeader)
        Vue.component('TargetBrowseNodePicker', TargetBrowseNodePicker)
        Vue.component('UserLink', UserLink)
        Vue.component('UserPicker', UserPicker)
        Vue.component('ToggleButton', ToggleButton)
        Vue.component('VersionFunctionMenu', VersionFunctionMenu)
        
        Vue.filter('moment', function(value, format) {
            let d = moment(value)
            switch (format) {
                case 'long':
                    return d.format(options.datelong)
                case 'short':
                    return d.format(options.dateshort)
                default:
                    return d.format(format)
            }
        })

        // https://www.npmjs.com/package/vue-toasted
        Vue.use(Toasted, {
            duration: 5000
        })

        // Vue.use(SlimDialog)
        Vue.use(Loading)
    }
}