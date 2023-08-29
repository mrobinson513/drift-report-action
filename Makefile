init:
	npm install @actions/artifact @actions/core @actions/glob

build:
	npx tsc
	ncc build dist/index.js --license "licenses.txt"