/**
 * Gigaspec v5.0 - Modular Rules System
 * Topic-specific rule modules
 */

const { securityRules } = require('./security');
const { testingRules } = require('./testing');

// Available rule modules
const ruleModules = {
  security: securityRules,
  testing: testingRules,
};

// List available modules
const availableModules = Object.keys(ruleModules);

module.exports = {
  ruleModules,
  availableModules,
  securityRules,
  testingRules,
};
