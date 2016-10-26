'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, '7-xhtml-true', null, '7-xhtml-true-1');
defineTest(__dirname, '7-xhtml-true', null, '7-xhtml-true-2');
defineTest(__dirname, '7-xhtml-true', null, '7-xhtml-true-3');
