<!-- Sometimes clever people try to enter an existing star trek shows on search, this creates an insanely long list, we need to virtualize it to save the planet -->
<script lang="ts">
	import VirtualList from '@sveltejs/svelte-virtual-list';
	interface Props {
		arrayToIterate?: object[];
		isLongList?: boolean;
		children?: import('svelte').Snippet<[any]>;
	}

	let { arrayToIterate = [], isLongList = false, children }: Props = $props();

	const children_render = $derived(children);
</script>

{#if isLongList}
	<VirtualList height="calc(100vh - 180px)" items={arrayToIterate} 
		>{#snippet children({ item })}
				{@render children_render?.({ matchingActorData: item, })}			{/snippet}
		</VirtualList
	>
{:else}
	{#each arrayToIterate as matchingActorData, i}
		{@render children?.({ matchingActorData, })}
	{/each}
{/if}
