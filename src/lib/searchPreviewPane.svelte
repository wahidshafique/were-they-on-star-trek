<script lang="ts">
	import idleGif from '$lib/assets/idle.gif';
	import SearchPreviewCard from './searchPreviewCard.svelte';
	import type { FilteredSearchResults } from '$lib/types';

	export let searchResults: FilteredSearchResults = [];
</script>

<div class="border-2 mt-5">
	<div class="mx-auto max-w-2xl py-8 px-4 sm:py-16 sm:px-6 lg:max-w-7xl lg:px-8">
		<h2 class="sr-only">Search Results</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#if searchResults.length > 0}
				{#each searchResults as result, i}
					<SearchPreviewCard {result} />
				{/each}
			{:else}
				<img src={idleGif} alt="Janeway waiting" />
			{/if}
		</div>
	</div>
</div>
