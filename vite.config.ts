import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import svgPlugin from 'vite-svg-loader'

export default defineConfig({
	plugins: [
		svgPlugin(),
		vue(),
	]
})
