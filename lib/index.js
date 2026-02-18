const { 
  GigaspecFramework, 
  ANALYSIS_PROMPT, 
  QUESTION_ANSWER_PROMPT,
  PROJECT_QUESTIONS,
  STACK_QUESTIONS
} = require('./framework');
const { AIWorkflowEngine } = require('./ai-workflow');
const templates = require('./templates');

module.exports = {
  GigaspecFramework,
  AIWorkflowEngine,
  templates,
  ANALYSIS_PROMPT,
  QUESTION_ANSWER_PROMPT,
  PROJECT_QUESTIONS,
  STACK_QUESTIONS
};
