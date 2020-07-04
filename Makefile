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

.PHONY: package
package: clean build test
	npm pack

.PHONY: clean
clean:
	rm -rf dist
	rm -rf package
	rm -f *.tgz