'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, '5-elemmatch-to-elem-match', null, '5-elemmatch-to-elem-match-1');
defineTest(__dirname, '5-elemmatch-to-elem-match', null, '5-elemmatch-to-elem-match-2');
