const { 
  GigaspecFramework, 
  ANALYSIS_PROMPT, 
  QUESTION_ANSWER_PROMPT,
  PROJECT_QUESTIONS,
  STACK_QUESTIONS
} = require('./framework');
const { AIWorkflowEngine } = require('./ai-workflow');
const templates = require('./templates');
const { GigaspecV5Framework } = require('./v5-framework');

module.exports = {
  GigaspecFramework,
  GigaspecV5Framework,
  AIWorkflowEngine,
  templates,
  ANALYSIS_PROMPT,
  QUESTION_ANSWER_PROMPT,
  PROJECT_QUESTIONS,
  STACK_QUESTIONS
};
