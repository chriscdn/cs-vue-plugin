<template>
	<input type="button" v-bind="localProps" v-on="$listeners" />
</template>
<script>
export default {
	props: {

	},
	data() {
		return {}
	},
	computed: {
		localProps() {
			return {
				value: this.$slots.default[0].text,
				...this.$props
			}
		}
	}
}
</script>
<style lang="less" scoped>
input {
	color: #232e72;
	padding: 2px 15px;
	background: #FFFFFF;
	border: 1px solid #232e72;
	cursor: pointer;
	border-radius: 12px;
	margin: 2px 6px;

	&:hover {
		border: 1px solid black;
	}

}
</style>