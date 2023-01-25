<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentSearchResult } from '$lib/stores';
	import searchResultCookie from './helpers/searchResultCookie';
	import type { FilteredSearchResult } from './types';
	export let result: FilteredSearchResult;

	const handleClick = () => {
		// store the details of our results so we do not need to make another request
		currentSearchResult.set(result);
		/** cookie is just for the server to know that we are in sveltekit client mode and have store data as we navigate forward*/
		searchResultCookie.set(true);
		goto('search/' + result.id + `?${result.type}`);
	};
</script>

<!-- TODO: add this functionality -->
<button
	disabled={result.type === 'movie' || result.type === 'tv'}
	on:click={handleClick}
	class="group px-10"
>
	<div
		class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8 relative"
	>
		<!-- TODO: add this functionality -->
		{#if result.type === 'movie' || result.type === 'tv'}
			<div
				class="w-full h-full before:content-['Movies & TV intersection search coming soon!'] text-slate-900 absolute bg-slate-200 isolate"
			/>
		{/if}
		<img
			src={result.image || 'https://image.tmdb.org/t/p/w200//oI2quZga94mj7dHlZP4YZJLfQ95.jpg'}
			class="h-full w-full object-cover object-center group-hover:opacity-75"
		/>
	</div>
	<h3 class="mt-2 text-sm">{result.name}</h3>
	<p class="mt-1 mb-3 text-xs font-medium">{result.type}</p>
</button>
