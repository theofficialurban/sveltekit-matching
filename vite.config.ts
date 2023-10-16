import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [sveltekit(), tsconfigPaths()],

	test: {
		globals: true,
		include: ['src/**/*.{test,spec}.{js,ts}'],
		alias: {
			'@/': new URL('./src/', import.meta.url).pathname
		},
		environment: 'jsdom'
	}
});
