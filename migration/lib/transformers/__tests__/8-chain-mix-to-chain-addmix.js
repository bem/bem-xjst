'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, '8-chain-mix-to-chain-addmix', null, '8-chain-mix-to-chain-addmix-1');
defineTest(__dirname, '8-chain-mix-to-chain-addmix', null, '8-chain-mix-to-chain-addmix-2');
