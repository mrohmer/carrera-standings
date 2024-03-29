<script lang="ts">
	import { page } from '$app/stores';
	import type { Cup } from '../models';
	import Icon from './Icon.svelte';
	import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight.js';
	import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft.js';
	import { fade } from 'svelte/transition';

	const OVERFLOW_THRESHOLD = 15;

	export let cups: Cup[] = [];
	export let urlPrefix: string;

	let navEl: HTMLElement;
	let leftButtonEl: HTMLButtonElement;
	let rightButtonEl: HTMLButtonElement;
	let outerWidth = 0;
	let scrollPosition = 0;

	const btnFadeOptions = {
		duration: 200
	};

	let activeClicked: HTMLAnchorElement;

	const onScrollBtnClick = (dir: number) => {
		if (!navEl) {
			return;
		}

		navEl.scrollTo({
			left: scrollPosition + (outerWidth / 2) * dir
		});
	};
	const onPageUrlChange = (active: HTMLAnchorElement) => {
		const element = active ?? navEl?.querySelector('.active');
		if (!element) {
			return;
		}
		const leftButtonWidth = leftButtonEl?.offsetWidth ?? 40;
		const rightButtonWidth = rightButtonEl?.offsetWidth ?? 40;

		const left = element.offsetLeft - scrollPosition;
		const right = left + element.offsetWidth;

		const leftOverflow = left < leftButtonWidth;
		const rightOverflow = right > outerWidth - rightButtonWidth;

		if (leftOverflow) {
			navEl.scrollTo({
				left: left + scrollPosition - leftButtonWidth
			});
		} else if (rightOverflow) {
			navEl.scrollTo({
				left: right - outerWidth + scrollPosition + rightButtonWidth
			});
		}
	};
	const resetActiveClicked = () => (activeClicked = undefined);

	$: innerWidth = navEl && outerWidth ? navEl.scrollWidth : 0;
	$: overflowsLeft = scrollPosition > OVERFLOW_THRESHOLD;
	$: overflowsRight = innerWidth - outerWidth - scrollPosition > OVERFLOW_THRESHOLD;
	$: setTimeout(() => $page.url.pathname && onPageUrlChange(activeClicked), 1);
	$: setTimeout(() => $page.url.pathname && resetActiveClicked(), 1);
</script>

<div class="nav">
	{#if overflowsLeft}
		<button
			bind:this={leftButtonEl}
			class="btn btn--left"
			on:click={() => onScrollBtnClick(-1)}
			transition:fade={btnFadeOptions}
		>
			<Icon icon={faAngleLeft} />
		</button>
	{/if}

	<nav
		bind:this={navEl}
		bind:offsetWidth={outerWidth}
		on:scroll={() => (scrollPosition = navEl?.scrollLeft)}
	>
		<a
			href={`${urlPrefix ?? ''}/`}
			class="hover:bg-neutral-200 dark:hover:bg-neutral-700"
			class:active={$page.url.pathname.startsWith(`${urlPrefix ?? ''}/total`)}
			on:click={({ target }) => (activeClicked = target)}
			sveltekit:prefetch
		>
			Gesamt
		</a>
		<a
			href={`${urlPrefix ?? ''}/course`}
			class="hover:bg-neutral-200 dark:hover:bg-neutral-700"
			class:active={$page.url.pathname.startsWith(`${urlPrefix ?? ''}/course`)}
			on:click={({ target }) => (activeClicked = target)}
			sveltekit:prefetch
		>
			Verlauf
		</a>
		{#each cups as { title, slug }}
			<a
				href={`${urlPrefix ?? ''}/cups/${slug}`}
				class="hover:bg-neutral-200 dark:hover:bg-neutral-700"
				class:active={decodeURIComponent($page.url.pathname).startsWith(
					`${urlPrefix ?? ''}/cups/${slug}`
				)}
				on:click={({ target }) => (activeClicked = target)}
				sveltekit:prefetch
			>
				{title}
			</a>
		{/each}
	</nav>

	{#if overflowsRight}
		<button
			bind:this={rightButtonEl}
			class="btn btn--right"
			on:click={() => onScrollBtnClick(1)}
			transition:fade={btnFadeOptions}
		>
			<Icon icon={faAngleRight} />
		</button>
	{/if}
</div>

<style lang="scss">
	.nav {
		width: 100%;
		nav {
			display: flex;
			width: 100%;
			overflow: auto;
			scrollbar-width: none;
			scroll-behavior: smooth;

			&::-webkit-scrollbar {
				display: none;
			}

			a {
				color: #aaa;
				width: fit-content;
				white-space: nowrap;
				text-decoration: none;
				padding: 10px 15px;

				&.active {
					color: #fff;
					font-weight: bold;
				}
			}
		}

		.btn {
			position: absolute;
			top: 0;
			bottom: 0;
			border: none;
			background: linear-gradient(90deg, rgb(38, 38, 38) 50%, transparent);
			color: white;
			cursor: pointer;
			z-index: 1;

			&--left {
				left: 0;
				background: linear-gradient(90deg, rgb(38, 38, 38) 50%, transparent);
				padding-right: 16px;
				padding-left: 8px;
			}
			&--right {
				right: 0;
				background: linear-gradient(90deg, transparent, rgb(38, 38, 38) 50%);
				padding-left: 16px;
				padding-right: 8px;
			}
		}
	}
</style>
