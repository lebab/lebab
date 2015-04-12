MODULE		= xto6
EXPORT 		= Transformer
BUILD_DIR 	= src/scripts
BUNDLE 		= $(BUILD_DIR)/$(MODULE).js

ENTRY		= node_modules/xto6/lib/transformer.js

SRC 		= $(ENTRY)

ifneq ($(wildcard lib),)
	SRC += $(shell find lib -type f -name '*.js')
endif

all: $(BUNDLE)

clean:
	rm -f $(BUNDLE)
	rm -f $(DEMO_BUNDLE)

info:
	@echo "Source:" $(SRC)

$(BUNDLE): $(BUILD_DIR) $(SRC)
	browserify -s $(EXPORT) -o $@ $(ENTRY)