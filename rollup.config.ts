import {RollupOptions} from 'rollup'
import {defineDts, GsRollupDefaults as Defaults} from 'gs-rollup'
import * as fs from "node:fs";

const file = 'tmp/index.d.ts'

if(fs.existsSync(file)) {
	const dts = fs.readFileSync(file, 'utf-8')
	const result = dts.replace(/(\.\/core\/Player.vue)(['"])/,'$1.d.ts$2');
	if(result !== dts) {
		fs.writeFileSync(file, result)
	}
}

Defaults.outputBase = 'dist'
Defaults.outputCodeDir = 'lib'

export default <RollupOptions[]>[
	...defineDts({
		input:{
			"index":file
		},
		buildPackageJson: {
			deleteProps: /^(devDependencies|scripts)$/,
			after(pkg) {
				delete pkg.main
				for( const e of Object.values(pkg.exports) ) {
					delete e.require
				}
			}
		}
	}),
]
