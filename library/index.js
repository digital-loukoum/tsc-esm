import { exec } from "child_process"
import { existsSync, readFileSync } from "fs"
import fastGlob from "fast-glob"
import patchJsImports from "@digitak/grubber/library/utilities/patchJsImports.js"

const globDirectory = input => glob.sync(input, { onlyDirectories: true })

export async function build() {
	try {
		await compile()
		patch()
	} catch (error) {
		console.error("[tsc-esm] Could not build:", error)
	}
}

export async function compile() {
	return new Promise((resolve, reject) =>
		exec("node_modules/.bin/tsc", error => (error ? reject(error) : resolve()))
	)
}

export function patch() {
	const directories = getOutputDirectories()
	console.log("directories:", directories)
	patchJsImports.apply(null, directories)
}

/**
 * @return the output directories of typescript compiler
 */
function getOutputDirectories() {
	if (existsSync("tsconfig.json")) {
		const { include, compilerOptions } = JSON.parse(readFileSync("tsconfig.json", "utf8"))
		if (compilerOptions.outDir) return globDirectory(compilerOptions.outDir)
		if (include && include.length) return globDirectory(path)
	}
	return ["."]
}
