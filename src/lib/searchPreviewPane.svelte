<script lang="ts">
	import idleGif from '$lib/assets/idle.gif';
	import SearchPreviewCard from './searchPreviewCard.svelte';
	import type { FilteredSearchResults } from '$lib/types';
	import popularSearches from '../routes/popularSearches.json';
	import popularOverlaps from '../routes/popularOverlaps.json';
	import { fade } from 'svelte/transition';

	export let searchResults: FilteredSearchResults = [];
	export let isSearching: boolean = false;
	$: hasSearchResults = searchResults.length > 0;

	const tabItems = {
		top: 'Top Searches',
		fame: 'Hall of Fame',
		results: 'Results',
	};

	const tabEntries = Object.entries(tabItems) as Array<[keyof typeof tabItems, string]>;
	let current: keyof typeof tabItems = 'fame';

	$: {
		if (isSearching) {
			current = 'results';
		}
		if (!hasSearchResults) {
			current = 'fame';
		}
	}
</script>

<div class="tabs">
	<div role="tablist" class="flex gap-2">
		{#each tabEntries as [tabKey, tabValue]}
			<button
				role="tab"
				class="text-center mt-3 font-bold border-2 border-b-0 opacity-50"
				class:active={current === tabKey}
				on:click={() => {
					current = tabKey;
				}}
				disabled={!hasSearchResults && tabKey === 'results'}
				aria-selected={current === tabKey}
				aria-controls={tabKey}><p class="px-1 py-2 text-md">{tabValue}</p></button
			>
		{/each}
	</div>

	<div class="border-2">
		<div class="mx-auto max-w-2xl py-8 px-4 sm:py-16 sm:px-6 lg:max-w-7xl lg:px-8">
			<h2 class="sr-only">Results</h2>

			{#if current === 'top'}
				<div transition:fade>
					<div
						role="tabpanel"
						aria-labelledby={current}
						class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					>
						{#each popularSearches as result, i}
							<SearchPreviewCard result={{ ...result, id: result.media_id }} />
						{/each}
					</div>
				</div>
			{/if}
			{#if current === 'fame'}
				<div transition:fade>
					<div
						role="tabpanel"
						aria-labelledby={current}
						class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					>
						{#each popularOverlaps as result, i}
							<SearchPreviewCard result={{ ...result, id: result.media_id }} />
						{/each}
					</div>
				</div>
			{/if}
			{#if current === 'results'}
				<div transition:fade>
					<div
						role="tabpanel"
						aria-labelledby={current}
						class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					>
						{#if isSearching}
							<div>
								<p class="text-3xl mb-3">Scanning...</p>
								<img src={idleGif} alt="Janeway waiting" />
							</div>
						{:else if hasSearchResults}
							{#each searchResults as result, i}
								<SearchPreviewCard {result} />
							{/each}
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.active {
		@apply border-t-4;
		@apply opacity-100;
	}
</style>
