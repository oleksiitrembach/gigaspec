/**
 * Gigaspec v5.0 Templates
 * Core document templates for the ultimate specification kit
 */

const { claudeTemplate } = require('./claude');
const { agentTemplate } = require('./agent');
const { stateTemplate } = require('./state');

// v5.0 core templates
const v5Templates = {
  claude: claudeTemplate,
  agent: agentTemplate,
  state: stateTemplate,
};

// Version info
const v5Info = {
  version: '5.0.0',
  name: 'Gigaspec Ultimate',
  description: 'AI specification framework with forced compliance',
  features: [
    'Immutable system rules (CLAUDE.md)',
    'Project standards (AGENT.md)',
    'Living status tracking (STATE.md)',
    'Automated verification',
    'Multi-tool adapters',
    'Model-agnostic design',
  ],
};

module.exports = {
  v5Templates,
  v5Info,
  claudeTemplate,
  agentTemplate,
  stateTemplate,
};
