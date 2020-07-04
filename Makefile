.PHONY: all
all: package examples

.PHONY: build
build:
	npx tsc

.PHONY: test
test:
	npx jest

.PHONY: examples
examples:
	node docs/example/with.js
	node docs/example/without.js
	node docs/example/with-lodash.js

.PHONY: package
package: clean build test
	cp package.json dist
	cp LICENSE dist
	cp README.md dist
	cd dist && npm pack

.PHONY: clean
clean:
	rm -rf dist