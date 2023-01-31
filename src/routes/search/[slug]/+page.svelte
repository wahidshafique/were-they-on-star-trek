<script lang="ts">
	import Logo from '$lib/logo.svelte';
	import SingleActorPane from '$lib/singleActorPane.svelte';
	import { currentSearchResult } from '$lib/stores';
	import type { FoundPersonOnStarTrek } from '$lib/types';

	export let data: import('$lib/types').FilteredSearchResult & FoundPersonOnStarTrek;

	let searchResult = { ...$currentSearchResult, ...data };

	// console.log(resultHeadline, searchResult, searchResult.type);
</script>

<div class="isolate">
	<nav class="flex h-9 items-center justify-center pt-10" aria-label="Global">
		<div class="flex lg:min-w-0 lg:flex-1" aria-label="Global">
			<Logo />
		</div>
	</nav>
	{#if searchResult.type === 'person'}
		<SingleActorPane {searchResult} />
	{/if}
</div>
