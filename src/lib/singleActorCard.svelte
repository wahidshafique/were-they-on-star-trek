<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentSearchResult } from '$lib/stores';
	import searchResultCookie from './helpers/searchResultCookie';
	import type { FilteredSearchResult, FoundPersonOnStarTrek, Role } from './types';
	export let role: Role;
	let revealEpisodeDetails = false;

	const handleSeeEpisodes = () => {
		revealEpisodeDetails = !revealEpisodeDetails;
	};
</script>

<div class="group px-5 text-center">
	<div
		class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-transparent xl:aspect-w-7 xl:aspect-h-8 relative m-auto"
	>
		<img
			referrerpolicy="no-referrer"
			src={'https://static.wikia.nocookie.net/memoryalpha/images/c/cd/Golin_Shel-la.jpg/revision/latest?cb=20090822174010&path-prefix=en'}
			class="h-full w-full object-cover object-center max-w-xs max-h-xs m-auto"
		/>
	</div>
	<h3 class="mt-2 text-md font-bold">{role.media.original_name} - {role.media.character}</h3>
	<button
		on:click={handleSeeEpisodes}
		class="bg-transparent text-white hover:bg-gray-100 hover:text-gray-800 font-semibold  py-1 px-2 my-2 border border-gray-400 rounded shadow"
		><span class="text-xs">{revealEpisodeDetails ? 'Hide' : 'See'} Episodes</span></button
	>
	{#if revealEpisodeDetails}
		<div class="border-2 p-2 my-2 max-w-lg">
			{#each role.media.episodes as episode}
				<p class="underline">{episode.name}</p>
				<p>S{episode.season_number}:E{episode.episode_number} ✺ {episode.air_date}</p>
				<p>{episode.overview}</p>
			{/each}
		</div>
	{/if}
	<!-- <p class="mt-1 mb-3 text-xs font-medium">{searchResult.type}</p> -->
</div>
