'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, '2-no-more-this-underscore', null, '2-no-more-this-underscore-1');
defineTest(__dirname, '2-no-more-this-underscore', null, '2-no-more-this-underscore-2');
