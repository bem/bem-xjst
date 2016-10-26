'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testutils').defineTest;

defineTest(__dirname, '0-dont-check-this-elemmods', null, '0-dont-check-this-elemmods-1');
