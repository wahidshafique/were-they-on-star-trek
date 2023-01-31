<script lang="ts">
	import Modal from './modal.svelte';
	import notFoundImage from '$lib/assets/404-tribble.jpeg';
	import type { Role } from './types';
	export let role: Role;
	let showDescriptionModal = false;

	console.log('Role', role);
</script>

<div class="group px-5 text-center">
	<div
		class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-transparent xl:aspect-w-7 xl:aspect-h-8 relative m-auto"
	>
		<img
			alt={`image of ${role.media.character}`}
			referrerpolicy="no-referrer"
			src={role?.memAlphaMeta?.image || notFoundImage}
			class="h-full w-full object-cover object-center max-w-xs max-h-xs m-auto"
		/>
	</div>
	<h3 class="mt-2 text-md font-bold">
		{role.media.media_type === 'tv' ? role.media.original_name : role.media.original_title} - {role
			.media.character}
	</h3>
	<button
		on:click={() => {
			showDescriptionModal = true;
		}}
		class="bg-transparent text-white hover:bg-gray-100 hover:text-gray-800 font-semibold  py-1 px-2 my-2 border border-gray-400 rounded shadow"
		>Show Details</button
	>
	{#if showDescriptionModal}
		<Modal on:close={() => (showDescriptionModal = false)}>
			<h2 slot="header" class="my-1">
				<small><em>{role.media.character}</em></small>
			</h2>

			<div class="border-2 p-2 mb-2 max-w-lg">
				{#if role?.memAlphaMeta}
					<p class="mb-3">
						{role.memAlphaMeta?.description}<a
							target="_blank"
							rel="noreferrer"
							class="underline cursor-pointer"
							href={role?.memAlphaMeta?.url}>Read More</a
						>
					</p>
				{/if}
				<h5 class="mb-2 border-dotted border-2">Appearances</h5>
				{#if role.media.media_type === 'movie'}
					<p>{role.media.original_title} ✺ {role.media.release_date}</p>
					<p>{role.media.overview}</p>
				{:else if role.media.media_type === 'tv'}
					{#each role.media.episodes as episode}
						<div class="my-3">
							<p class="font-bold">{episode.name}</p>
							<p>S{episode.season_number}:E{episode.episode_number} ✺ {episode.air_date}</p>
							<p>{episode.overview}</p>
						</div>
					{/each}
				{/if}
			</div>
		</Modal>
	{/if}
</div>
