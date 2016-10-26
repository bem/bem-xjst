'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testutils').defineTest;

defineTest(__dirname, '0-dont-check-this-mods', null, '0-dont-check-this-mods-1');
