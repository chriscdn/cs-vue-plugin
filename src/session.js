const { Session } = require('@kweli/cs-rest')

export default {
    install(Vue, options) {
        Vue.prototype.$session = new Session(options)
    }
}