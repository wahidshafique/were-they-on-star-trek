<script lang="ts">
	import tmdbLogo from '$lib/assets/tmdb-attr.svg';
	import SearchPreviewPane from '$lib/searchPreviewPane.svelte';
	import type { FilteredSearchResults } from '$lib/types';
	import Modal from '$lib/modal.svelte';

	import debounce from 'lodash.debounce';
	import Logo from '../lib/logo.svelte';
	import { CANON_ANIMATED_TV, CANON_ST_MOVIES, CANON_ST_TV } from '../sharedConstants';

	let searchQuery: string;
	let searchQueryResults: FilteredSearchResults;

	let connectionDetailModalOpen = false;
	let isSearching = false;

	const handleInputTouch = (e: Event) => {
		const target = e.target as HTMLInputElement;
		isSearching = true;
		if (target.value.length === 0) {
			searchQueryResults = [];
		}
	};

	const handleInputSearch = debounce((e: Event) => {
		const target = e.target as HTMLInputElement;
		searchQuery = target.value;
		if (target.value.length > 1) {
			fetch(`api/multisearch?query=${encodeURI(searchQuery)}`)
				.then((response) => response.json())
				.then((data) => {
					searchQueryResults = data.body;
				})
				.catch((error) => {
					console.log(error);
					return [];
				})
				.finally(() => {
					isSearching = false;
				});
		} else {
			isSearching = false;
		}
	}, 1000);
</script>

<svelte:head>
	<title>Were they on Star Trek?</title>
</svelte:head>

<div class="w-full max-w-md space-y-3">
	<Logo />
	{#if !searchQueryResults?.length}
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold">Were they on Star Trek?</h2>
			<p class="mt-6 text-center">
				Search for any TV Show, Movie or Actor, and you'll see whether there are any <span
					on:click={() => {
						connectionDetailModalOpen = true;
					}}
					class="cursor-pointer underline decoration-dotted">connections</span
				> to Star Trek.
			</p>
		</div>
	{/if}

	{#if connectionDetailModalOpen}
		<Modal
			on:close={() => {
				connectionDetailModalOpen = false;
			}}
		>
			<h2 slot="header" class="my-1 ml-1">
				<small><em>What kind of connections?</em></small>
			</h2>

			<div class="border-2 p-2 mb-2 max-w-lg text-left">
				The Star Trek canon includes the original series, seven spin-off television series, three
				animated series, and thirteen films.
				<ul class="list-disc ml-3">
					{#each Object.keys( { ...CANON_ST_TV, ...CANON_ANIMATED_TV, ...CANON_ST_MOVIES }, ) as mediaItem}
						<li>{mediaItem}</li>
					{/each}
				</ul>
			</div>
		</Modal>
	{/if}

	<form action="javascript:void(0);">
		<div class="mt-5">
			<label for="search" class="sr-only">Search for a show, movie or actor</label>
			<input
				id="search"
				name="search"
				type="search"
				required
				on:input={handleInputTouch}
				on:input={handleInputSearch}
				class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
				placeholder="e.g. Better Call Saul"
			/>
		</div>
	</form>
	<div class="flex flex-row justify-between">
		<a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
			<img src={tmdbLogo} alt="The Movie Database" srcset="" width="100px" height="8px" />
		</a>
		{#if searchQuery && searchQuery?.length > 0}
			<span class="text-xs" aria-live="polite"
				>{searchQueryResults?.length
					? `${searchQueryResults.length} Result(s)`
					: `No Results found for ${searchQuery}! 😢`}</span
			>
		{/if}
	</div>
</div>
<SearchPreviewPane {isSearching} searchResults={searchQueryResults} />

<footer class="m-2 p-2 rounded-lg shadow md:flex md:items-center md:justify-between bg-gray-700">
	<span class="text-xs sm:text-center text-gray-400"
		>Made with <span role="img" aria-label="vulcan salute">🖖</span> by
		<a
			target="_blank"
			rel="noreferrer"
			href="https://github.com/wahidshafique/were-they-on-star-trek"
			class="underline">wahidshafique</a
		>
	</span>
</footer>
