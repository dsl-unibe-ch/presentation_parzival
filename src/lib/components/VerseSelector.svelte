<script>
	import { goto } from '$app/navigation';

	/**
	 * @type {HTMLInputElement}
	 */
	let thirties;
	/**
	 * @type {HTMLInputElement}
	 */
	let verse;

	let additional = '';

	let valid = false;

	const validateMinMax = (e) => {
		console.log(e);
		console.log(e.target.value);
		console.log(isNaN(e.target.value));
		//validate if input is a Number
		if (isNaN(e.target.value) || e.target.value === '') {
			e.target.classList.add('input-error');
		} else {
			//validate if input is within min and max
			if (
				parseInt(e.target.value) < parseInt(e.target.min) ||
				parseInt(e.target.value) > parseInt(e.target.max)
			) {
				console.log(e.target.value);
				console.log(e.target.min);
				console.log(e.target.max);

				e.target.classList.add('input-error');
			} else {
				e.target.classList.remove('input-error');
			}
		}
	};
</script>

<form
	class="flex max-w-full items-baseline gap-1 my-3"
	on:submit={(e) => {
		goto(`/einzelverssynopse/${thirties.value}/${verse.value}-${additional}`);
	}}
>
	<p>Vers:</p>
	<input
		type="number"
		placeholder="Dreißiger"
		class="input inline max-w-28"
		min="1"
		max="827"
		on:input={(e) => validateMinMax(e)}
		bind:this={thirties}
	/>.<input
		type="number"
		placeholder="Vers"
		class="input max-w-20"
		min="1"
		max="30"
		on:input={(e) => validateMinMax(e)}
		bind:this={verse}
	/>-<input type="text" placeholder="Zusatz" class="input max-w-20" bind:value={additional} />
	<button class="btn-icon variant-filled btn-icon-sm flex-shrink-0 flex-grow-0">
		<i class="fa-solid fa-magnifying-glass"></i></button
	>
</form>
