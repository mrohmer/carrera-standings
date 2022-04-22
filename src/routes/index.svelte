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
    td, th {
      padding: 5px 10px;
      text-align: center;
    }
</style>

<table>
    <thead>
    <tr>
        <th></th>
        <th>Name</th>
        <th>Punkte</th>
        <th>Siege</th>
        <th>Podien</th>
        <th>Schnellste<br/>Runden</th>
    </tr>
    </thead>
    <tbody>
    {#each standings as {name, points, fastestLaps, wins, podiums}, index}
        <tr>
            <th>{index + 1}.</th>
            <td>{name}</td>
            <td>{points}</td>
            <td>{wins}</td>
            <td>{podiums}</td>
            <td>{fastestLaps}</td>
        </tr>
    {/each}
    </tbody>
</table>
