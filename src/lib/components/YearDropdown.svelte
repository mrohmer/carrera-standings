<script lang="ts">
	import { onMount } from 'svelte';

	export let year: number;
	export let years: number[];

	let open = false;
	let buttonHeight = 70;
	let buttonEl: HTMLButtonElement;
	let dropdownEl: HTMLDivElement;

	const currentYear = new Date().getFullYear();

	const onWindowClick = (event) => {
		const inside = buttonEl.contains(event.target) || dropdownEl.contains(event.target);

		if (!inside) {
			open = false;
		}
	};

	onMount(() => {
		window.addEventListener('click', onWindowClick);

		return () => {
			window.removeEventListener('click', onWindowClick);
		};
	});
</script>

<div>
	<button
		class="text-white w-24 hover:bg-neutral-200 focus:ring-4 focus:outline-none focus:ring-transparent font-medium text-sm px-3 py-3 text-center inline-flex items-center justify-center dark:hover:bg-neutral-700 dark:focus:ring-transparent"
		class:bg-neutral-200={open}
		class:dark:bg-neutral-700={open}
		type="button"
		id="yearSelectButton"
		bind:this={buttonEl}
		bind:clientHeight={buttonHeight}
		on:click={() => (open = !open)}
	>
		{year}
		<svg
			class="w-4 h-4 ml-2"
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>
	<!-- Dropdown menu -->
	<div
		class="z-10 w-24 border-t border-t-neutral-400 bg-white divide-y divide-neutral-100 rounded-br rounded-bl shadow dark:border-t-neutral-500 dark:bg-neutral-700 dark:divide-neutral-600 absolute left-0"
		class:hidden={!open}
		style:top={`${buttonHeight}px`}
		bind:this={dropdownEl}
	>
		<ul
			class="pt-4 pb-1 text-sm text-neutral-700 dark:text-neutral-200"
			aria-labelledby="yearSelectButton"
		>
			<li>
				{#each years.filter((y) => y !== year) as y}
					<a
						href="/{y !== currentYear ? y : ''}"
						class="px-4 mb-3 flex items-center justify-center text-sm font-medium text-red-600 hover:underline hover:text-red-600 dark:text-red-500 dark:hover:text-red-700"
						on:click={() => (open = false)}
					>
						{y}
						<svg
							class="w-4 h-4 ml-1"
							aria-hidden="true"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				{/each}
			</li>
		</ul>
	</div>
</div>
