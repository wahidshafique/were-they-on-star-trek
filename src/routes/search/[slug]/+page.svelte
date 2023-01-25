<script lang="ts">
	import Logo from '$lib/logo.svelte';
	import { currentSearchResult } from '$lib/stores';
	import type { FoundPersonOnStarTrek } from '$lib/types';

	export let data: import('$lib/types').FilteredSearchResult & FoundPersonOnStarTrek;

	let searchResult = { ...$currentSearchResult, ...data };
	let resultHeadline = '';

	if (searchResult.type === 'person') {
		resultHeadline = `${searchResult.name} was ${
			searchResult?.totalityOfRoles ? '' : 'not'
		} on Star Trek!`;
	}
	console.log(resultHeadline, searchResult, searchResult.type);
</script>

<div class="isolate">
	<nav class="flex h-9 items-center justify-between m-2" aria-label="Global">
		<div class="flex lg:min-w-0 lg:flex-1" aria-label="Global">
			<Logo />
		</div>
	</nav>
	<div
		class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 isolate flex-col"
	>
		<h2 class="mt-6 text-center text-3xl font-bold  dark:text-white">
			{resultHeadline}
		</h2>
	</div>
</div>
