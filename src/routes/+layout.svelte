<script>
	import '../app.css';
	import bgImage from '$lib/assets/casey-horner-RmoWqDCqN2E-unsplash.webp';
</script>

<svelte:head>
	<meta
		name="description"
		content="Ever wonder if your favorite TV Show, Movie, or Actor had anything to do with Star Trek? This tool answers that!"
	/>
	<link rel="author" href="https://github.com/wahidshafique" />
	<link rel="canonical" href="https://weretheyonstartrek.com" /></svelte:head
>

<div class="fixed -top-[50%] -left-[50%] w-[200%] h-[200%]">
	<img
		class="absolute m-auto inset-0 min-w-[50%] min-h-[50%] brightness-[20%]"
		src={bgImage}
		alt=""
	/>
</div>

<div
	class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 isolate flex-col text-center"
>
	<slot />
</div>

<style lang="postcss">
	:global(html) {
		background-color: #1a2728;
		color: white;
	}
</style>
