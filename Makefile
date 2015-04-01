BROWSERIFY ?= ./node_modules/.bin/browserify

all: lib/bemhtml/runtime/bundle.js

lib/bemhtml/runtime/bundle.js: lib/bemhtml/runtime/index.js lib/bemhtml/runtime/*.js
	$(BROWSERIFY) --standalone BEMHTML $< -o $@

.PHONY: all
