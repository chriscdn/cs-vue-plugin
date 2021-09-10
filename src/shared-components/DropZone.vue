<template>
    <div
        @dragover.stop.prevent="dropOn"
        @dragenter.stop.prevent="dropOn"
        @dragleave.stop.prevent="dropOff"
        @dragexit.stop.prevent="dropOff"
        @dragend.stop.prevent="dropOff"
        @drop.stop.prevent="drop"
        @dragdrop.stop.prevent="drop"
    >
        <slot></slot>
    </div>
    <!-- :for="uid"  -->
    <!-- <input multiple :id="uid" type="file" ref="fileInput"
		 @change="filesChanged" /> -->
    <!-- accept="image/x-png,image/gif,image/jpeg" -->
</template>

<script>
export default {
    methods: {
        dropOn(_event) {
            this.$emit('active', true)
        },
        dropOff(_event) {
            this.$emit('active', false)
        },
        drop(event) {
            if (event.dataTransfer && event.dataTransfer.files.length) {
                let files = event.dataTransfer.files
                this.$emit('drop', Array.from(files))
                this.$emit('active', false)
            }
        },
    },
}
</script>
