#!/usr/bin/env node
import { build } from "../library/index.js"
build().catch(error => {
	console.error(error)
	process.exit(1)
})
