'use strict';

jest.autoMockOff();

var defineTest = require('../../../node_modules/jscodeshift/dist/testutils').defineTest;

defineTest(__dirname, '0-arr-to-func-generator', null, '0-arr-to-func-generator-1');
defineTest(__dirname, '0-dont-check-this-elemmods', null, '0-dont-check-this-elemmods-1');
defineTest(__dirname, '0-dont-check-this-mods', null, '0-dont-check-this-mods-1');
defineTest(__dirname, '0-func-to-simple', null, '0-func-to-simple-1');
defineTest(__dirname, '0-func-to-simple', null, '0-func-to-simple-2');
defineTest(__dirname, '0-func-to-simple', null, '0-func-to-simple-3');
defineTest(__dirname, '0-obj-to-func-generator', null, '0-obj-to-func-generator');
defineTest(__dirname, '2-def-must-return-something', null, '2-def-must-return-something-1');
defineTest(__dirname, '2-def-must-return-something', null, '2-def-must-return-something-2');
defineTest(__dirname, '2-no-empty-mode-call', null, '2-no-empty-mode-call-1');
defineTest(__dirname, '2-no-empty-mode', null, '2-no-empty-mode-1');
defineTest(__dirname, '2-no-empty-mode', null, '2-no-empty-mode-2');
defineTest(__dirname, '2-no-more-this-underscore', null, '2-no-more-this-underscore-1');
defineTest(__dirname, '2-no-more-this-underscore', null, '2-no-more-this-underscore-2');
defineTest(__dirname, '3-apply-call-to-apply');
defineTest(__dirname, '5-api-changed', null, '5-api-changed-1');
defineTest(__dirname, '5-elemmatch-to-elem-match', null, '5-elemmatch-to-elem-match-1');
defineTest(__dirname, '5-elemmatch-to-elem-match', null, '5-elemmatch-to-elem-match-2');
defineTest(__dirname, '7-mods-value', null, '7-mods-value-1');
defineTest(__dirname, '7-once-to-def', null, '7-once-to-def-1');
defineTest(__dirname, '7-thisisarray-to-arrayisarray', null, '7-thisisarray-to-arrayisarray-1');
defineTest(__dirname, '7-thisisarray-to-arrayisarray', null, '7-thisisarray-to-arrayisarray-2');
defineTest(__dirname, '7-xhtml-true', null, '7-xhtml-true-1');
defineTest(__dirname, '7-xhtml-true', null, '7-xhtml-true-2');
defineTest(__dirname, '7-xhtml-true', null, '7-xhtml-true-3');
defineTest(__dirname, '8-attrs-to-addattrs', null, '8-attrs-to-addattrs-1');
defineTest(__dirname, '8-attrs-to-addattrs', null, '8-attrs-to-addattrs-2');
defineTest(__dirname, '8-chain-attrs-to-chain-addattrs', null, '8-chain-attrs-to-chain-addattrs-1');
defineTest(__dirname, '8-chain-attrs-to-chain-addattrs', null, '8-chain-attrs-to-chain-addattrs-2');
defineTest(__dirname, '8-chain-mix-to-chain-addmix', null, '8-chain-mix-to-chain-addmix-1');
defineTest(__dirname, '8-chain-mix-to-chain-addmix', null, '8-chain-mix-to-chain-addmix-2');
defineTest(__dirname, '8-mix-to-addmix', null, '8-mix-to-addmix-1');
defineTest(__dirname, '8-mix-to-addmix', null, '8-mix-to-addmix-2');
