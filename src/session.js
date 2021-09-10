const { Session } = require('@kweli/cs-rest')

export default {
    install(Vue, options) {
        if (Vue.config.globalProperties) {
            // v3
            Vue.config.globalProperties.$session = new Session(options)
        } else {
            //  v2
            Vue.prototype.$session = new Session(options)
        }
    },
}
