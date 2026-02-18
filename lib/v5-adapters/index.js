/**
 * Gigaspec v5.0 - Tool Adapters
 * Multi-tool adapter system for universal compatibility
 */

const { ClaudeAdapter } = require('./claude');
const { CursorAdapter } = require('./cursor');
const { KimiAdapter } = require('./kimi');

// Available adapters
const adapters = {
  claude: ClaudeAdapter,
  cursor: CursorAdapter,
  kimi: KimiAdapter,
};

/**
 * Generate adapters for specified tools
 */
async function generateAdapters(config, tools = ['claude', 'cursor', 'kimi']) {
  const results = {};
  
  for (const tool of tools) {
    if (adapters[tool]) {
      const AdapterClass = adapters[tool];
      const adapter = new AdapterClass(config);
      results[tool] = await adapter.generate();
    }
  }
  
  return results;
}

/**
 * Get list of available adapters
 */
function getAvailableAdapters() {
  return Object.keys(adapters);
}

module.exports = {
  adapters,
  generateAdapters,
  getAvailableAdapters,
  ClaudeAdapter,
  CursorAdapter,
  KimiAdapter,
};
