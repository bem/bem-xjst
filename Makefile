BROWSERIFY ?= ./node_modules/.bin/browserify
JSCS ?= ./node_modules/.bin/jscs
JSHINT ?= ./node_modules/.bin/jshint

all: lib/bemhtml/runtime/bundle.js

lib/bemhtml/runtime/bundle.js: lib/bemhtml/runtime/index.js lib/bemhtml/runtime/*.js
	$(BROWSERIFY) --standalone BEMHTML $< -o $@

SOURCES ?=
SOURCES += $(wildcard lib/*.js)
SOURCES += $(wildcard lib/**/*.js)
SOURCES += $(wildcard lib/**/**/*.js)
SOURCES := $(filter-out lib/bemhtml/runtime/bundle.js, $(SOURCES))

lint:
	$(JSCS) $(SOURCES) test/*.js && $(JSHINT) $(SOURCES)

.PHONY: all lint
