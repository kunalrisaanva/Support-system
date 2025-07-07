import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateChatSuggestions(
  messages: Array<{ senderType: string; message: string; senderName: string }>,
  ticketContext: { title: string; description: string; priority: string }
): Promise<string[]> {
  try {
    const conversationHistory = messages
      .slice(-5) // Only use last 5 messages for context
      .map(msg => `${msg.senderName} (${msg.senderType}): ${msg.message}`)
      .join('\n');

    const prompt = `You are a customer support assistant helping generate professional reply suggestions for a support agent.

Ticket Information:
- Title: ${ticketContext.title}
- Description: ${ticketContext.description}
- Priority: ${ticketContext.priority}

Recent Conversation:
${conversationHistory}

Generate 3 professional and helpful reply suggestions that a support agent could use to respond to the customer. Each suggestion should be:
1. Professional and empathetic
2. Actionable and solution-focused
3. Appropriate for the conversation context
4. Between 20-100 words

Return the suggestions in JSON format: {"suggestions": ["suggestion1", "suggestion2", "suggestion3"]}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates professional customer support reply suggestions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0.7
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    return result.suggestions || [];
  } catch (error) {
    console.error("Failed to generate AI suggestions:", error);
    // Return fallback suggestions
    return [
      "Thank you for bringing this to our attention. Let me look into this issue for you.",
      "I understand your concern. Could you please provide more details so I can assist you better?",
      "I apologize for any inconvenience. Let me help you resolve this matter quickly."
    ];
  }
}