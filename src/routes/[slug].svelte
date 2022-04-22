<script lang="ts" context="module">
  import type {Load} from '@sveltejs/kit';

  export const prerender = true;

  export const load: Load = async ({fetch, params}) => {
    const {slug} = params;

    if (!slug?.trim?.()?.length) {
      return {
        status: 400,
      }
    }

    const response = await fetch(`/${slug}.json`);

    if (!response?.ok) {
      return {
        status: response.status,
      }
    }
    const cup = await response.json();
    return {
      props: {
        cup,
      },
    };
  }
</script>

<style lang="scss">
  td, th {
    padding: 5px 10px;
    text-align: center;

    &.penalty {
      color: red;
    }
    &.fastest-lap {
      color: #000;
      font-weight: bold;
    }
  }
</style>

<script lang="ts">
    import type {Cup} from '../lib/models/cups';

    export let cup: Cup;

    const getMainPoints = (racer: string): number|undefined => {
        const mainRace = cup.points.mainRace[racer];

        if (!(mainRace >= 0)) {
          return undefined;
        }

        return mainRace + +(cup.fastestLap === racer);
    }
</script>

{#if cup?.order?.length}
<table>
    <thead>
    <tr>
        <th></th>
        <th>Name</th>
        <th>Gesamt</th>
        <th>Zeit</th>
        <th>Haupt</th>
        <th>Strafe</th>
    </tr>
    </thead>
    <tbody>
    {#each cup.order as racer, index}
        <tr>
            <th>{index + 1}.</th>
            <td>{racer}</td>
            <td>{cup.points.total[racer] ?? '-'}</td>
            <td>{cup.points.timeTrial[racer] ?? '-'}</td>
            <td class:fastest-lap={racer === cup.fastestLap}>{getMainPoints(racer) ?? '-'}{racer === cup.fastestLap ? '*' : ''}</td>
            <td class="penalty">{cup.points.penalty[racer] ? -cup.points.penalty[racer] : '-'}</td>
        </tr>
    {/each}
    </tbody>
</table>

{:else }
    {cup?.title ?? 'Cup' } noch nicht gewertet
{/if}
