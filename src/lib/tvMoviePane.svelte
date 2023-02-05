<script lang="ts">
	// for when you are presented with results from a single actor search
	import SearchPreviewCard from './searchPreviewCard.svelte';
	import SingleActorCard from './singleActorCard.svelte';
	import type { IntersectingPeopleOnStarTrek } from './types';
	import LongListWrapper from './longListWrapper.svelte';
	import Confetti from './confetti.svelte';
	import { onMount } from 'svelte';

	// this component shows you the results; the actors roles in star trek listed out
	export let searchResult: IntersectingPeopleOnStarTrek;
	const resultHeadline = `${searchResult.name} has ${searchResult?.totalityOfMatchingActors?.length} actors that were once on Star Trek`;
	const { totalityOfMatchingActors = [] } = searchResult;
	// ie tried to be clever
	const isLongList = totalityOfMatchingActors?.length > 150;

	// for the confetti easter egg
	let showConfetti = isLongList;
	onMount(() => {
		setTimeout(() => {
			showConfetti = false;
		}, 5000);
	});
</script>

<h2 class="mt-6 text-center text-3xl font-bold">{resultHeadline}</h2>

{#if showConfetti}
	<Confetti />
{/if}
{#if totalityOfMatchingActors?.length > 0}
	<LongListWrapper {isLongList} arrayToIterate={totalityOfMatchingActors} let:matchingActorData>
		<div class="border-2 mt-8 max-w-[1080px]">
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
					{#if matchingActorData.queriedActorData.roles}
						<p>
							Played {matchingActorData.queriedActorData.roles.map(
								(r) => ` ${r.character} (${r.episode_count} episodes)`,
							)}
						</p>
					{:else if matchingActorData.queriedActorData.character}
						<p>Played {matchingActorData.queriedActorData.character}</p>
					{/if}
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
	</LongListWrapper>
{/if}
