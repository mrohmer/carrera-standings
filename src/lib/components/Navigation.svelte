<script lang="ts">
	import { page } from '$app/stores';
	import type { Cup } from '../models';
	import Icon from './Icon.svelte';
	import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight.js';
	import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft.js';
	import { fade } from 'svelte/transition';

	const OVERFLOW_THRESHOLD = 15;

	export let cups: Cup[] = [];

	let navEl: HTMLElement;
	let outerWidth = 0;
	let scrollPosition = 0;

	const btnFadeOptions = {
		duration: 200
	};

	const onScrollBtnClick = (dir: number) => {
		if (!navEl) {
			return;
		}

		navEl.scrollTo({
			left: scrollPosition + (outerWidth / 2) * dir
		});
	};

	$: innerWidth = navEl && outerWidth ? navEl.scrollWidth : 0;
	$: overflowsLeft = scrollPosition > OVERFLOW_THRESHOLD;
	$: overflowsRight = innerWidth - outerWidth - scrollPosition > OVERFLOW_THRESHOLD;
</script>

<div class="nav content">
	{#if overflowsLeft}
		<button
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
		<a href="/" class:active={$page.url.pathname === '/'}> Gesamt </a>
		<a href="/course" class:active={$page.url.pathname === '/course'}> Verlauf </a>
		{#each cups as { title, slug }}
			<a href="/{slug}" class:active={$page.url.pathname === `/${slug}`}>
				{title}
			</a>
		{/each}
	</nav>

	{#if overflowsRight}
		<button
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
				font-size: 18px;

				&:hover {
					background: #333;
				}

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
			background: linear-gradient(90deg, #222 50%, transparent);
			color: white;
			cursor: pointer;
			z-index: 1;
			padding: 14px 8px;

			&--left {
				left: 0;
				background: linear-gradient(90deg, #222 50%, transparent);
				padding-right: 16px;
			}
			&--right {
				right: 0;
				background: linear-gradient(90deg, transparent, #222 50%);
				padding-left: 16px;
			}
		}
	}
</style>
