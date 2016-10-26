'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, '8-chain-attrs-to-chain-addattrs', null, '8-chain-attrs-to-chain-addattrs-1');
defineTest(__dirname, '8-chain-attrs-to-chain-addattrs', null, '8-chain-attrs-to-chain-addattrs-2');
