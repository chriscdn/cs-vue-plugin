<template>
    <input type="button" v-bind="localProps" />
</template>
<script>
export default {
    props: {},
    data() {
        return {}
    },
    computed: {
        slotText() {
            // https://stackoverflow.com/questions/42950967/how-to-reference-text-thats-in-slot-slot-in-vue-js
            if (this.isVue3) {
                return this.$slots.default ? this.getSlotChildrenTextV3(this.$slots.default()) : ''
            } else {
                return this.getSlotChildrenTextV2(this.$slots.default)
            }
        },
        localProps() {
            return {
                value: this.slotText,
                ...this.$attrs,
            }
        },
    },
    methods: {
        getSlotChildrenTextV2(children) {
            return children
                .map(function(node) {
                    return node.children ? this.getSlotChildrenTextV2(node.children) : node.text
                })
                .join('')
        },
        getSlotChildrenTextV3(children) {
            return children
                .map(node => {
                    if (!node.children || typeof node.children === 'string') return node.children || ''
                    else if (Array.isArray(node.children)) return this.getSlotChildrenTextV3(node.children)
                    else if (node.children.default) return this.getSlotChildrenTextV3(node.children.default())
                })
                .join('')
        },
    },
}
</script>
<style lang="less" scoped>
@active-color: #232e72;
@disabled-color: #ddd;
input {
    color: @active-color;
    padding: 2px 15px;
    background: #ffffff;
    border: 1px solid @active-color;
    cursor: pointer;
    border-radius: 12px;
    margin: 2px 6px;

    &:hover {
        border: 1px solid black;
    }
    &[disabled],
    :disabled {
        border: 1px solid @disabled-color;
        color: @disabled-color;
    }
}
</style>
