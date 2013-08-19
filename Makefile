BUILD_DIR=./build
OUTPUT_DIR=$(BUILD_DIR)/output
BUILD_VERSION=$(shell grep version package.json | cut -d \" -f 4)

build: clean
	mkdir -p $(OUTPUT_DIR)
	cd docs/src && jekyll build
	rsync --filter=':- .gitignore' --filter=':- .npmignore' --exclude=scripts/ --exclude=docs/ --exclude=.git/ -r . $(OUTPUT_DIR)
	mkdir -p $(OUTPUT_DIR)/docs
	cp -R docs/build/* $(OUTPUT_DIR)/docs
	tar -C $(OUTPUT_DIR) -zcvf $(BUILD_DIR)/$(BUILD_VERSION).tar.gz .

clean:
	rm -rf $(BUILD_DIR)

docs_live: 
	cd docs/src && jekyll serve -w

.PHONY: build clean docs
