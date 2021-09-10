import Session from '../session'
import SnackBarQueue from './SnackBarQueue.vue'
import UserAutocomplete from './UserAutocomplete.vue'
import DropZone from '../shared-components/DropZone.vue'
import DatePickerDialog from './DatePickerDialog.vue'
import DateTimePickerDialog from './DateTimePickerDialog.vue'

export default {
    install(Vue, options) {
        Vue.use(Session, options)

        Vue.prototype.$img = options.img
        Vue.prototype.$cgi = options.baseURL

        Vue.component('SnackBarQueue', SnackBarQueue)
        Vue.component('UserAutocomplete', UserAutocomplete)
        Vue.component('DropZone', DropZone)
        Vue.component('DatePickerDialog', DatePickerDialog)
        Vue.component('DateTimePickerDialog', DateTimePickerDialog)
    },
}
