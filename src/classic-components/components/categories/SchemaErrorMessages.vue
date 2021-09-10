<template>
    <transition-group tag="div" name="error">
        <div v-for="errorMessage in errorMessages" :key="errorMessage" class="error-item">{{ errorMessage }}</div>
    </transition-group>
</template>
<script>
import get from 'lodash.get'

export default {
    inject: ['payload'],
    props: {
        errorPath: {
            type: String,
            required: true,
        },
    },

    computed: {
        errors() {
            return get(this.payload, 'errors', {})
        },
        errorMessages() {
            return this.errors[this.errorPath]
        },
        hasErrors() {
            return !!this.errorMessages.length
        },
    },
}
</script>
<style lang="less" scoped>
.error-item {
    color: red;
}

.error-enter-active,
.error-leave-active {
    transition: all 0.3s;
}

.error-enter,
.error-leave-to {
    opacity: 0;
    transform: translateY(-1em);
}
</style>
