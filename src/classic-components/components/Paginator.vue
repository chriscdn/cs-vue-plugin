<template>
	<table class="width100" border="0">
		<tbody>
			<tr>
				<td class="width20">
					Page Size: <select :value="paginator.pageSize" @change="setPageSize($event.target.value)">
						<option v-for="pageSize in paginator.pageSizes" :key="pageSize" :value="pageSize">{{ pageSize }}</option>
					</select>
				</td>
				<td class="width60 rhpaginator" v-if="paginator.hasOtherPages">
					<ul>
						<li v-if="paginator.hasPrevious" class="rhenabled"><a href="#" @click.prevent="previousPage">&laquo; Previous</a></li>
						<li v-else class="rhdisabled">&laquo; Previous</li>
						<template v-for="page in paginator.pageRange">
							<li v-if="page == '|'">...</li>
							<li v-else-if="page == paginator.pageNumber" class="rhactive">{{ page }}</li>
							<li v-else><a href="#" @click.prevent="setPageNumber(page)">{{ page }}</a></li>
						</template>
						<li v-if="paginator.hasNext" class="rhenabled"><a href="#" @click.prevent="nextPage">Next &raquo;</a></li>
						<li v-else class="rhdisabled">Next &raquo;</li>
					</ul>
				</td>
				<td class="alignRight width20">
					<template v-if="paginator.count == 1">
						1 item
					</template>
					<template v-else>
						{{ paginator.startIndex }}-{{ paginator.endIndex }} of {{ paginator.count }} items
					</template>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
export default {
	props: ['paginator'],
	methods: {
		setPageNumber(pageNumber) {
			this.$emit('pagechange', {
				pageNumber
			})
		},
		setPageSize(pageSize) {
			this.$emit('pagechange', {
				pageSize: parseInt(pageSize)
			})
		},
		previousPage() {
			this.setPageNumber(this.paginator.pageNumber - 1)
		},
		nextPage() {
			this.setPageNumber(this.paginator.pageNumber + 1)
		}
	}
}
</script>