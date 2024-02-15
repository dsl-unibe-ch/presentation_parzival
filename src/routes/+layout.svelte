<script>
	import '../app.postcss';
	import '@fortawesome/fontawesome-free/css/solid.min.css';
	import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
	import {
		AppShell,
		AppBar,
		getDrawerStore,
		Drawer,
		initializeStores
	} from '@skeletonlabs/skeleton';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	// Scroll to top on page change (is needed because of skeleton app shell)
	afterNavigate((/** @type import('@sveltejs/kit').AfterNavigate */ params) => {
		const isNewPage = params.from?.url.pathname !== params.to?.url.pathname;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
	});

	initializeStores();
	const drawerStore = getDrawerStore();

	$: classesActive = (/** @type {string} */ href) =>
		base + href === $page.url.pathname
			? 'bg-primary-500 hover:text-primary-400 text-secondary-500'
			: 'hover:text-primary-500';

	function drawerOpen() {
		const /** @type {import('@skeletonlabs/skeleton').DrawerSettings} */ s = {
				id: 'topnav',
				position: 'top'
			};
		drawerStore.open(s);
	}

	// Programatically generate routes and menu items
	const routes = import.meta.glob('./*/+page.svelte');
	const menuItems = Object.keys(routes).map((item) =>
		item.replace('./', '').replace('/+page.svelte', '')
	);
	const pages = menuItems.map((item) => {
		return {
			slug: item[0].toUpperCase() + item.slice(1).replaceAll('-', ' '), // Capitalize first letter and replace dashes with spaces
			path: `/${item}`
		};
	});
</script>

<Drawer height="h-auto">
	<nav class="list-nav">
		<ul>
			{#each pages as page}
				<li>
					<a href={`${base}${page.path}`}>
						<span class="flex-auto">{page.slug}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</Drawer>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Parzival</strong>
			</svelte:fragment>
			<nav class="flex-none items-center h-full hidden lg:flex">
				{#each pages as page}
					<a
						href={`${base}${page.path}`}
						class="list-nav-item h-full p-4 {classesActive(page.path)}">{page.slug}</a
					>
				{/each}
			</nav>
			<svelte:fragment slot="trail">
				<button class="lg:!hidden btn-icon" on:click={drawerOpen}>
					<i class="fa-solid fa-bars"></i>
				</button>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
