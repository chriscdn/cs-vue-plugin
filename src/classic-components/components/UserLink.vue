<template>
	<!-- <span><img :src="userrec.gif" />&nbsp;<a href="#" @click.prevent="click">{{ userrec.displayname }}</a></span> -->
	<span v-if="localUserRec"><img :src="gif_url" v-if="gif" />&nbsp;<a href="#" @click.prevent="click">{{ displayName }}</a></span>

</template>
<script>
const get = require('lodash.get')

export default {
	props: {
		userrec: {
			type: Object,
			required: false
		},
		userid: {
			type: Number,
			required: false
		},
		gif: {
			type:Boolean,
			default: false
		}
	},

	data() {
		return {
			localUserRec: null
		}
	},

	computed: {
		user_id() {
			return get(this.localUserRec, 'id') || get(this.localUserRec, 'userid')
		},
		gif_url() {
			let gif = get(this.localUserRec, 'gif')

			if (!gif) {
				if (this.type == 0) {
					// user
					return `${this.$img}guy.gif`
				} else if (this.type == 1) {
					// group
					return `${this.$img}2-guys.gif`
				} else {
					// role?
					return `${this.$img}projectgroup.gif`
				}
			}

			return gif
		},
		displayName() {
			return get(this.localUserRec, 'display_name') || get(this.localUserRec, 'displayname')
		},
		type() {
			return get(this.localUserRec, 'type')
		}
	},

	methods: {
		click() {
			window.baseUrl = window.baseURL
			window.doUserDialog(this.user_id)
		}
	},
	watch: {
		userid: {
			handler(value) {
				if (value) {
					this.$session.members.member(value, 'v1')
						.then(response => this.localUserRec = get(response, 'data.data'))
				}
			},
			immediate: true
		},
		userrec: {
			handler(value) {
				if (value) {
					this.localUserRec = value
				}
			},
			immediate: true
		}
	}
}
</script>