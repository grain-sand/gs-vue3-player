import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import svgPlugin from 'vite-svg-loader'

export default defineConfig({
	build: {
		lib: {
			entry: {
				'index': 'src/index.ts',
				'style': 'src/full/style/index.ts',
			} as any,
			formats: ['es'],
		},
		rolldownOptions: {
			external: ['vue', 'hls.js','gs-base'],
			output: {
				entryFileNames: '[name].mjs',
			},
		} as any,
		outDir: 'dist/lib',
	},
	plugins: [
		vue(),
		svgPlugin()
	]
})
