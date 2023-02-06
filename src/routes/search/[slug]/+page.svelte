<script lang="ts">
	import Logo from '$lib/logo.svelte';
	import SingleActorPane from '$lib/singleActorPane.svelte';
	import TvMoviePane from '$lib/tvMoviePane.svelte';
	import type {
		FoundPersonOnStarTrek,
		FilteredSearchResult,
		IntersectingPeopleOnStarTrek,
	} from '$lib/types';

	export let data: FilteredSearchResult & FoundPersonOnStarTrek & IntersectingPeopleOnStarTrek;
	$: searchResult = { ...data };
</script>

<svelte:head>
	<title>{searchResult.name} | Were they on Star Trek?</title>
</svelte:head>

<nav class="flex h-9 items-center justify-center" aria-label="Global">
	<div class="flex lg:min-w-0 lg:flex-1" aria-label="Global">
		<Logo />
	</div>
</nav>
{#if searchResult.type === 'person'}
	<SingleActorPane {searchResult} />
{:else if searchResult.type === 'tv' || searchResult.type === 'movie'}
	<TvMoviePane {searchResult} />
{/if}
