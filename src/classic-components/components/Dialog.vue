<template>
    <transition name="fade">
        <div v-if="dialog" class="modal">
            <div ref="content" v-click-outside="closeDialog" class="modal-content" :style="[innerStyle]">
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script>
import ClickOutside from 'vue-click-outside'
// import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

export default {
    directives: {
        ClickOutside,
    },
    model: {
        prop: 'value',
        event: 'change',
    },
    props: {
        value: {
            type: Boolean,
            required: false,
        },
        width: {
            type: String,
            default: '600px',
        },
    },
    data() {
        return {
            dialog: false,
        }
    },
    computed: {
        innerStyle() {
            return {
                width: this.width,
            }
        },
    },

    watch: {
        value: {
            handler(value) {
                this.dialog = value
            },
            immediate: true,
        },
        async dialog(value) {
            this.$emit('change', value)

            /*if (value) {
				await this.$nextTick()
				disableBodyScroll(this.$refs.content)
			} else {
				enableBodyScroll(this.$refs.content)
			}*/
        },
    },
    methods: {
        closeDialog() {
            if (this.dialog) {
                this.dialog = false
            }
        },
    },
}
</script>

<style lang="less" scoped>
.modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);

    .modal-content {
        background-color: #fff;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 10px;
        max-height: 80vh;
        overflow: auto;
        border-radius: 8px;
    }s
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
