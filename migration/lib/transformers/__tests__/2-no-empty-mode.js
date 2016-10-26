'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, '2-no-empty-mode', null, '2-no-empty-mode-1');
defineTest(__dirname, '2-no-empty-mode', null, '2-no-empty-mode-2');
