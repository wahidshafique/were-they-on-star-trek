<script lang="ts">
	import tmdbLogo from '$lib/assets/tmdb-attr.svg';
	import SearchPreviewPane from '$lib/searchPreviewPane.svelte';
	import type { FilteredSearchResults } from '$lib/types';

	import debounce from 'lodash.debounce';
	import Logo from '../lib/logo.svelte';

	let searchQuery: string;
	let searchQueryResults: FilteredSearchResults;

	const handleInput = debounce((e: Event) => {
		const target = e.target as HTMLInputElement;
		if (target.value.length > 1) {
			searchQuery = target.value;
			fetch(`api/multisearch?query=${encodeURI(searchQuery)}`)
				.then((response) => response.json())
				.then((data) => {
					searchQueryResults = data.body;
				})
				.catch((error) => {
					console.log(error);
					return [];
				});
		}
	}, 1000);
</script>

<div
	class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 isolate flex-col"
>
	<div class="w-full max-w-md space-y-3">
		<div>
			<Logo />
			<h2 class="mt-6 text-center text-3xl font-bold">Were They on Star Trek?</h2>
			<p class="mt-6 text-center">
				Search for any TV Show or Actor, and you'll see whether there are any <span
					title="The Star Trek canon includes the original series, seven spin-off television series, three animated series, and thirteen films."
					class="underline decoration-dotted">connections</span
				> to Star Trek.
			</p>
		</div>
		<form action="javascript:void(0);">
			<div class="mt-5">
				<label for="search" class="sr-only">Search for a show or actor</label>
				<input
					id="search"
					name="search"
					type="search"
					required
					on:input={handleInput}
					class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					placeholder="Better Call Saul"
				/>
			</div>
		</form>
		<div class="flex flex-row justify-between">
			<a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
				<img src={tmdbLogo} alt="The Movie Database" srcset="" width="100px" />
			</a>
			<span class="text-xs">{searchQueryResults?.length ?? 0} Result(s)</span>
		</div>
	</div>
	<SearchPreviewPane searchResults={searchQueryResults} />

	<footer
		class="m-2 p-2 rounded-lg shadow md:flex md:items-center md:justify-between bg-sciencesUniform"
	>
		<span class="text-xs sm:text-center text-gray-400"
			>Made with <span role="img" aria-label="vulcan salute">🖖</span> by
			<a
				target="_blank"
				rel="noreferrer"
				href="https://github.com/wahidshafique/were-they-on-star-trek"
				class="hover:underline">wahidshafique</a
			>
		</span>
	</footer>
</div>
