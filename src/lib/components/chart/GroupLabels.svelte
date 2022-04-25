<!--
	@component
	Generates HTML text labels for a nested data structure. It places the label near the y-value of the highest x-valued data point. This is useful for labeling the final point in a multi-series line chart, for example. It expects your data to be an array of objects where each has `values` field that is an array of data objects. It uses the `z` field accessor to pull the text label.
 -->
<script lang="ts">
  import { getContext } from 'svelte';
  import { max } from 'd3-array';

  const { data, x, y, xScale, yScale, xRange, yRange, z, zGet } = getContext('LayerCake');
  /* --------------------------------------------
	 * Title case the first letter
	 */
  const cap = val => val.replace(/^\w/, d => d.toUpperCase());

  const isDefined = (item: any): boolean => item !== undefined && item !== null
  const lastDefined = <T>(arr: T[]): T|undefined => [...arr]
    .filter(isDefined)
    .reverse()[0];


  /* --------------------------------------------
	 * Put the label on the highest value
	 */
  $: left = values => $xScale(lastDefined(values.map(v => isDefined($y(v)) ? $x(v) : undefined))) / Math.max(...$xRange);
  $: top = values => $yScale(lastDefined(values.map($y))) / Math.max(...$yRange);
</script>

{#each $data as group}
    <div
            class="label"
            style="
      top:{top(group.values) * 100}%;
      left:{left(group.values) * 100}%;
      border-color: {$zGet(group)}
    "
    >{cap($z(group))}</div>
{/each}

<style>
    .label {
        position: absolute;
        transform: translate(-50%, -12px)translateY(1px);
        font-size: 12px;
        padding: 3px 8px;
        border: 1px solid white;
        border-radius: 12px;
        background: #222;
    }
</style>
