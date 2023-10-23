import { fetch } from "@forge/api";


export const getReviewForPullRequest = async (diff) => {
  const prompt = `
      Your task is:
      - Review the code changes and provide feedback.
      - If there are any bugs, highlight them.
      - Provide details on missed use of best-practices.
      - Does the code do what it says in the commit messages?
      - Provide security recommendations if there are any.
      - If multi threading is used then ensure thread safe code is written
      - Dont highlight minor issues and nitpicks.

      You are provided with the code changes (diffs) in a unidiff format. Following are the code changes:

      ${diff}`
  const res = await callOpenAI(prompt);
  return res;
}

const callOpenAI = async (prompt) => {

    const choiceCount = 1;
    // OpenAI API endpoint
    const url = `https://api.openai.com/v1/chat/completions`;
  
    // Body for API call
    const payload = {
      model: getOpenAPIModel(),
      n: choiceCount,
      messages: [{
        role: 'user',
        content: prompt
      }]
    };
  
    // API call options
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getOpenAPIKey()}`,
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      body: JSON.stringify(payload)
    };
  
    // API call to OpenAI
    const response = await fetch(url, options);
    let result = ''
  
    if (response.status === 200) {
      const chatCompletion = await response.json();
      const firstChoice = chatCompletion.choices[0]
  
      if (firstChoice) {
        result = firstChoice.message.content;
      } else {
        console.warn(`Chat completion response did not include any assistance choices.`);
        result = `AI response did not include any choices.`;
      }
    } else {
      const text = await response.text();
      result = text;
    }
    return result;
  }
  
  // Get OpenAI API key
  export const getOpenAPIKey = () => {
    return "";
  }
  
  // Get OpenAI model
  export const getOpenAPIModel = () => {
    return 'gpt-3.5-turbo';
    // return 'gpt-4';
  }