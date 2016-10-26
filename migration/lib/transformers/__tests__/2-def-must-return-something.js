'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, '2-def-must-return-something', null, '2-def-must-return-something-1');
defineTest(__dirname, '2-def-must-return-something', null, '2-def-must-return-something-2');
