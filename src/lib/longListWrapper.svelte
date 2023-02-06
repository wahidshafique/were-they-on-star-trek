<!-- Sometimes clever people try to enter an existing star trek shows on search, this creates an insanely long list, we need to virtualize it to save the planet -->
<script lang="ts">
	import VirtualList from '@sveltejs/svelte-virtual-list';
	export let arrayToIterate: object[] = [];
	export let isLongList = false;
</script>

{#if isLongList}
	<VirtualList height="calc(100vh - 180px)" items={arrayToIterate} let:item
		><slot matchingActorData={item} /></VirtualList
	>
{:else}
	{#each arrayToIterate as matchingActorData, i}
		<slot {matchingActorData} />
	{/each}
{/if}
