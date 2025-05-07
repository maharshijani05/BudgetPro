// api/chat.js - API route handler for Next.js
import { spawn } from 'child_process';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Terminate conversation if exit command received
    if (['exit', 'quit', 'bye'].includes(message.toLowerCase())) {
      return res.status(200).json({ response: '👋 Adios Amigo!' });
    }

    // Call Python script with user's message
    const pythonProcess = spawn('python', ['../../../../PFA_Chatbot/personal_finance_bot.py'], {
      env: {
        ...process.env,
        // Pass message to Python via environment variable
        USER_MESSAGE: message,
      }
    });

    let botResponse = '';
    let errorData = '';

    // Collect data from Python script
    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString();
      // Filter out the welcome message if present
      if (!output.includes("Hello") || !output.includes("I'm your Personal Finance Assistant")) {
        botResponse += output;
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    // Return response when Python process completes
    return new Promise((resolve) => {
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python script exited with code ${code}`);
          console.error(`Error output: ${errorData}`);
          res.status(500).json({ 
            error: 'Error processing request',
            response: 'Sorry, I encountered an error processing your request.' 
          });
        } else {
          // Extract just the bot's response by looking for "Bot: " prefix
          const responseMatch = botResponse.match(/Bot: (.*?)(?:\n|$)/);
          const cleanResponse = responseMatch ? responseMatch[1].trim() : botResponse.trim();
          
          res.status(200).json({ response: cleanResponse || 'No response received' });
        }
        resolve();
      });
    });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      response: 'Sorry, something went wrong on our end.' 
    });
  }
}