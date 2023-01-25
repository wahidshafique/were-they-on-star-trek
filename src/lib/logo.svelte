<script lang="ts">
	import stLogo from '$lib/assets/st-logo.png';
	import commBadgeSound from '$lib/assets/comm-badge.mp3';
	let commBadgeChirp: HTMLAudioElement;
</script>

<audio src={commBadgeSound} bind:this={commBadgeChirp} />
<a href="/" class="-m-1.5 p-1.5">
	<span class="sr-only">Home</span>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<img
		on:click={() => {
			commBadgeChirp.play();
		}}
		class="dark:invert mx-auto h-12 w-auto"
		src={stLogo}
		alt="Star Trek Logo"
	/>
</a>
