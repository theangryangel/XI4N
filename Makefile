BUILD_DIR=./build
OUTPUT_DIR=$(BUILD_DIR)/output
BUILD_VERSION=$(shell grep version package.json | cut -d \" -f 4)

build: clean
	mkdir -p $(OUTPUT_DIR)
	rsync --filter=':- .gitignore' --filter=':- .npmignore' --exclude=scripts/ --exclude=.git/ -r . $(OUTPUT_DIR)
	tar -C $(OUTPUT_DIR) -zcvf $(BUILD_DIR)/$(BUILD_VERSION).tar.gz .

clean:
	rm -rf $(BUILD_DIR)

.PHONY: build clean
