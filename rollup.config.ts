import {RollupOptions} from 'rollup'
import {defineDts, GsRollupDefaults as Defaults} from 'gs-rollup'
import vueDtsRedirectPlugin from "./script/vue-dts-redirect";
import fs from "node:fs";

const file = 'tmp/index.d.ts'

const delFile = 'dist/lib/style.mjs'

if(fs.existsSync(delFile)) {
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
			overwriteProps:{
				sideEffects: ["*.css"],
				style: "./lib/gs-player.css"
			},
			after(pkg) {
				delete pkg.main
				for (const e of Object.values(pkg.exports)) {
					delete e.require
				}
				pkg.exports['./lib/gs-player.css'] = './lib/gs-player.css'
			}
		},
		addPlugins: [vueDtsRedirectPlugin()]
	}),
]
