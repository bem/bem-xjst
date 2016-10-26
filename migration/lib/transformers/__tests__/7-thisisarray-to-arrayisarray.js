'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, '7-thisisarray-to-arrayisarray', null, '7-thisisarray-to-arrayisarray-1');
defineTest(__dirname, '7-thisisarray-to-arrayisarray', null, '7-thisisarray-to-arrayisarray-2');
