BUILD_DIR=./build
OUTPUT_DIR=$(BUILD_DIR)/output
BUILD_VERSION=$(shell grep version package.json | cut -d \" -f 4)

build: clean docs
	mkdir -p $(OUTPUT_DIR)
	rsync --filter=':- .gitignore' --filter=':- .npmignore' --exclude=scripts/ --exclude=docs/ --exclude=.git/ -r . $(OUTPUT_DIR)
	mkdir -p $(OUTPUT_DIR)/docs
	cp -R docs/_build/* $(OUTPUT_DIR)/docs
	tar -C $(OUTPUT_DIR) -zcvf $(BUILD_DIR)/$(BUILD_VERSION).tar.gz .

clean:
	make -C docs clean
	rm -rf $(BUILD_DIR)

docs:
	make -C docs html

.PHONY: build clean docs
