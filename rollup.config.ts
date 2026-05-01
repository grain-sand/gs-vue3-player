import {defineDts, defineJs, GsRollupDefaults as Defaults, scssCompile, scssMerge} from 'gs-rollup'
import svgPlugin from 'vite-svg-loader'

Defaults.outputBase = 'dist'
Defaults.outputCodeDir = 'lib'

const input = [
	"src/type/index.ts",
	"src/core/index.ts",
	"src/component/index.ts",
	"src/player/index.ts",
	"src/index.ts",
	"src/svgs/index.ts",
	"src/util/index.ts"
]

const addExternal = ['hls.js'];

// logJson(dts)

export default [
	...defineDts({
		input,
		buildPackageJson: {
			deleteProps: /^(devDependencies|scripts)$/,
			overwriteProps: {
				sideEffects: ["*.css"],
				style: "./lib/style.css"
			},
			after(pkg) {
				delete pkg.main;
				['variables.scss', 'component.scss', 'player.scss', 'main.css']
					.forEach(e => pkg.exports[`./lib/${e}`] = `./lib/${e}`);
			}
		},
		addPlugins: [
			scssMerge([
				'src/player/style/player.scss',
				'src/component/style/variables.scss',
				'src/component/style/component.scss',
			])
		],
		vueDts: {
			importPattern: /\.svg$/,
		},
		addExternal
		// vueDts: false,
		// addExternal: /\.(vue|svg)$/
	}),
	...defineJs({
		input,
		addPlugins: [
			svgPlugin() as any,
			scssCompile('src/player/style/main.scss')
		],
		addExternal
	})
];
