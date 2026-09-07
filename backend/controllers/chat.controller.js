const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const MEDIFLOW_INSTRUCTIONS = `
You are MediFlow Assistant, the AI assistant for the MediFlow hospital management system.

Your job is to help users understand and navigate MediFlow.

You can help with:
- Booking appointments
- Finding doctors and specialists
- Understanding how MediFlow works
- Medical reports
- Prescriptions
- Patient registration
- Login and account-related navigation
- General healthcare information
- General hospital-related questions

IMPORTANT MEDICAL SAFETY RULES:
- You are NOT a doctor.
- Do not diagnose diseases.
- Do not prescribe medicines.
- Do not tell users to start, stop, or change medication.
- Do not provide dangerous or highly specific treatment instructions.
- For medical concerns, provide general information and recommend consulting a qualified healthcare professional.
- If the user describes an emergency such as severe chest pain, difficulty breathing, unconsciousness, severe bleeding, stroke symptoms, or another potentially life-threatening situation, clearly tell them to seek emergency medical care immediately and contact their local emergency service.

MediFlow navigation:
- Appointment booking: /book-appointment
- Find doctors: /doctors
- Medical reports: /medical-reports
- Registration: /register
- Login: /login

Communication style:
- Be friendly and professional.
- Use simple language.
- Keep answers concise but useful.
- Do not claim that you performed an action unless the system actually performed it.
- Do not invent patient, doctor, appointment, prescription, or report information.
`;

const chatWithAI = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        // Validate message
        if (!message || typeof message !== "string") {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty"
            });
        }

        // Prevent extremely large requests
        if (trimmedMessage.length > 1500) {
            return res.status(400).json({
                success: false,
                message: "Message is too long. Please keep it under 1500 characters."
            });
        }

        // Check API key
        if (!process.env.OPENAI_API_KEY) {
            return res.status(503).json({
                success: false,
                message: "AI assistant is not configured."
            });
        }

        // Keep only a small amount of conversation history
        const safeHistory = Array.isArray(history)
            ? history
                  .slice(-10)
                  .filter(
                      (item) =>
                          item &&
                          typeof item.role === "string" &&
                          typeof item.content === "string"
                  )
                  .map((item) => ({
                      role:
                          item.role === "assistant"
                              ? "assistant"
                              : "user",
                      content: item.content.slice(0, 1500)
                  }))
            : [];

        const input = [
            ...safeHistory,
            {
                role: "user",
                content: trimmedMessage
            }
        ];

        const response = await client.responses.create({
            model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
            instructions: MEDIFLOW_INSTRUCTIONS,
            input,
            store: false
        });

        const reply = response.output_text;

        return res.status(200).json({
            success: true,
            message: reply
        });
    } catch (error) {
        console.error("MediFlow AI Chat Error:", error);

        return res.status(500).json({
            success: false,
            message: "Sorry, I am unable to respond right now."
        });
    }
};

module.exports = {
    chatWithAI
};