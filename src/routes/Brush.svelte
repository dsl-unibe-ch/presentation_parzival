<script>
	import * as d3 from 'd3';

	export let width = 400;
	export let height = 150;
	let marginTop = 20;
	let marginRight = 20;
	let marginBottom = 20;
	let marginLeft = 20;
	export let DATA_MIN = 1;
	export let DATA_MAX = 822;

	/**
	 * @type {SVGGElement}
	 */
	let gx;
	/**
	 * @type {SVGGElement}
	 */
	let gy;
	/**
	 * @type {number[]}
	 */
	let mousePos = [0, 1];

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

	const pointsPerRect = 10;
	const chunks = Math.ceil(DATA_MAX / pointsPerRect);

	// create chunks: each chunk is a number counting the number of true values in the chunk
	const chunkedData = data.map((d) => {
		const chunked = new Array(chunks).fill(0);

		for (let i = 0; i < chunks; i++) {
			const start = i * pointsPerRect;
			const end = Math.min((i + 1) * pointsPerRect, DATA_MAX);

			for (let j = start; j < end; j++) {
				if (d.values[j]) {
					chunked[i]++;
				}
			}
		}

		return {
			label: d.label,
			values: chunked
		};
	});

	const handleMouseMove = (/** @type {{ clientX: any; clientY: any; }} */ event) => {
		mousePos = d3.pointer(event);
	};

	$: y = d3
		.scaleBand(
			data.map((d) => d.label),
			[height - marginTop, marginBottom]
		)
		.round(true)
		.paddingOuter(0.1)
		.paddingInner(0.2);
	$: x = d3.scaleLinear([DATA_MIN, DATA_MAX], [marginRight, width - marginLeft]);
	$: d3.select(gy).call(d3.axisLeft(y));
	$: d3.select(gx).call(d3.axisBottom(x));

	$: verse = Math.round(x.invert(mousePos[1]));
</script>

<svg {width} {height}>
	<g bind:this={gy} transform="translate({marginLeft},0)" />
	<g bind:this={gx} transform="translate(0,{height - marginBottom})" />
</svg>
