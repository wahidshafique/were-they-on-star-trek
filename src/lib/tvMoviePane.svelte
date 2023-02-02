<script lang="ts">
	// for when you are presented with results from a single actor search
	import SearchPreviewCard from './searchPreviewCard.svelte';
	import SingleActorCard from './singleActorCard.svelte';
	import type { IntersectingPeopleOnStarTrek } from './types';

	// this component shows you the results; the actors roles in star trek listed out
	export let searchResult: IntersectingPeopleOnStarTrek;
	const resultHeadline = `${searchResult.original_name} has ${searchResult?.totalityOfMatchingActors?.length} actors that were once on Star Trek`;
	const { totalityOfMatchingActors = [] } = searchResult;
</script>

<div
	class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 isolate flex-col"
>
	<h2 class="text-center text-3xl font-bold">{resultHeadline}</h2>

	{#if totalityOfMatchingActors?.length > 0}
		{#each totalityOfMatchingActors as matchingActorData, i}
			<div class="border-2 mt-8">
				<div class="text-center mt-4">
					<div class="max-w-[300px] m-auto">
						<SearchPreviewCard
							hideMediaType
							result={{
								image: matchingActorData.queriedActorData.profile_path
									? 'https://image.tmdb.org/t/p/w200/' +
									  matchingActorData.queriedActorData.profile_path
									: null,
								name: matchingActorData.queriedActorData.original_name,
								type: 'person',
								id: matchingActorData.queriedActorData.id,
								// TODO: these do not exist here
								// birthday: matchingActorData.queriedActorData.birth_day,
								// deathday: matchingActorData.queriedActorData.death_day,
								// biography: matchingActorData.queriedActorData.biography,
							}}
						/>
						<p>
							Played {matchingActorData.queriedActorData.roles.map(
								(r) => `${r.character} (${r.episode_count} episodes)`,
							)}
						</p>
					</div>
				</div>
				{#if matchingActorData.totalityOfRoles}
					<div class="mx-auto max-w-2xl py-8 px-4 sm:py-16 sm:px-6 lg:max-w-7xl lg:px-8">
						<h2 class="sr-only">Search Results</h2>
						<div class="grid md:grid-cols-3 grid-cols-1 xl:gap-x-8">
							{#each matchingActorData.totalityOfRoles as role, i}
								<SingleActorCard {role} />
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/each}
	{/if}
</div>