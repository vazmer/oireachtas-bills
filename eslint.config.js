import { default as defaultConfig } from '@epic-web/config/eslint'

/** @type {import("eslint").Linter.Config} */
export default [
	...defaultConfig,
	// add custom config objects here:
	{
		// Remove linting from dist, eslintrc.cjs and vite.config.ts

		ignores: ['dist', 'eslint.config.js', 'vite.config.ts', 'vitest.config.ts'],
	},
]
