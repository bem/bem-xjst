'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, '8-mix-to-addmix', null, '8-mix-to-addmix-1');
defineTest(__dirname, '8-mix-to-addmix', null, '8-mix-to-addmix-2');
