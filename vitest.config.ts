import {defineConfig} from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import svgPlugin from 'vite-svg-loader';

export default defineConfig({
	test: {
		browser: {
			enabled: true,
			instances: [
				{
					browser: "chrome",
				} as any
			]
		},
		include: ['./test/*.ts'],
	},
	publicDir: 'test/files',
	plugins: [vue(), svgPlugin()]
})

