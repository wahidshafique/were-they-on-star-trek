<script lang="ts">
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import stLogo from '$lib/assets/st-logo.png';
	import commBadgeSound from '$lib/assets/comm-badge.mp3';
	let commBadgeChirp: HTMLAudioElement | undefined = $state();

	interface Props {
		numberOfTimesBadgeClicked?: number;
	}

	let { numberOfTimesBadgeClicked = 0 }: Props = $props();

	// svelte-ignore state_referenced_locally
	let liveClickedNum = $state(numberOfTimesBadgeClicked);

	let hasClicked = $state(false);

	let isAtHomeScreen = $state(false);
	if (browser) {
		isAtHomeScreen = window.location.pathname == '/';
	}
</script>

<div>
	<audio src={commBadgeSound} bind:this={commBadgeChirp}></audio>
	{#if isAtHomeScreen}
		<button
			type="submit"
			onclick={() => {
				hasClicked = true;
				commBadgeChirp?.play();
				if (isAtHomeScreen) {
					// ie user is just noodling around, therefore record the hit
					liveClickedNum += 1;
				} else {
					setTimeout(() => {
						window.location.reload();
					}, 500);
				}
			}}
		>
			<span class="sr-only">Home</span>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<img
				width="31px"
				height="48px"
				class="mx-auto h-12 w-auto invert"
				src={stLogo}
				alt="Star Trek Logo"
			/>
		</button>
	{:else}
		<a href="/">
			<span class="sr-only">Home</span>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<img
				width="31px"
				height="48px"
				class="mx-auto h-12 w-auto invert"
				src={stLogo}
				alt="Star Trek Logo"
			/>
		</a>
	{/if}

	{#if hasClicked && isAtHomeScreen}
		<p in:fly={{ y: 200 }}>
			🖖🏽 badge clicked {liveClickedNum ?? 0} times this so far by everyone..
		</p>
	{/if}
</div>
