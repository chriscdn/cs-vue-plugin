<template>
    <v-dialog ref="dialog" v-model="dialog" :return-value.sync="localDate" persistent width="500px">
        <template #activator="{ on }">
            <v-text-field :value="displayValue" append-icon="mdi-calendar" readonly v-bind="$attrs" v-on="on" @click:clear="clear"></v-text-field>
        </template>
        <v-card v-if="dialog">
            <v-card-text class="pt-0 title primary">
                <div class="v-picker__title primary">
                    <div class="v-date-picker-title">
                        <div class="v-date-picker-title__year">
                            <transition :name="computedTransition">
                                <div :key="displayValueYear">{{ displayValueYear }}</div>
                            </transition>
                        </div>
                        <div class="v-date-picker-title__date">
                            <transition :name="computedTransition">
                                <div :key="displayValueHeader">{{ displayValueHeader }}</div>
                            </transition>
                        </div>
                    </div>
                </div>
            </v-card-text>
            <v-card-text class="pa-0">
                <v-tabs v-model="tabs">
                    <v-tab href="#date">
                        <v-icon>mdi-calendar-today</v-icon>
                    </v-tab>
                    <v-tab href="#time" :disabled="!localDateValue">
                        <v-icon>mdi-clock</v-icon>
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tabs">
                    <v-tab-item id="date">
                        <v-date-picker v-model="localDateValue" no-title :locale="$language.current" scrollable full-width></v-date-picker>
                    </v-tab-item>
                    <v-tab-item id="time">
                        <v-time-picker
                            ref="timePicker"
                            v-model="localTimeValue"
                            no-title
                            format="24hr"
                            :locale="$language.current"
                            scrollable
                            full-width
                        ></v-time-picker>
                    </v-tab-item>
                </v-tabs-items>
            </v-card-text>
            <v-card-actions>
                <v-btn text @click="reset">{{ $t('Reset') }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = false">{{ $t('Cancel') }}</v-btn>
                <v-btn text @click="okClicked">{{ $t('OK') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
const moment = require('moment')

export default {
    model: {
        prop: 'value',
        event: 'change',
    },
    props: {
        value: {
            type: String,
            required: false,
        },
    },
    data() {
        return {
            tabs: 'date',
            dialog: false,
            isReversing: false,
            originalValue: null,
        }
    },
    computed: {
        localDate: {
            set(value) {
                const m = this.momentize(value)

                if (m.isValid()) {
                    this.$emit('change', m.format('YYYY-MM-DDTHH:mm'))
                } else {
                    this.$emit('change', null)
                }
            },
            get() {
                return this.value
            },
        },

        localDateValue: {
            get() {
                const m = this.momentize(this.localDate)
                return m.isValid() ? m.format('YYYY-MM-DD') : null
            },
            set(value) {
                const v = `${value}T${this.localTimeValue}`
                this.localDate = this.momentize(v)
            },
        },

        localTimeValue: {
            get() {
                const m = this.momentize(this.localDate)
                return m.isValid() ? m.format('HH:mm') : '00:00'
            },
            set(value) {
                const v = `${this.localDateValue}T${value}`
                this.localDate = this.momentize(v)
            },
        },

        displayValueYear() {
            const m = this.momentize(this.localDate)
            return m.isValid() ? m.format('YYYY') : null
        },

        displayValueHeader() {
            const m = this.momentize(this.localDate)
            return m.isValid() ? m.format('MMMM DD HH:mm') : null
        },

        displayValue() {
            const m = this.momentize(this.localDate)
            return m.isValid() ? m.format('LLL') : null
        },

        computedTransition() {
            return this.isReversing ? 'picker-reverse-transition' : 'picker-transition'
            // return 'fade'
        },
        // dialogDisplayValue() {
        // 	const m = moment(this.dialogValue)

        // 	return m.format('LLL ZZ')
        // },
        // localDisplayValue() {
        // 	const m = moment(this.value)
        // 	return m.format('LLL ZZ')
        // }
    },
    watch: {
        localDate(val, prev) {
            this.isReversing = val < prev
            this.tabs = 'time'
        },
        dialog(value) {
            if (value) {
                this.tabs = 'date'
                this.originalValue = this.value
            }
        },
        tabs() {
            // private method for force hour picker
            this.makeMinutesSelectable()
        },
    },
    methods: {
        momentize(value) {
            return moment(value)
        },

        reset() {
            this.localDate = this.originalValue
            this.makeMinutesSelectable()
        },

        okClicked() {
            // this calls the localDate setter AND closes the dialog
            // if closing the dialog directly (dialog=false) then this reverts localDate with the original value
            // kind of neat and useful
            this.$refs.dialog.save(this.localDate)
        },

        clear() {
            this.localDate = null
        },
        makeMinutesSelectable() {
            if (this.$refs.timePicker) {
                this.$refs.timePicker.selecting = 1
            }
        },
    },
}
</script>
<!-- <style lang="less">
.fade-enter-active, .fade-leave-active {
	transition: 2.5s;
}

.fade-enter, .fade-leave-to {
	// opacity: 0;
	position: absolute!important;
	transform: rotateY(180deg);
}
</style> -->
