import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const myCustomTheme: CustomThemeConfig = {
	name: 'parzival',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': 'system-ui',
		'--theme-font-family-heading': 'system-ui',
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '9999px',
		'--theme-rounded-container': '8px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': 'var(--color-secondary-500)',
		'--on-secondary': '0 0 0',
		'--on-tertiary': 'var(--color-secondary-200)',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #990000
		'--color-primary-50': '240 217 217', // #f0d9d9
		'--color-primary-100': '235 204 204', // #ebcccc
		'--color-primary-200': '230 191 191', // #e6bfbf
		'--color-primary-300': '214 153 153', // #d69999
		'--color-primary-400': '184 77 77', // #b84d4d
		'--color-primary-500': '153 0 0', // #990000
		'--color-primary-600': '138 0 0', // #8a0000
		'--color-primary-700': '115 0 0', // #730000
		'--color-primary-800': '92 0 0', // #5c0000
		'--color-primary-900': '75 0 0', // #4b0000
		// secondary | #FFFB8E
		'--color-secondary-50': '255 254 238', // #fffeee
		'--color-secondary-100': '255 254 232', // #fffee8
		'--color-secondary-200': '255 254 227', // #fffee3
		'--color-secondary-300': '255 253 210', // #fffdd2
		'--color-secondary-400': '255 252 176', // #fffcb0
		'--color-secondary-500': '255 251 142', // #FFFB8E
		'--color-secondary-600': '230 226 128', // #e6e280
		'--color-secondary-700': '191 188 107', // #bfbc6b
		'--color-secondary-800': '153 151 85', // #999755
		'--color-secondary-900': '125 123 70', // #7d7b46
		// tertiary | #585876
		'--color-tertiary-50': '230 230 234', // #e6e6ea
		'--color-tertiary-100': '222 222 228', // #dedee4
		'--color-tertiary-200': '213 213 221', // #d5d5dd
		'--color-tertiary-300': '188 188 200', // #bcbcc8
		'--color-tertiary-400': '138 138 159', // #8a8a9f
		'--color-tertiary-500': '88 88 118', // #585876
		'--color-tertiary-600': '79 79 106', // #4f4f6a
		'--color-tertiary-700': '66 66 89', // #424259
		'--color-tertiary-800': '53 53 71', // #353547
		'--color-tertiary-900': '43 43 58', // #2b2b3a
		// success | #84cc16
		'--color-success-50': '237 247 220', // #edf7dc
		'--color-success-100': '230 245 208', // #e6f5d0
		'--color-success-200': '224 242 197', // #e0f2c5
		'--color-success-300': '206 235 162', // #ceeba2
		'--color-success-400': '169 219 92', // #a9db5c
		'--color-success-500': '132 204 22', // #84cc16
		'--color-success-600': '119 184 20', // #77b814
		'--color-success-700': '99 153 17', // #639911
		'--color-success-800': '79 122 13', // #4f7a0d
		'--color-success-900': '65 100 11', // #41640b
		// warning | #EAB308
		'--color-warning-50': '252 244 218', // #fcf4da
		'--color-warning-100': '251 240 206', // #fbf0ce
		'--color-warning-200': '250 236 193', // #faecc1
		'--color-warning-300': '247 225 156', // #f7e19c
		'--color-warning-400': '240 202 82', // #f0ca52
		'--color-warning-500': '234 179 8', // #EAB308
		'--color-warning-600': '211 161 7', // #d3a107
		'--color-warning-700': '176 134 6', // #b08606
		'--color-warning-800': '140 107 5', // #8c6b05
		'--color-warning-900': '115 88 4', // #735804
		// error | #D41976
		'--color-error-50': '249 221 234', // #f9ddea
		'--color-error-100': '246 209 228', // #f6d1e4
		'--color-error-200': '244 198 221', // #f4c6dd
		'--color-error-300': '238 163 200', // #eea3c8
		'--color-error-400': '225 94 159', // #e15e9f
		'--color-error-500': '212 25 118', // #D41976
		'--color-error-600': '191 23 106', // #bf176a
		'--color-error-700': '159 19 89', // #9f1359
		'--color-error-800': '127 15 71', // #7f0f47
		'--color-error-900': '104 12 58', // #680c3a
		// surface | #495a8f
		'--color-surface-50': '228 230 238', // #e4e6ee
		'--color-surface-100': '219 222 233', // #dbdee9
		'--color-surface-200': '210 214 227', // #d2d6e3
		'--color-surface-300': '182 189 210', // #b6bdd2
		'--color-surface-400': '128 140 177', // #808cb1
		'--color-surface-500': '73 90 143', // #495a8f
		'--color-surface-600': '66 81 129', // #425181
		'--color-surface-700': '55 68 107', // #37446b
		'--color-surface-800': '44 54 86', // #2c3656
		'--color-surface-900': '36 44 70' // #242c46
	}
};
