<script>
const options = {
	pageNumber: 1,
	pageSize: 25
}

const get = require('lodash.get')
const debounce = require('lodash.debounce')

export default {
	data() {
		return {
			items: [],
			sortByField: '',
			paginator: {
				pageSize: options.pageSize,
				pageNumber: options.pageNumber
			},
			loading: true,
			facets: [],
			customOptions: {},
			url: '',
			facetState: {
				filter:'',
				selectedFacets: {}
			}
		}
	},
	computed: {
		fetchOptions() {
			return {
				pageSize: this.paginator.pageSize,
				pageNumber: this.paginator.pageNumber,
				sort: this.sortByField,
				filter: this.facetState.filter,
				facets: this.facetState.selectedFacets,
				customOptions: this.requestCustomOptions
			}
		},
		requestCustomOptions() {
			return {}
		}
	},

	methods: {
		fetchItems: debounce(function() {
	
			let url = [this.$cgi, this.url].join('')

			this.loading = true

			return this.$axios.get(url, {
				params: this.fetchOptions
			}).then(response => {
				// this.$data = Object.assign({}, this.$data, response.data)
				this.items = response.data.items
				this.paginator = response.data.paginator
				this.facetState.filter = response.data.filter
				// these are available facets, and say nothing about facet selection state
				this.facets = get(response, 'data.facets', []) 
				this.customOptions = get(response, 'data.customOptions', [])
			}).catch(error => {
				// debugger
				// error.message
				console.log(error.message)
			}).finally(() => {
				this.loading = false
			})
		}, 750),

		pageChange(pageOptions) {
			this.paginator = Object.assign({}, this.paginator, pageOptions)
			this.fetchItems()
		},

		sort(sort) {
			
			this.sortByField = sort.field

			if (this.paginator.hasOtherPages) {
				this.pageChange({
					pageNumber: 1
				})
			} else {
				this.sortOnTheClient(sort)
			}
		},

		sortOnTheClient(sort) {
			let ascending = sort.ascending
			let localsortkeypath = sort.localsortkeypath

			this.items.sort((a, b) => {
				let valA = get(a, localsortkeypath)
				let valB = get(b, localsortkeypath)
				let f = ascending ? 1 : -1

				if (valA == valB) {
					return 0
				} else if (valA == undefined) {
					return -1 * f
				} else if (valB == undefined) {
					return f
				} else if (valA < valB) {
					return -1 * f
				} else {
					return f
				}
			})
		}
	},
	watch: {
		facetState: {
			// could use immediate here rather than in created()?
			deep: true,
			handler() {
				this.fetchItems()
			}
		}
	},
	created() {	
		this.fetchItems()
	}
}
</script>