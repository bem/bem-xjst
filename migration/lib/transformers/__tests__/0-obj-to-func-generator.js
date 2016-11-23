'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testutils').defineTest;

defineTest(__dirname, '0-obj-to-func-generator', null, '0-obj-to-func-generator');
