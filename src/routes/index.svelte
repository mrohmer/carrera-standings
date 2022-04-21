<script lang="ts" context="module">
  import type {Load} from '@sveltejs/kit';

    export const prerender = true;

    export const load: Load = async ({fetch}) => {
        const response = await fetch('/standings');
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
    td, th {
      padding: 5px 10px;
      text-align: center;
    }
</style>

<table>
    <thead>
    <tr>
        <td></td>
        <td></td>
        {#each standings.cups as cup }
            <th>{cup.title}</th>
        {/each}
        <th>Gesamt</th>
    </tr>
    </thead>
    <tbody>
    {#each Object.values(standings.points) as {name, points}, index}
        <tr>
            <th>{index + 1}.</th>
            <th>{name}</th>
            {#each standings.cups as cup }
                <td>{cup.points.timeTrial[name] ?? '-'} | {cup.points.mainRace[name] ?? '-'}</td>
            {/each}
            <th>{points}</th>
        </tr>
    {/each}
    </tbody>
</table>
