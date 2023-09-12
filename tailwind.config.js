import { join } from 'path';

import typography from '@tailwindcss/typography';
import { parzival } from './parzival';
import { skeleton } from '@skeletonlabs/tw-plugin';
/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		typography,
		skeleton({
			themes: {
				custom: parzival,
				preset: [
					{
						name: 'skeleton',
						enhancements: true
					},
					{
						name: 'crimson',
						enhancements: true
					}
				]
			}
		})
	]
};
