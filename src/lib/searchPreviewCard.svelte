<script lang="ts">
	import { goto } from '$app/navigation';
	import searchResultCookie from './helpers/searchResultCookie';
	import notFoundImage from '$lib/assets/404-tribble.webp';
	import type { FilteredSearchResult } from './types';
	import { loading } from '../routes/store';

	export let result: FilteredSearchResult;

	// remove the extra type detail visually, sometimes this card appears in other contexts where type is not needed
	export let hideMediaType: boolean = false;

	const handleClick = async () => {
		loading.set(true);
		// store the details of our results so we do not need to make another request. Only relevant when you search for people
		/** cookie is just for the server to know that we are in sveltekit client mode and have stored data as we navigate forward*/
		searchResultCookie.set(result);
		await goto('/search/' + result.id + `?${result.type}`);
		loading.set(false);
	};
</script>

<button on:click={handleClick} class="group px-10">
	<div
		class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8 relative"
	>
		{#if result?.hits}
			<span
				title="results"
				class=" text-white text-xs font-medium px-2.5 py-0.5 rounded-lg bg-gray-700 border border-white absolute right-0"
				>{result.hits} views</span
			>
		{/if}
		{#if result?.actor_overlaps}
			<span
				title="results"
				class=" text-white text-xs font-medium px-2.5 py-0.5 rounded-lg bg-gray-700 border border-white absolute right-0"
				>{result.actor_overlaps} overlaps</span
			>
		{/if}
		<img
			alt={`image of ${result.name}`}
			src={result.image || notFoundImage}
			class="h-full w-full object-cover object-center group-hover:opacity-75"
		/>
	</div>
	<h3 class="mt-2 text-sm">{result.name}</h3>
	{#if !hideMediaType}
		<p class="mt-1 mb-3 text-xs font-medium">{result.type}</p>
	{/if}
</button>
