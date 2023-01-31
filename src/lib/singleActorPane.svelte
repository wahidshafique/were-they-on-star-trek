<script lang="ts">
	// for when you are presented with results from a single actor search
	import SingleActorCard from './singleActorCard.svelte';
	import type { FilteredSearchResult, FoundPersonOnStarTrek } from './types';

	// this component shows you the results; the actors roles in star trek listed out
	export let searchResult: FilteredSearchResult & FoundPersonOnStarTrek;
	const resultHeadline = `${searchResult.name} was ${
		searchResult?.totalityOfRoles ? '' : 'not'
	} on Star Trek!`;
	console.log(searchResult);
</script>

<div
	class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 isolate flex-col"
>
	<h2 class="text-center text-3xl font-bold">
		{resultHeadline}
	</h2>

	{#if searchResult?.totalityOfRoles}
		<div class="border-2 mt-8">
			<div class="mx-auto max-w-2xl py-8 px-4 sm:py-16 sm:px-6 lg:max-w-7xl lg:px-8">
				<h2 class="sr-only">Search Results</h2>

				<div class="grid md:grid-cols-3 grid-cols-1 xl:gap-x-8">
					{#each searchResult?.totalityOfRoles as role, i}
						<SingleActorCard {role} />
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
