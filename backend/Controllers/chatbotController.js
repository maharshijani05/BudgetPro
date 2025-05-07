const { spawn } = require('child_process');
const path = require('path');

// Main chat handler
exports.handler = async (req, res) => {
    try {
      const { message } = req.body;
      console.log("Received message:", message);
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
  
      // Terminate conversation if exit command received
      if (['exit', 'quit', 'bye'].includes(message.toLowerCase())) {
        return res.status(200).json({ response: '👋 Adios Amigo!' });
      }
  
      // Get the absolute path to the Python script
      const pythonScriptPath = path.join(__dirname, '../../PFA_Chatbot/personal_finance_bot.py');
      console.log("Python script path:", pythonScriptPath);
  
      // Call Python script with user's message
      const pythonProcess = spawn('python', [pythonScriptPath], {
        env: {
          ...process.env,
          USER_MESSAGE: message,
        }
      });
  
      let botResponse = '';
      let errorData = '';
  
      // Collect data from Python script
      pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (!output.includes("Hello") || !output.includes("I'm your Personal Finance Assistant")) {
          botResponse += output;
        }
      });
  
      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });
  
      // Return response when Python process completes
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python script exited with code ${code}`);
          console.error(`Error output: ${errorData}`);
          res.status(500).json({ 
            error: 'Error processing request',
            response: 'Sorry, I encountered an error processing your request.' 
          });
        } else {
          const responseMatch = botResponse.match(/Bot: (.*?)(?:\n|$)/);
          const cleanResponse = responseMatch ? responseMatch[1].trim() : botResponse.trim();
          
          res.status(200).json({ response: cleanResponse || 'No response received' });
        }
      });
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        response: 'Sorry, something went wrong on our end.' 
      });
    }
};

// FAQ handler
exports.faqhandler = async (req, res) => {
    try {
        // Add your FAQ handling logic here
        return res.status(200).json({ 
            response: '👋 Adios Amigo!',
            faqs: [
                // Add your FAQ items here
            ]
        });
    } catch (error) {
        console.error('Error handling FAQ request:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            response: 'Sorry, something went wrong while fetching FAQs.' 
        });
    }
};
