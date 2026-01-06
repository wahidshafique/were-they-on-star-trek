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

	interface Props {
		data: FilteredSearchResult & FoundPersonOnStarTrek & IntersectingPeopleOnStarTrek;
	}

	let { data }: Props = $props();
	let searchResult = $derived({ ...data });
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
		{#snippet subtitle()}
				<div >
				<FoundDataIssueModal originalTmdbUrl={searchResult?.originalTmdbUrl} />
			</div>
			{/snippet}
	</SingleActorPane>
{:else if searchResult.type === 'tv' || searchResult.type === 'movie'}
	<TvMoviePane {searchResult}>
		{#snippet subtitle()}
						<div >
				<FoundDataIssueModal originalTmdbUrl={searchResult?.originalTmdbUrl} />
			</div>
					{/snippet}
	</TvMoviePane>
{/if}
