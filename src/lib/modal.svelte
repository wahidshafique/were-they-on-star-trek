<script>
	import { createEventDispatcher, onDestroy, onMount, afterUpdate } from 'svelte';

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');
	let modal;

	// to get entire page to scroll top
	window.scrollTo(0, 0);

	onMount(() => {
		// to get inner modal scroll top (if applicable)
		window.scrollTo(0, 0);
	});

	const onScrollEvent = () => {
		if (modal) {
			const modalRect = modal.getBoundingClientRect();
			console.log(modalRect.y + modalRect.height);
			if (modalRect.y + modalRect.height <= 0) {
				// out of view port
				dispatch('close');
			}
		}
	};

	const handle_keydown = (e) => {
		if (e.key === 'Escape') {
			close();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll('*');
			const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused = typeof document !== 'undefined' && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			previously_focused.focus();
		});
	}
</script>

<svelte:window on:keydown={handle_keydown} on:scroll={onScrollEvent} />

<div class="fixed top-0 left-0 w-full h-full z-50 bg-black" on:click={close} />

<div
	class="absolute overflow-auto bg-sciencesUniform w-screen max-w-md isolate z-50 inset-x-1/2 -translate-x-2/4 top-[40px]"
	role="dialog"
	aria-modal="true"
	bind:this={modal}
>
	<slot name="header" />
	<slot />

	<!-- svelte-ignore a11y-autofocus -->
	<button
		class="mb-2 bg-transparent text-white hover:bg-gray-100 hover:text-gray-800 font-semibold  py-1 px-2 border border-gray-400 rounded shadow"
		autofocus
		on:click={close}>close modal</button
	>
</div>
