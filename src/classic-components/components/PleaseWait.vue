<template>
	<div v-if="loading" class="centerOverlay">
		<div class="spinner"></div>
	</div>
</template>

<script>
export default {
	props: {
		loading: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {}
	}
}
</script>
<style lang="less" scoped>

@spinnerSize: 60px;

.centerOverlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	background-color: rgba(0, 0, 0, .3);
	z-index: 50;

	.spinner {
		width: @spinnerSize;
		height: @spinnerSize;
		background-color: #2e6ab1;
		margin: 100px auto;
		-webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;
		animation: sk-rotateplane 1.2s infinite ease-in-out;
	}
}

@-webkit-keyframes sk-rotateplane {
	0% {
		-webkit-transform: perspective(120px)
	}
	50% {
		-webkit-transform: perspective(120px) rotateY(180deg)
	}
	100% {
		-webkit-transform: perspective(120px) rotateY(180deg) rotateX(180deg)
	}
}
@keyframes sk-rotateplane {
	0% {
		transform: perspective(120px) rotateX(0deg) rotateY(0deg);
		-webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg)
	}
	50% {
		transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
		-webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg)
	}
	100% {
		transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
		-webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
	}
}
</style>