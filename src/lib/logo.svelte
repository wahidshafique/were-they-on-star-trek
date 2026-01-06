<script lang="ts">
	import stLogo from '$lib/assets/st-logo.png';
	import commBadgeSound from '$lib/assets/comm-badge.mp3';
	let commBadgeChirp: HTMLAudioElement | undefined = $state();
</script>

<audio src={commBadgeSound} bind:this={commBadgeChirp}></audio>
<a
	href="/"
	onclick={() => {
		commBadgeChirp?.play();
		setTimeout(() => {
			window.location.reload();
		}, 500);
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
</a>
