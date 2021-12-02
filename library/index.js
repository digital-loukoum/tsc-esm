import { spawnSync } from "child_process"
import { existsSync, readFileSync } from "fs"
import glob from "fast-glob"
import patchJsImports from "@digitak/grubber/library/utilities/patchJsImports.js"
import path from "path"
import relaxedJson from "relaxed-json"

const { parse } = relaxedJson

const globDirectory = input => glob.sync(input, { onlyDirectories: true })

export function build(aliases) {
	try {
		compile()
		patch(aliases)
	} catch (error) {
		console.error("[tsc-esm] Could not build:", error)
	}
}

export function compile() {
	spawnSync("node_modules/.bin/tsc", { stdio: 'inherit' })
}

export function patch(aliases) {
	const directories = getOutputDirectories()
	patchJsImports(directories, aliases)
}

/**
 * @return the output directories of typescript compiler
 */
function getOutputDirectories() {
	if (existsSync("tsconfig.json")) {
		try {
			const { compilerOptions } = parse(readFileSync("tsconfig.json", "utf8"))
			if (compilerOptions.outDir) return globDirectory(compilerOptions.outDir)
			if (compilerOptions.outFile) return globDirectory(path.join(compilerOptions.outFile, '..'))
		} catch (error) {
			throw new SyntaxError(`Could not parse tsconfig.json file. ${error}`)
		}
	}
	return ["."]
}
