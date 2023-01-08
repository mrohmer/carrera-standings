<script lang="ts">
	export let title: string;
	export let hint: string;
</script>

<tr>
	<th class="w-1/2 p-2.5 text-right">
		{title}
		{#if hint}
			<div class="font-light text-xs -mt-1">({hint})</div>
		{/if}
	</th>
	<td class="w-1/2 p-2.5">
		<slot />
	</td>
</tr>
