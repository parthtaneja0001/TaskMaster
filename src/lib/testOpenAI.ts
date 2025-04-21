import { OpenAI } from 'openai';

// Function to test OpenAI API connection
export const testOpenAIConnection = async (): Promise<{ success: boolean; message: string }> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    return { 
      success: false, 
      message: 'OpenAI API key is missing. Please check your .env file.' 
    };
  }
  
  try {
    console.log('Testing OpenAI API connection...');
    console.log('API Key format:', apiKey.substring(0, 7) + '...');
    
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Hello, this is a test message."
        }
      ],
      max_tokens: 5
    });
    
    console.log('OpenAI API test successful!');
    return { 
      success: true, 
      message: 'OpenAI API connection successful!' 
    };
  } catch (error: any) {
    console.error('OpenAI API test failed:', error);
    
    let errorMessage = 'Unknown error occurred while testing OpenAI API.';
    
    if (error.status === 401) {
      errorMessage = 'Authentication error with OpenAI API. Please check your API key.';
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded for OpenAI API. Please try again later.';
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    return { 
      success: false, 
      message: errorMessage 
    };
  }
}; 