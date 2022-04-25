<script lang="ts" context="module">
  import type {Load, LoadInput} from '@sveltejs/kit';
  import type {Course} from '$lib/models';

    export const prerender = true;

    export const loadCourse = async ({fetch}: LoadInput): Promise<Record<'course', Course>> => {
      const response = await fetch('/api/course');
      const course = await response.json();
      return {course};
    }
    export const loadRacers = async ({fetch}: LoadInput): Promise<Record<'racers', string[]>> => {
      const response = await fetch('/api/racers');
      const racers = await response.json();
      return {racers};
    }
    export const load: Load = async (input) => {
      const results = await Promise.all([loadCourse(input), loadRacers(input)]);
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
  import type {Course, Racers} from '$lib/models';

    import { LayerCake, Svg, Html } from 'layercake';
    import { scaleOrdinal } from 'd3-scale';
    import AxisX from "../lib/components/chart/AxisX.svelte";
    import AxisY from "../lib/components/chart/AxisY.svelte";
    import MultiLine from "../lib/components/chart/MultiLine.svelte";
    import GroupLabels from "../lib/components/chart/GroupLabels.svelte";

    export let course: Course;
    export let racers: Racers;

    const xKey = 'cup';
    const yKey = 'rank';
    const zKey = 'racer';
    const seriesNames = Object.keys(racers);
    const seriesColors = Object.values(racers).map(({color}) => color);

    console.log(seriesColors);

    /* --------------------------------------------
     * Create a "long" format that is a grouped series of data points
     * Layer Cake uses this data structure and the key names
     * set in xKey, yKey and zKey to map your data into each scale.
     */
    const dataLong = seriesNames.map(key => {
      return {
        [zKey]: key,
        values: course
          .map(({date ,order}) => ({
            [xKey]: new Date(date),
            [yKey]: order ? [...order]?.reverse().indexOf(key) : null
          }))
        ,
      };
    });

    /* --------------------------------------------
     * Make a flat array of the `values` of our nested series
     * we can pluck the field set from `yKey` from each item
     * in the array to measure the full extents
     */
    const flatten = data => data.reduce((memo, group) => {
      return memo.concat(group.values);
    }, []);


    // $: data = {
    //   labels: course.map(({cupTitle}) => cupTitle),
    //   datasets: racers
    //     .map((name) => ({
    //       name,
    //       values: course.map(({order}) => order ? [...order]?.reverse().indexOf(name) : null)
    //     })),
    // }
    // const lineOptions = {
    //   hideDots: true,
    // };
</script>

<style>
    /*
        The wrapper div needs to have an explicit width and height in CSS.
        It can also be a flexbox child or CSS grid element.
        The point being it needs dimensions since the <LayerCake> element will
        expand to fill it.
    */
    .chart-container {
        width: 100%;
        height: 600px;
        max-height: calc(100vh - 150px);
    }
</style>

<div class="chart-container">
    <LayerCake
            padding={{ top: 15, right: 10, bottom: 50, left: 25 }}
            x={xKey}
            y={yKey}
            z={zKey}
            yDomain={[0, null]}
            zScale={scaleOrdinal()}
            zDomain={seriesNames}
            zRange={seriesColors}
            flatData={flatten(dataLong)}
            data={dataLong}
    >
        <Svg>
            <AxisX
                    gridlines={false}
                    ticks={course.map(c => new Date(c.date)).sort(({date: a}, {date: b}) => +a - +b)}
                    snapTicks={true}
                    tickMarks={true}
                    formatTick={date => course.find(c => +new Date(c.date) === +date)?.cupTitle}
            />
            <AxisY
                    ticks={4}
                    formatTick={rank => Object.keys(racers).length - rank}
            />
            <MultiLine/>
        </Svg>

        <Html>
        <GroupLabels/>
        </Html>
    </LayerCake>
</div>
