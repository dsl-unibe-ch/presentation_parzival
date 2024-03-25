<script>
	import { map } from 'd3';
	import Brush from './Brush.svelte';
	import Detail from './Detail.svelte';

	const DATA_MIN = 1;
	const DATA_MAX = 827;

	export let width = 400;
	export let height = 400;

	let selection = { start: 1, end: 100 };

	/**
	 * @type {{values: [number,number][], label: string}[]}
	 */
	export let data = [
		{
			label: 'D',
			values: [
				[1, 3],
				[15, 20]
			]
		},
		{
			label: 'n',
			values: [
				[1, 16],
				[18, 25]
			]
		}
	];

	$: data = data.map((d) => {
		const values = new Array(DATA_MAX).fill(false);

		d.values.forEach(([start, end]) => {
			for (let i = start; i <= end; i++) {
				// Adjust for 0-indexed array
				values[i - 1] = true;
			}
		});

		return {
			label: d.label,
			values
		};
	});
</script>

<Brush {width} {data} on:brush={(e) => (selection = e.detail)} />
<Detail
	{width}
	{height}
	data={data.map((d) => {
		return { label: d.label, values: d.values.slice(selection.start - 1, selection.end + 1) };
	})}
	data_start={selection.start}
/>
