<script>
	import { onMount } from 'svelte';
	import { assets } from '$app/paths';

	/** @type {import('./$types').PageData} */
	export let data;

	/**
	 * @type {import('openseadragon') | undefined}
	 */
	let OpenSeadragon;

	/**
	 * @type {import('openseadragon').Viewer}
	 */
	let viewer;

	onMount(async () => {
		OpenSeadragon = (await import('openseadragon')).default;
		viewer = new OpenSeadragon.Viewer({
			id: 'viewer',
			prefixUrl: `${assets}/openseadragon-svg-icons/icons/`,
			navImages: {
				zoomIn: {
					REST: 'zoomin_rest.svg',
					GROUP: 'zoomin_grouphover.svg',
					HOVER: 'zoomin_hover.svg',
					DOWN: 'zoomin_pressed.svg'
				},
				next: {
					REST: 'next_rest.svg',
					GROUP: 'next_grouphover.svg',
					HOVER: 'next_hover.svg',
					DOWN: 'next_pressed.svg'
				},
				previous: {
					REST: 'previous_rest.svg',
					GROUP: 'previous_grouphover.svg',
					HOVER: 'previous_hover.svg',
					DOWN: 'previous_pressed.svg'
				},
				fullpage: {
					REST: 'fullpage_rest.svg',
					GROUP: 'fullpage_grouphover.svg',
					HOVER: 'fullpage_hover.svg',
					DOWN: 'fullpage_pressed.svg'
				},
				home: {
					REST: 'home_rest.svg',
					GROUP: 'home_grouphover.svg',
					HOVER: 'home_hover.svg',
					DOWN: 'home_pressed.svg'
				},
				zoomOut: {
					REST: 'zoomout_rest.svg',
					GROUP: 'zoomout_grouphover.svg',
					HOVER: 'zoomout_hover.svg',
					DOWN: 'zoomout_pressed.svg'
				},
				rotateleft: {
					REST: 'rotateleft_rest.svg',
					GROUP: 'rotateleft_grouphover.svg',
					HOVER: 'rotateleft_hover.svg',
					DOWN: 'rotateleft_pressed.svg'
				},
				rotateright: {
					REST: 'rotateright_rest.svg',
					GROUP: 'rotateright_grouphover.svg',
					HOVER: 'rotateright_hover.svg',
					DOWN: 'rotateright_pressed.svg'
				},
				flip: {
					REST: 'flip_rest.svg',
					GROUP: 'flip_grouphover.svg',
					HOVER: 'flip_hover.svg',
					DOWN: 'flip_pressed.svg'
				}
			},
			sequenceMode: false
		});
	});

	$: {
		if (viewer && data.iiif) {
			fetch(data.iiif)
				.then((res) => res.json())
				.then((json) => {
					viewer.open(json);
				});
		}
	}
</script>

{JSON.stringify(data)}
<section>
	<h1 class="h1">Textzeugen</h1>
	<p>Textzeugenansicht, Einstellungen</p>
</section>
<section>
	<p>transkription</p>
</section>
<section>
	<div id="viewer" class="w-full h-[60vh]"></div>
</section>
