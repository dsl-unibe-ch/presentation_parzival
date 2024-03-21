<script>
	import Brush from './Brush.svelte';
	import Detail from './Detail.svelte';

	const DATA_MIN = 1;
	const DATA_MAX = 827;

	export let width = 400;
	export let height = 400;

	/**
	 * @type {{values: [number,number][], label: string}[]}
	 */
	let data = [
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

	data = data.map((d) => {
		const values = new Array(28).fill(false);

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

<Brush {width} {data} />
<Detail {width} {height} {data} data_start={1} data_end={28} />
