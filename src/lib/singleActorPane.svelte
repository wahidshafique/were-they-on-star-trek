<script lang="ts">
	// for when you are presented with results from a single actor search
	import SingleActorCard from './singleActorCard.svelte';
	import type { FilteredSearchResult, FoundPersonOnStarTrek } from './types';
	import Modal from './modal.svelte';
	// this component shows you the results; the actors roles in star trek listed out
	export let searchResult: FilteredSearchResult & FoundPersonOnStarTrek;
	const resultHeadline = `${searchResult.name} was ${
		searchResult?.totalityOfRoles ? '' : 'not'
	} on Star Trek!`;
	let showActorDetailsModal = false;
</script>

<div
	class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 isolate flex-col text-center"
>
	<h2 class="text-center text-3xl font-bold">
		{resultHeadline}
	</h2>

	<!-- TODO: small design flaw here
		in an effort to cut down a redundant request, the results displayed on this page are carried over from multisearch _if_
		we are client side navigating. If you refresh this page once you hit it, it makes a new request (not multisearch but instead for a person), and therefore it gets the bio info
		Need to make this consistent later on
	 -->
	{#if searchResult.biography}
		<button
			on:click={() => {
				showActorDetailsModal = true;
			}}
			class="bg-transparent text-white hover:bg-gray-100 hover:text-gray-800 font-semibold  py-1 px-2 my-2 border border-gray-400 rounded shadow"
			>Show Details</button
		>
		{#if showActorDetailsModal}
			<Modal
				on:close={() => {
					showActorDetailsModal = false;
				}}
			>
				<h2 slot="header" class="my-1 ml-1">
					<small><em>{searchResult.name}</em></small>
				</h2>

				<div class="border-2 p-2 mb-2 max-w-lg">
					<p class="mb-3">
						{searchResult.biography}
					</p>
				</div>
			</Modal>
		{/if}
	{/if}

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
