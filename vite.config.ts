import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	build: {
		lib: {
			entry:'src/index.ts' as any,
			formats: ['es'],
		},
		rolldownOptions: {
			external: ['vue','hls.js'],
			output: {
				entryFileNames: '[name].mjs',
			}
		} as any,
		outDir: 'dist/lib'
	},
	plugins: [
		vue()
	]
})
