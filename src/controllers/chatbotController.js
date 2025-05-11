const axios = require('axios');
const ChatMessage = require('../models/ChatMessageSchema');
const OLLAMA_API_URL = process.env.OLLAMA_API_URL;

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const username = req.session.username;
   
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Retrieve conversation history for this user (last 5 messages)
    const conversationHistory = await ChatMessage.find({ username })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    // Format conversation history for context
    const formattedHistory = conversationHistory
      .reverse()
      .map(msg => `User: ${msg.message}\nAssistant: ${msg.response}`)
      .join('\n\n');
    
    // Create a system prompt that contextualizes the AI as a travel assistant
    const systemPrompt = "You are a helpful travel assistant for our booking platform. You can help users find flights, hotels, cars, and answer questions about travel. Keep responses concise and friendly. Use previous conversation context to provide more personalized assistance.";
   
    // Prepare the request for Ollama API with conversation history included
    const prompt = `${systemPrompt}\n\n${formattedHistory ? `Previous conversation:\n${formattedHistory}\n\n` : ''}User: ${message}\nAssistant:`;
    
    const response = await axios.post(OLLAMA_API_URL, {
      model: "llama3.2",
      prompt: prompt,
      stream: false
    });
   
    const data = response.data;
    const aiResponse = data.response || "Sorry, I couldn't process your request.";
   
    // Save the conversation to the database
    const chatMessage = new ChatMessage({
      username,
      message,
      response: aiResponse,
      createdAt: new Date()
    });
   
    await chatMessage.save();
    
    // Send back the AI response
    res.json({ 
      response: aiResponse,
      hasHistory: conversationHistory.length > 0
    });
  } catch (error) {
    console.error('Error sending message to Ollama:', error);
    res.status(500).json({ error: "Failed to process your message" });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const username = req.session.username;
    const history = await ChatMessage.find({ username })
      .sort({ createdAt: 1 })
      .lean();
    
    res.json({ history });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

const clearChatHistory = async (req, res) => {
  try {
    const username = req.session.username;
    await ChatMessage.deleteMany({ username });
    res.redirect('/chatbot');
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  clearChatHistory
};