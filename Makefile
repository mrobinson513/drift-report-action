init:
	npm install @actions/artifact @actions/core @actions/glob

build:
	npx tsc src/index.ts
	ncc build ./dist/index.js --license licenses.txt