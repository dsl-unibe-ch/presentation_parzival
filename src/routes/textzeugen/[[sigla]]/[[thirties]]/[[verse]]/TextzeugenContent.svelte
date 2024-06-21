<script context="module">
	import { writable } from 'svelte/store';
	let targetVerse = writable('');

	export function setTarget(/** @type {string} */ verse) {
		targetVerse = writable(verse);
	}
</script>

<script>
	import { createEventDispatcher } from 'svelte';
	import { local } from 'd3';
	export let content;

	let localVerse = $targetVerse;

	const dispatch = createEventDispatcher();

	$: columns = content.split('<br class="tei-cb">');

	let programmaticScroll = false;

	const onScrollEnd = (/** @type { Event & { target: HTMLElement}} } */ e) => {
		if (programmaticScroll) {
			programmaticScroll = false;
		} else {
			console.log('onScrollEnd');
			const positive = (/** @type {string} */ verse) => {
				localVerse = verse;
				$targetVerse = verse;
				dispatch('localVerseChange', verse);
			};
			const /** @type { NodeListOf<HTMLElement> } */ verses = e.target?.querySelectorAll('.verse');
			let found = false;
			for (let i = 0; i < verses.length; i++) {
				const verse = verses[i];
				if (
					verse.getBoundingClientRect().top === e.target.getBoundingClientRect().top &&
					verse.dataset.verse
				) {
					positive(verse.dataset.verse);
					found = true;
					break;
				}
			}
			if (!found) {
				for (let i = 0; i < verses.length; i++) {
					const verse = verses[i];
					if (
						verse.getBoundingClientRect().top >= e.target.getBoundingClientRect().top &&
						verse.dataset.verse
					) {
						positive(verse.dataset.verse);
						break;
					}
				}
			}
		}
	};

	const scrollToVerse = (/** @type {HTMLDivElement} */ node, /** @type {String} */ targetVerse) => {
		const scroll = (/** @type {String} */ target) => {
			const verse = node.querySelector(`[data-verse="${target}"]`);
			if (!verse) return;
			const scrollContainer = verse.parentElement?.parentElement?.parentElement;
			programmaticScroll = true;
			// verse.scrollIntoView({ behavior: 'smooth', block: 'start' });
			scrollContainer?.scrollTo({
				top:
					scrollContainer?.scrollTop +
					verse.parentElement?.getBoundingClientRect().top -
					scrollContainer?.getBoundingClientRect().top,
				behavior: 'smooth'
			});
			dispatch('localVerseChange', target);
			// verse.parentElement?.classList.add('animate-bounce', 'once');
		};
		scroll(targetVerse);

		return {
			/**
			 * @param {String} targetVerse
			 */
			update(targetVerse) {
				if (targetVerse === localVerse) return;
				scroll(targetVerse);
			},
			destroy() {}
		};
	};
</script>

<div
	class="flex flex-row gap-5 max-h-[70vh] overflow-y-auto snap-y"
	on:scrollend={onScrollEnd}
	use:scrollToVerse={$targetVerse}
>
	{#each columns as column}
		<div class="column">{@html column}</div>
	{/each}
</div>

<style>
	.column :global(.line) {
		@apply snap-start;
		display: flex;
		gap: 1em;
		margin: 0.5em 0;
	}

	.column :global(.once) {
		-webkit-animation-iteration-count: 4;
		animation-iteration-count: 4;
	}
</style>
