'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, '5-api-changed', null, '5-api-changed-1');
