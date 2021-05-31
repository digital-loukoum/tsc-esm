import { exec } from "child_process"
import { existsSync, readFileSync } from "fs"
import glob from "fast-glob"
import patchJsImports from "@digitak/grubber/library/utilities/patchJsImports.js"

const globDirectory = input => glob.sync(input, { onlyDirectories: true })
const stripComments = data => data.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m)

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
	patchJsImports.apply(null, directories)
}

/**
 * @return the output directories of typescript compiler
 */
function getOutputDirectories() {
	if (existsSync("tsconfig.json")) {
		const data = readFileSync("tsconfig.json", "utf8")
		const json = JSON.parse(stripComments(data));
		const { include, compilerOptions } = json

		if (compilerOptions.outDir) return globDirectory(compilerOptions.outDir)
		if (include && include.length) return globDirectory(path)
	}
	return ["."]
}
