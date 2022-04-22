<script lang="ts" context="module">
  import type {Load} from '@sveltejs/kit';

    export const prerender = true;

    export const load: Load = async ({fetch}) => {
        const response = await fetch('/api/standings');
        const standings = await response.json();
        return {
            props: {
              standings,
            },
        };
    }
</script>

<script lang="ts">
    import type {Standings} from './standings';

    export let standings: Standings;
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
    }
  }
</style>

<table>
    <thead>
    <tr>
        <th class="cell cell--position"></th>
        <th class="cell cell--name">Name</th>
        <th class="cell">Punkte</th>
        <th class="cell">Siege</th>
        <th class="cell">Podien</th>
        <th class="cell">Schnellste<br/>Runden</th>
    </tr>
    </thead>
    <tbody>
    {#each standings as {name, points, fastestLaps, wins, podiums, mayStillWin}, index}
        <tr class:may-still-win={mayStillWin}>
            <th class="cell cell--position">{index + 1}.</th>
            <td class="cell cell--name">{name}</td>
            <td class="cell">{points}</td>
            <td class="cell">{wins}</td>
            <td class="cell">{podiums}</td>
            <td class="cell">{fastestLaps}</td>
        </tr>
    {/each}
    </tbody>
</table>
