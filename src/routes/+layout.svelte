<script>
	import '../app.css';
	import bgImage from '$lib/assets/casey-horner-RmoWqDCqN2E-unsplash.webp';
</script>

<div class="fixed -top-[50%] -left-[50%] w-[200%] h-[200%]">
	<img
		class="absolute m-auto inset-0 min-w-[50%] min-h-[50%] brightness-[30%]"
		src={bgImage}
		alt=""
	/>
</div>

<slot />

<style lang="postcss">
	:global(html) {
		background-color: #1a2728;
		color: white;
	}
</style>
