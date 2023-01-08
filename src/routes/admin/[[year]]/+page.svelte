<script lang="ts">
	import { browser } from '$app/environment';
</script>

<svelte:head>
	<link href="/admin/admin.css" rel="stylesheet" />
	{#if browser}
		<script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
	{/if}
</svelte:head>
