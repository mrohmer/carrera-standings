<script lang="ts" context="module">
  import type {Load, LoadInput} from '@sveltejs/kit';
  import type {Racers, Standings} from '$lib/models';

    export const prerender = true;

    export const loadStandings = async ({fetch}: LoadInput): Promise<Record<'standings', Standings>> => {
      const response = await fetch('/api/standings');
      const standings = await response.json();
      return {standings};
    }
    export const loadRacers = async ({fetch}: LoadInput): Promise<Record<'racers', Racers>> => {
      const response = await fetch('/api/racers');
      const racers = await response.json();
      return {racers};
    }
    export const load: Load = async (input) => {
      const results = await Promise.all([loadStandings(input), loadRacers(input)]);
      const props = results
        .reduce(
          (prev, curr) => ({
            ...prev,
            ...curr,
          }),
          {},
        );
        return {
            props,
        };
    }
</script>

<script lang="ts">
    import type {Standings, Racers} from '$lib/models';
    import MayStillWinLegend from "../lib/components/MayStillWinLegend.svelte";

    export let standings: Standings;
    export let racers: Racers;
</script>

<style lang="scss">
  table {
    border-collapse: collapse;
    width: 100%;
  }
</style>

<table>
    <thead>
    <tr class="row row--head">
        <th class="cell cell--head cell--position">Rang</th>
        <th class="cell cell--head cell--name">Fahrer</th>
        <th class="cell cell--head">Punkte</th>
        <th class="cell cell--head">Siege</th>
        <th class="cell cell--head">Podien</th>
        <th class="cell cell--head">Schnellste</th>
    </tr>
    </thead>
    <tbody>
    {#each standings as {name, points, fastestLaps, wins, podiums, mayStillWin}, index}
        <tr class="row">
            <th class="cell cell--position">{index + 1}{@html mayStillWin ? '&asterisk' : '&nbsp;'}</th>
            <td class="cell cell--name">
                <div class="cell__line">
                    {name}
                </div>
                <div class="cell__subline">
                    {racers[name].manufacturer}
                </div>
            </td>
            <td class="cell">{points}</td>
            <td class="cell">{wins}</td>
            <td class="cell">{podiums}</td>
            <td class="cell">{fastestLaps}</td>
        </tr>
    {/each}
    </tbody>

</table>

<MayStillWinLegend />
