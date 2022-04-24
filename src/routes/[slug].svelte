<script lang="ts" context="module">
  import type {Load} from '@sveltejs/kit';
  import type {LoadInput} from '@sveltejs/kit';
  import type {Cup, Racers} from '../lib/models';

  export const prerender = true;

  export const loadCup = async ({fetch, params}: LoadInput): Promise<Record<'cup', Cup>> => {
    const {slug} = params;

    const response = await fetch(`/${slug}.json`);
    const cup = await response.json();
    return {cup};
  }
  export const loadRacers = async ({fetch}: LoadInput): Promise<Record<'racers', Racers>> => {
    const response = await fetch('/api/racers');
    const racers = await response.json();
    return {racers};
  }
  export const load: Load = async (input) => {
    const {params} = input;
    const {slug} = params;

    if (!slug?.trim?.()?.length) {
      return {
        status: 400,
      }
    }
    const results = await Promise.all([loadCup(input), loadRacers(input)]);
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
  import type {Cup, Racers} from '../lib/models';
  import {Tab, TabContent, Tabs} from "svelte-materialify";

  export let cup: Cup & Record<'mayStillWin', Record<string, boolean>>;
  export let racers: Racers;

  const getMainPoints = (racer: string): number | undefined => {
    const mainRace = cup.points.mainRace[racer];

    if (!(mainRace >= 0)) {
      return undefined;
    }

    return mainRace + +(cup.fastestLap === racer);
  }

  $: hasStartOrderForMainRace = cup?.startOrderForMainRace && Object.keys(cup.startOrderForMainRace).length
</script>


<style lang="scss">
  table {
    border-collapse: collapse;
    width: 100%;

    .row {
      &--may-still-win {
        background: #e9f6ff;
      }
    }

    .cell {
      &--penalty {
        color: red;
      }

      &--fastest-lap-set {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }

  .info-not-yet {
    font-size: 25px;
    text-align: center;
    padding: 30px 0;

    color: #444;
  }

  .info-table {
    margin: 10px 0;

    &__item {
      padding: 10px;
      width: 50%;

      &--label {
        text-align: right;
      }
    }
  }

  .layout {
    width: 100%;
    margin: 0 0 10px;

    img {
      width: 100%;
    }
  }
</style>

<Tabs fixedTabs grow>
    <div slot="tabs">
        <Tab>Tabelle</Tab>
        <Tab>Info</Tab>
        {#if hasStartOrderForMainRace}
            <Tab>Startreihenfolge</Tab>
        {/if}
    </div>

    <TabContent>
        <table>
            <thead>
            <tr class="row row--head">
                <th class="cell cell--head cell--position">Rang</th>
                <th class="cell cell--head cell--name">Name</th>
                <th class="cell cell--head cell--total">Gesamt</th>
                <th class="cell cell--head cell--time-trial">Zeit</th>
                <th class="cell cell--head cell--main-race" class:cell--fastest-lap-set={!!cup?.fastestLap}>Haupt</th>
                <th class="cell cell--head">Strafe</th>
            </tr>
            </thead>

            {#if cup?.order?.length}
                <tbody>
                {#each cup.order as racer, index}
                    <tr class="row" class:row--may-still-win={cup.mayStillWin[racer]}>
                        <th class="cell cell--position">{index + 1}</th>
                        <td class="cell cell--name">
                            <div class="cell__line">
                                {racer}
                            </div>
                            <div class="cell__subline">
                                {racers[racer].manufacturer}
                            </div>
                        </td>
                        <td class="cell cell--total">{cup.points.total[racer] ?? '-'}</td>
                        <td class="cell cell--time-trial">
                            {cup.points.timeTrial[racer] ?? '-'}
                        </td>
                        <td class="cell cell--main-race"
                            class:cell--fastest-lap={racer === cup.fastestLap}
                            class:cell--fastest-lap-set={!!cup.fastestLap}
                        >
                            <div class="cell__line">
                                {getMainPoints(racer) ?? '-'}
                            </div>

                            {#if racer === cup.fastestLap}
                                <div class="cell__subline">
                                    (schnellste)
                                </div>
                            {/if}
                        </td>
                        <td class="cell cell--penalty">{cup.points.penalty[racer] ? -cup.points.penalty[racer] : '-'}</td>
                    </tr>
                {/each}
                </tbody>
            {/if}
        </table>

        {#if !cup?.order?.length}
            <div class="info-not-yet">
                {cup?.title ?? 'Cup' } noch nicht gewertet
            </div>
        {/if}
    </TabContent>
    <TabContent>
        {#if cup?.layout}
            <div class="layout">
                <img src="{cup.layout}" alt="Streckenlayout"/>
            </div>
        {/if}
        {#if ['trackLength', 'pitLaneLength', 'rounds'].some(key => !!cup?.info[key]) || cup?.date }
            <table class="info-table">
                <tbody>
                {#if cup?.date}
                    <tr class="info-table__row">
                        <th class="info-table__item info-table__item--label">Datum</th>
                        <td class="info-table__item info-table__item--value">{cup?.date}</td>
                    </tr>
                {/if}
                {#if cup.info?.trackLength}
                    <tr class="info-table__row">
                        <th class="info-table__item info-table__item--label">Streckenlänge</th>
                        <td class="info-table__item info-table__item--value">{cup.info.trackLength} cm</td>
                    </tr>
                    <tr class="info-table__row">
                        <th class="info-table__item info-table__item--label">Runden</th>
                        <td class="info-table__item info-table__item--value">{Math.ceil(305000 / cup.info.trackLength)}</td>
                    </tr>
                {/if}
                {#if cup.info?.pitLaneLength}
                    <tr class="info-table__row">
                        <th class="info-table__item info-table__item--label">Länge Box</th>
                        <td class="info-table__item info-table__item--value">{cup.info.pitLaneLength} cm</td>
                    </tr>
                {/if}
                </tbody>
            </table>
        {:else}
            <div class="info-not-yet">
                Keine Infos zu {cup?.title ?? 'Cup'} hinterlegt
            </div>
        {/if}
    </TabContent>
    {#if hasStartOrderForMainRace}
        <TabContent>
            <table>
                <thead>
                <tr class="row row--head">
                    <th class="cell cell--head cell--position">Startnummer</th>
                    <th class="cell cell--head cell--name">Fahrer</th>
                    <th class="cell cell--head">Start in Runde</th>
                </tr>
                </thead>
                <tbody>
                {#each Object.entries(cup.startOrderForMainRace).sort(([, a], [, b]) => a < b ? -1 : 1) as [racer, rounds], index}
                    <tr class="row">
                        <th class="cell cell--position">
                            {index + 1}
                        </th>
                        <td class="cell cell--name">
                            <div class="cell__line">
                                {racer}
                            </div>
                            <div class="cell__subline">
                                {racers[racer].manufacturer}
                            </div>
                        </td>
                        <td class="cell">{rounds}</td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </TabContent>
    {/if}
</Tabs>

