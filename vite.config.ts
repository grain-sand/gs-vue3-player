import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import svgPlugin from 'vite-svg-loader'

export default defineConfig({
	build: {
		minify: false,
		sourcemap: false,
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
				assetFileNames: (assetInfo) => {
					if (assetInfo.name?.endsWith('.css')) {
						return 'main.css'   // 固定文件名
					}
					return '[name][extname]'
				}
			},
		} as any,
		outDir: 'dist/lib',
	},
	plugins: [
		svgPlugin(),
		vue(),
	]
})
