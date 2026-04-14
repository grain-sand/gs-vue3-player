import {RollupOptions} from 'rollup'
import {defineDts, GsRollupDefaults as Defaults, scssMerge} from 'gs-rollup'
import fs from "node:fs";

const file = 'tmp/index.d.ts'

const delFile = 'dist/lib/style.mjs'

if (fs.existsSync(delFile)) {
	fs.unlinkSync(delFile)
}
// if(fs.existsSync(file)) {
// 	const dts = fs.readFileSync(file, 'utf-8')
// 	const result = dts.replace(/(.vue)(['"])/,'$1.d.ts$2');
// 	if(result !== dts) {
// 		fs.writeFileSync(file, result)
// 	}
// }

Defaults.external = '/^node:|dynamic|\\.scss$'
Defaults.outputBase = 'dist'
Defaults.outputCodeDir = 'lib'

export default <RollupOptions[]>[
	...defineDts({
		external: Defaults.external,
		input: {
			"index": file
		},
		buildPackageJson: {
			deleteProps: /^(devDependencies|scripts)$/,
			overwriteProps: {
				sideEffects: ["*.css"],
				style: "./lib/style.css"
			},
			after(pkg) {
				delete pkg.main
				for (const e of Object.values(pkg.exports)) {
					delete e.require
				}
				pkg.exports['./lib/variables.scss'] = './lib/variables.scss'
				pkg.exports['./lib/style.scss'] = './lib/style.scss'
				pkg.exports['./lib/main.css'] = './lib/main.css'
			}
		},
		addPlugins: [
			scssMerge([
				'src/full/style/style.scss',
				'src/full/style/variables.scss',
			])
		]
	}),
]
