import { spawn } from "child_process"
import { existsSync, readFileSync } from "fs"
import glob from "fast-glob"
import patchJsImports from "@digitak/grubber/library/utilities/patchJsImports.js"
import path from "path"
import { parse } from "relaxed-json"

const globDirectory = input => glob.sync(input, { onlyDirectories: true })

export async function build(aliases) {
	try {
		await compile()
		await patch(aliases)
	} catch (error) {
		console.error("[tsc-esm] Could not build:", error)
	}
}

export async function compile() {
	return new Promise((resolve, reject) => {
		spawn("node_modules/.bin/tsc", { stdio: 'inherit' }, error => (error ? reject(error) : resolve()))
	})
}

export async function patch(aliases) {
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
