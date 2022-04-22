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

<script lang="ts">
  import type {Cup} from '../lib/models/cups';

  export let cup: Cup & Record<'mayStillWin', Record<string, boolean>>;

  const getMainPoints = (racer: string): number | undefined => {
    const mainRace = cup.points.mainRace[racer];

    if (!(mainRace >= 0)) {
      return undefined;
    }

    return mainRace + +(cup.fastestLap === racer);
  }
</script>


<style lang="scss">
  table {
    border-collapse: collapse;
    width: 100%;

    tr {
      &.may-still-win {
        background: #e9f6ff;
      }
    }

    .cell {
      border: none;
      padding: 5px 10px;
      text-align: center;

      &--position {
        width: 35px;
        text-align: right;
      }

      &--name {
        text-align: left;
      }

      &--penalty {
        color: red;
      }

      &--fastest-lap {
        color: #000;
        font-weight: bold;
      }
    }
  }
</style>

{#if cup?.order?.length}
    <table>
        <thead>
        <tr>
            <th class="cell--position"></th>
            <th class="cell--name">Name</th>
            <th class="cell">Gesamt</th>
            <th class="cell">Zeit</th>
            <th class="cell">Haupt</th>
            <th class="cell">Strafe</th>
        </tr>
        </thead>
        <tbody>
        {#each cup.order as racer, index}
            <tr class:may-still-win={cup.mayStillWin[racer]}>
                <th class="cell cell--position">{index + 1}.</th>
                <td class="cell cell--name">{racer}</td>
                <td class="cell">{cup.points.total[racer] ?? '-'}</td>
                <td class="cell">{cup.points.timeTrial[racer] ?? '-'}</td>
                <td class="cell"
                    class:cell--fastest-lap={racer === cup.fastestLap}>
                    {getMainPoints(racer) ?? '-'}
                    {#if racer === cup.fastestLap}
                        <br>
                        <span style="font-size: 50%; font-weight: normal; line-height: 1px; display: block; margin-bottom: -1px;">(schnellste)</span>
                    {/if}
                </td>
                <td class="cell cell--penalty">{cup.points.penalty[racer] ? -cup.points.penalty[racer] : '-'}</td>
            </tr>
        {/each}
        </tbody>
    </table>

{:else }
    {cup?.title ?? 'Cup' } noch nicht gewertet
{/if}
