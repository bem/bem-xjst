'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, '8-attrs-to-addattrs', null, '8-attrs-to-addattrs-1');
defineTest(__dirname, '8-attrs-to-addattrs', null, '8-attrs-to-addattrs-2');
