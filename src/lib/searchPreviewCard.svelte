<script lang="ts">
	export let image: string;
	export let name: string;
</script>

<a href="#" class="group px-10">
	<div
		class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8"
	>
		<img
			src={image || 'https://image.tmdb.org/t/p/w200//oI2quZga94mj7dHlZP4YZJLfQ95.jpg'}
			class="h-full w-full object-cover object-center group-hover:opacity-75"
		/>
	</div>
	<h3 class="mt-2 text-sm">{name}</h3>
	<p class="mt-1 text-lg font-medium text-gray-900">$48</p>
</a>
