<script>
	import '../app.css';
	import bgImage from '$lib/assets/casey-horner-RmoWqDCqN2E-unsplash.jpg';
</script>

<div class="fixed -top-[50%] -left-[50%] w-[200%] h-[200%]">
	<img
		class="absolute m-auto inset-0 min-w-[50%] min-h-[50%] brightness-[30%]"
		src={bgImage}
		alt=""
	/>
</div>

<div class="bg-white">
	<slot />
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
		color: white;
	}
	body {
		min-height: 100vh;
	}
</style>
