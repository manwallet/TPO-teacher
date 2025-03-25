import { Configuration, OpenAIApi } from 'openai';

// Initialize OpenAI API with the API key and optional base URL from Redux store
let openai = null;

// Configure OpenAI API
export const configureOpenAI = (apiKey, apiUrl) => {
  if (!apiKey) return null;
  
  const configuration = new Configuration({
    apiKey: apiKey,
    ...(apiUrl && { basePath: apiUrl })
  });
  
  openai = new OpenAIApi(configuration);
  return openai;
};

// Analyze essay using GPT
export const analyzeEssay = async (essay, prompt, apiKey, apiUrl = null, model = 'gpt-4') => {
  if (!openai && !configureOpenAI(apiKey, apiUrl)) {
    throw new Error('OpenAI API 未配置，请在设置中添加 API 密钥');
  }
  
  try {
    const analysisPrompt = prompt || `
      请分析以下托福写作文章，并提供详细的评分和反馈。评估以下几个方面：
      1. 内容和任务完成度（0-5分）
      2. 组织结构（0-5分）
      3. 语言使用（0-5分）
      4. 词汇多样性（0-5分）
      5. 语法准确性（0-5分）
      
      请提供具体的改进建议和修改示例。总分计算为各项得分之和。
      
      文章内容：
      ${essay}
    `;
    
    const response = await openai.createChatCompletion({
      model: model,
      messages: [
        { role: 'system', content: '你是一位专业的托福写作评分老师，擅长分析写作并提供详细的反馈。' },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('分析文章时出错:', error);
    throw new Error(`分析文章时出错: ${error.message || '未知错误'}`);
  }
};

// Convert speech to text using Whisper
export const transcribeSpeech = async (audioBlob, apiKey, apiUrl = null, model = 'whisper-1') => {
  if (!openai && !configureOpenAI(apiKey, apiUrl)) {
    throw new Error('OpenAI API 未配置，请在设置中添加 API 密钥');
  }
  
  try {
    // Create form data with audio file
    const formData = new FormData();
    formData.append('file', audioBlob, 'speech.webm');
    formData.append('model', model);
    
    // Use fetch directly since the OpenAI SDK doesn't handle file uploads well
    const baseUrl = apiUrl || 'https://api.openai.com/v1';
    const response = await fetch(`${baseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message || '转录失败');
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('转录语音时出错：', error);
    throw new Error(`转录语音时出错: ${error.message || '未知错误'}`);
  }
};

// Analyze speaking response
export const analyzeSpeaking = async (transcript, prompt, apiKey, apiUrl = null, model = 'gpt-4') => {
  if (!openai && !configureOpenAI(apiKey, apiUrl)) {
    throw new Error('OpenAI API 未配置，请在设置中添加 API 密钥');
  }
  
  try {
    const analysisPrompt = prompt || `
      请分析以下托福口语回答，并提供详细的评分和反馈。评估以下几个方面：
      1. 内容完整性（0-5分）
      2. 语言使用（0-5分）
      3. 发音和语调（0-5分）
      4. 流利度（0-5分）
      
      请提供具体的改进建议。总分计算为各项得分之和。
      
      口语回答内容：
      ${transcript}
    `;
    
    const response = await openai.createChatCompletion({
      model: model,
      messages: [
        { role: 'system', content: '你是一位专业的托福口语评分老师，擅长分析口语表现并提供详细的反馈。' },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('分析口语时出错:', error);
    throw new Error(`分析口语时出错: ${error.message || '未知错误'}`);
  }
};
