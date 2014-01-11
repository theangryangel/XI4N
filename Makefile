BUILD_NAME=$(shell grep -m 1 name package.json | cut -d \" -f 4)
BUILD_VERSION=$(shell grep version package.json | cut -d \" -f 4)
BUILD_DIR=./build
OUTPUT_DIR=$(BUILD_DIR)/output
GH_PAGES_SOURCES=docs package.json

build: clean docs
	mkdir -p $(OUTPUT_DIR)
	rsync --filter=':- .gitignore' --filter=':- .npmignore' --exclude=scripts/ --exclude=docs/ --exclude=.git/ -r . $(OUTPUT_DIR)
	mkdir -p $(OUTPUT_DIR)/docs
	cp -R docs/_build/html $(OUTPUT_DIR)/docs
	cd $(OUTPUT_DIR) && npm pack && mv *.tgz ..

publish: build
	npm publish $(BUILD_DIR)/$(BUILD_NAME)-$(BUILD_VERSION).tgz

clean:
	make -C docs clean
	rm -rf $(BUILD_DIR)

docs:
	make -C docs html

gh-pages:
	git checkout gh-pages
	rm -rf build _sources _static _modules
	git checkout master $(GH_PAGES_SOURCES)
	git reset HEAD
	make -C docs html
	cp -rf docs/_build/html/* ./
	rm -rf $(GH_PAGES_SOURCES)
	git add -A
	git commit -m "Generated gh-pages for `git log master -1 --pretty=short \
		--abbrev-commit`" && git push origin gh-pages ; git checkout master

.PHONY: build publish clean docs gh-pages
