<script>
	import Brush from './Brush.svelte';
	import Detail from './Detail.svelte';

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
</script>

<Brush {width} {data} />
<Detail {width} {height} {data} />
