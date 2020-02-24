// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path")

const rootDir = path.resolve(__dirname)
const sourceDir = path.join(rootDir, "src")

const paths = {
	sourceDir: sourceDir,
	rootDir: rootDir,
}

module.exports.paths = paths

const config = {
	paths,
}

module.exports.config = config
