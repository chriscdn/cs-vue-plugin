<template>
    <div class="rhsidepanel">
        <div class="rhfacetitem">
            <div>Content Filter</div>
        </div>
        <div class="rhfacetform">
            <input v-model="filterValue" @keyup.enter="applyFilter" />
        </div>
        <div v-for="facet in facets" :key="facet.facetNode.dataid" class="rhfacetitem">
            <div>{{ facet.facetNode.name }}</div>
            <ul class="rhfacetlist">
                <template v-for="value in facet.displayValues">
                    <li v-if="isSelectedFacet(facet.queryParameter, value.Facet)" :key="`a-${value.Facet}`">
                        <strong>{{ value.DisplayValue }}</strong>
                        &nbsp;<span class="facetCount">({{ value.Total }})</span> [<a href="#" @click.prevent="deselectFacet(facet.queryParameter, value.Facet)"
                            >x</a
                        >]
                    </li>
                    <li v-else :key="`b-${value.Facet}`">
                        <a href="#" @click.prevent="selectFacet(facet.queryParameter, value.Facet)">{{ value.DisplayValue }}</a
                        >&nbsp;<span class="facetCount">({{ value.Total }})</span>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>
const cloneDeep = require('lodash.clonedeep')

export default {
    model: {
        prop: 'state',
        event: 'facetchange',
    },
    props: {
        filter: {
            type: String,
        },
        facets: {
            type: Array,
            required: true,
        },
        state: {
            type: Object, // {selectedFacets:{}, filter:""}
        },
    },

    data() {
        return {
            filterValue: this.state.filter,
        }
    },
    computed: {
        stateLocal: {
            set(value) {
                this.$emit('facetchange', Object.assign({}, this.stateLocal, value))
            },
            get() {
                return this.state
            },
        },
        filterLocal: {
            set(value) {
                this.stateLocal = { filter: value }
            },
            get() {
                return this.stateLocal.filter
            },
        },
        selectedFacets: {
            set(value) {
                this.stateLocal = { selectedFacets: value }
            },
            get() {
                return this.stateLocal.selectedFacets
            },
        },
    },
    mounted() {},
    methods: {
        applyFilter() {
            this.filterLocal = this.filterValue
        },
        isSelectedFacet(facet, value) {
            if (this.selectedFacets.hasOwnProperty(facet)) {
                return this.selectedFacets[facet].indexOf(value) >= 0
            } else {
                return false
            }
        },
        selectFacet(facet, value) {
            let f = cloneDeep(this.selectedFacets)

            if (!f.hasOwnProperty(facet)) {
                f[facet] = []
            }

            f[facet].push(value)

            this.selectedFacets = f
        },
        deselectFacet(facet, value) {
            let f = cloneDeep(this.selectedFacets)
            let f1 = f[facet]

            if (f1) {
                f[facet] = f1.filter(el => {
                    return el !== value
                })

                this.selectedFacets = f
            }
        },
        emitChange() {},
    },
}
</script>
