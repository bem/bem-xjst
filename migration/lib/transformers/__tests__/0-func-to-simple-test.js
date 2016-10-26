'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testutils').defineTest;

defineTest(__dirname, '0-func-to-simple', null, '0-func-to-simple-1');
defineTest(__dirname, '0-func-to-simple', null, '0-func-to-simple-2');
defineTest(__dirname, '0-func-to-simple', null, '0-func-to-simple-3');
