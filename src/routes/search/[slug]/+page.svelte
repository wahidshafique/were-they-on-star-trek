<script lang="ts">
	import FoundDataIssueModal from '$lib/foundDataIssueModal.svelte';
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
	console.log(data);
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
	<SingleActorPane {searchResult}>
		<div slot="subtitle">
			<FoundDataIssueModal originalTmdbUrl={searchResult?.originalTmdbUrl} />
		</div>
	</SingleActorPane>
{:else if searchResult.type === 'tv' || searchResult.type === 'movie'}
	<TvMoviePane {searchResult}>
		<div slot="subtitle">
			<FoundDataIssueModal originalTmdbUrl={searchResult?.originalTmdbUrl} />
		</div>
	</TvMoviePane>
{/if}
