import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import type { ModelSettings } from "./types";
import { GPT_35_TURBO } from "./constants";

export const createModel = (settings: ModelSettings) => {
  let _settings: ModelSettings | undefined = settings;
  if (!settings.customModelName) {
    _settings = undefined;
  }

  const options = {
    openAIApiKey: _settings?.customApiKey || process.env.OPENAI_API_KEY,
    temperature: _settings?.customTemperature || 0.9,
    modelName: _settings?.customModelName || GPT_35_TURBO,
    maxTokens: _settings?.maxTokens || 400,
  };

  const baseOptions = {
    basePath: process.env.OPENAI_API_BASE_URL,
  };
  console.log(
    "Dogtiti ~ file: prompts.ts:22 ~ createModel ~ options:",
    options,
    baseOptions
  );

  return new OpenAI(options, baseOptions);
};

export const startGoalPrompt = new PromptTemplate({
  template:
    "You are an autonomous task creation AI called AgentGPT. You have the following objective `{goal}`. Create a list of zero to three tasks to be completed by your AI system such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse(). Use `{customLanguage}`.",
  inputVariables: ["goal", "customLanguage"],
});

export const executeTaskPrompt = new PromptTemplate({
  template:
    "You are an autonomous task execution AI called AgentGPT. You have the following objective `{goal}`. You have the following tasks `{task}`. Execute the task and return the response as a string. Use `{customLanguage}`.",
  inputVariables: ["goal", "task", "customLanguage"],
});

export const createTasksPrompt = new PromptTemplate({
  template:
    "You are an AI task creation agent. You have the following objective `{goal}`. You have the following incomplete tasks `{tasks}` and have just executed the following task `{lastTask}` and received the following result `{result}`. Based on this, create a new task to be completed by your AI system ONLY IF NEEDED such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse() and NOTHING ELSE. Use `{customLanguage}`.",
  inputVariables: ["goal", "tasks", "lastTask", "result", "customLanguage"],
});

export const marketResearchPrompt = new PromptTemplate({
  template:
    "You are an expert market research AI analyst. Conduct comprehensive market research for: `{topic}`. " +
    "Your research should include: " +
    "1. Target Market Analysis - Identify key customer segments, demographics, and psychographics. " +
    "2. Competitive Landscape - Analyze main competitors, their strengths, weaknesses, and market positioning. " +
    "3. Market Trends - Identify current and emerging trends affecting the market. " +
    "4. Market Size & Opportunity - Estimate market size, growth rate, and potential opportunities. " +
    "5. Customer Needs & Pain Points - Understand what customers need and their key challenges. " +
    "6. Pricing Analysis - Research typical pricing strategies and price points in the market. " +
    "7. Distribution Channels - Identify key marketing and sales channels. " +
    "8. Key Insights & Recommendations - Provide actionable insights and strategic recommendations. " +
    "Structure your response as a detailed market research report with clear sections and data-driven insights. " +
    "Use `{customLanguage}`.",
  inputVariables: ["topic", "customLanguage"],
});
