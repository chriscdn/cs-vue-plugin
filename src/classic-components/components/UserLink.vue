<template>
	<span><img :src="userrec.gif" />&nbsp;<a href="#" @click.prevent="click">{{ userrec.displayname }}</a></span>
</template>

<script>
export default {
	props: ['userrec'],
	methods: {
		click() {
			window.baseUrl = window.baseURL
			window.doUserDialog(this.userrec.userid)
		}
	}
}
</script>