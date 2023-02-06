<script lang="ts">
	import Modal from './modal.svelte';
	import tutImg1 from '$lib/assets/tutorial/bad-entry.png';
	import tutImg2 from '$lib/assets/tutorial/actor-page.png';
	import tutImg3 from '$lib/assets/tutorial/found-carl.png';
	import tutImg4 from '$lib/assets/tutorial/ep-descrip.png';
	import tutImg5 from '$lib/assets/tutorial/edit-modal.png';

	export let originalTmdbUrl = '';
	let helpModalOpen = false;
</script>

<button
	on:click={() => {
		helpModalOpen = true;
	}}
>
	<p class="text-xs sm:text-center text-gray-400 hover:underline">
		Incorrect or missing data? Click here
	</p>
</button>

{#if helpModalOpen}
	<Modal
		on:close={() => {
			helpModalOpen = false;
		}}
	>
		<h2 slot="header" class="my-1 ml-1">
			<small><em>Incorrect or missing data?</em></small>
		</h2>

		<div class="border-2 p-2 mb-2 max-w-lg text-left">
			<a href={originalTmdbUrl} target="_blank" rel="noreferrer">Direct Link to TMDB entry</a>
			<p class="mb-3">
				Sometimes you might see an entry with missing details/image (with a Tribble in its place).
				Rarely, you might even see entire cast members missing 😖
			</p>
			<p class="mb-3">
				To fix this, you can actually <em>change</em> the underlying data directly! I use
				<a
					target="_blank"
					rel="noreferrer"
					href="https://www.themoviedb.org/bible/general#59f792a29251413e93000002">TMDB</a
				>
				to power this site as well as details/images pulled from
				<a target="_blank" rel="noreferrer" href="https://memory-alpha.fandom.com/wiki/Portal:Main"
					>Memory Alpha</a
				>. We need to make sure that TMDB entries match the names of articles on Memory Alpha. So to
				correct something follow these steps:
			</p>
			<ol class="list-decimal m-auto w-[calc(100%-2rem)] text-left [&>li]:my-4">
				<li>
					<a target="_blank" rel="noreferrer" href="https://www.themoviedb.org/signup"
						>Create a TMDB account</a
					> (if applicable)
				</li>
				<li>
					Find the Actor by searching TMDB, and keep note of the incorrect entry name. Lets use
					Javier Grajeda as an example, he is listed on TMDB as someone named "Carl". It turns out
					both the description and image are the wrong Carl because the site is searching for
					<span
						><a href="https://memory-alpha.fandom.com/wiki/Carl"
							>https://memory-alpha.fandom.com/wiki/Carl</a
						>
					</span>
					which resolves to the Guardian Of Forever 🧐
					<img src={tutImg1} alt="an incorrect entry" />
				</li>
				<li>Search for the actor and you will see their entire filmography</li>
				<img src={tutImg2} alt="actor page" />
				<li>
					CTRL + F and here he is...just Carl
					<img src={tutImg3} alt="carl is found" />
				</li>
				<li>
					Click the grey text for the episode, and then expand it out to reveal the guest star list,
					then hit Edit
					<img src={tutImg4} alt="edit page" />
				</li>
				<li>
					Head to guest stars and edit/add the entry to be the Canonical name (always reference
					Alpha Prime, with the same spelling), which in this case is <a
						href="https://memory-alpha.fandom.com/wiki/Carl_Torres">Carl Torres</a
					>
					<img src={tutImg5} alt="Edit modal" />
				</li>
			</ol>
		</div>
	</Modal>
{/if}
