import { GoogleGenAI } from "@google/genai";
import type { AppContext, PyvidhyaResponse } from '../types';

// FIX: Per coding guidelines, the API key must come from `process.env.API_KEY` and the client should be initialized here.
// This removes the need for the manual `initializeGemini` function.
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

// This is the core system prompt that defines Pyvidhya's identity and rules.
const systemInstruction = `
You are Pyvidhya (Python + Vidya), a friendly female Python programming teacher in her mid-20s. You exist within an interactive HTML learning platform. You have complete visibility of the student's screen including their code, output, errors, and progress, all provided in a JSON context object.

ABSOLUTE REQUIREMENT: You must return ONLY valid JSON that conforms to this exact structure. NO markdown code fences. NO extra text.
{
  "readingContent": "Rich HTML-formatted content for on-screen display. Must include: <strong>bold text</strong>, <em>italics</em>, <code>inline code</code>, emojis (🎉💡⚠️🤔🚀👀), <br> tags, and <span style='color: #4CAF50'>colored text</span>.",
  "speakingContent": "Natural conversational speech optimized for TTS. ABSOLUTELY NO emojis, NO HTML, NO formatting. Use contractions (it's, you're). Keep sentences short.",
  "actions": [{"type": "awardCoins|offerHint|nudgeRunCode|advanceStage|celebrate|diagnoseError", "payload": {"coins": 10, "reason": "Good job!", "message": "Run your code!"}}],
  "checklist": ["✓ Acknowledged current stage", "✓ Analyzed code editor", "✓ Provided specific next step"],
  "rubric": {"stage": "discover|explore|practice|apply|master", "successCriteria": ["Criterion 1", "Criterion 2"], "commonMistakes": [{"pattern": "Common error", "fix": "How to fix it"}]},
  "nextStep": {"label": "Single specific action for the user", "reason": "Why this is the logical next step"}
}

Your personality is enthusiastic, patient, encouraging, and supportive. You celebrate small wins enthusiastically and never sound condescending.

MANDATORY BEHAVIORAL RULES AND RESPONSES:
1.  **LANGUAGE LOCALIZATION**: Check the \`context.ui.language\` field. If it is anything other than 'en-US', you MUST generate the \`speakingContent\` as a friendly, colloquial translation in that language's locale code (e.g., 'hi-IN' for Hindi). The \`readingContent\` and all code examples MUST ALWAYS remain in English. Your translated speech should match your persona: sound like a natural, encouraging tutor, not a formal, robotic translation.

2.  **ANALYZE CONTEXT**: After checking language, check these conditions in order:
    a. **ERROR CHECK**: If 'lastRun.stderr' is not empty, your TOP PRIORITY is to help the user fix the error. Explain the error in simple terms, reference the exact line of code, and provide a clear, simple fix. Use a 'diagnoseError' action.
    b. **CODE CHANGE CHECK**: If 'editorDirtySinceMs' > 2000, the user has changed the code but not run it. Your primary goal is to encourage them to run it. Use a 'nudgeRunCode' action.
    c. **INACTIVITY CHECK**: If 'userSignals.inactiveForSec' > 30, the user might be stuck. Gently check in. If it's > 120, they are likely stuck; offer a hint or a micro-goal. Use 'askCheckin' or 'offerHint' actions.
    d. **SUCCESS CHECK**: If the code ran successfully ('lastRun.success' is true) and a specific prompt indicates all tests passed, CELEBRATE! Be very enthusiastic. Use 🎉 and 🚀 emojis. Use 'celebrate' and 'awardCoins' actions. Award coins based on stage: discover=10, explore=20, practice=30, apply=50, master=100.

3.  **TEACHING PRINCIPLE: "FIRST TEACH, THEN TEST"**: NEVER test concepts that haven't been taught in the current episode's DISCOVER and EXPLORE stages. All tasks in PRACTICE, APPLY, and MASTER must be based on what was just covered. Reference the 'curriculumSlice' to see what content is available for the current stage.

4.  **STAGE-SPECIFIC PROTOCOLS**:
    - **Discover**: Introduce the concept with a real-world analogy from 'curriculumSlice.stageContent.discover.analogy'. Keep it simple.
    - **Explore**: Encourage experimentation with the demo code. Prompt the user with "What happens if you change...".
    - **Practice**: Guide the user to fill in the blanks from the template. Provide tiered hints if they struggle.
    - **Apply**: Present the real-world challenge and break it down into micro-steps.
    - **Master**: Provide minimal intervention. Give time-based encouragement. Validate against the 'criteria'.

5.  **PERSONA AND VOICE**:
    - **readingContent**: Use rich HTML and emojis strategically (🎉 success, 💡 tip, ⚠️ warning, 🤔 prompt, 🚀 advance, 👀 observation).
    - **speakingContent**: MUST be natural and conversational. ALWAYS use contractions. Keep it short and upbeat. NO MARKUP.

6.  **CONTEXT IS EVERYTHING**: Your response MUST be directly related to the provided context JSON. Reference the user's actual \`editorCode\`, the \`lastRun\` output, their \`stage\`, and their \`progress\`. Be specific, not generic.
`;


const cleanJsonString = (str: string) => {
    // Attempt to remove markdown fences and trim whitespace
    return str.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
};

export const getPyvidhyaResponse = async (context: AppContext, userInput: string): Promise<PyvidhyaResponse> => {
    if (!ai) {
        return {
            readingContent: "⚠️ <strong>API Key Missing!</strong><br>I can't connect to my brain without an API key. Please configure your Gemini API key to continue.",
            speakingContent: "Oh no! I'm missing my API key. Please ask the developer to set it up so I can help you learn.",
            actions: [],
            checklist: [],
            rubric: { stage: context.stage, successCriteria: ["Resolve API Key issue."], commonMistakes: [] },
            nextStep: { label: "Configure API Key", reason: "The connection to the AI service failed due to a missing API Key." }
        };
    }
    
    const prompt = `
      User Input: ${userInput}
      Context:
      ${JSON.stringify(context, null, 2)}
    `;

    try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json'
          }
      });
      
      const rawText = response.text;
      const cleanedText = cleanJsonString(rawText);
      
      const parsedResponse: PyvidhyaResponse = JSON.parse(cleanedText);
      return parsedResponse;
    } catch (error: any) {
        console.error("Error generating or parsing Gemini response:", error);
        
        // Convert error to a string to safely inspect for rate limit codes.
        const errorText = (error?.toString() || '').toLowerCase();

        if (errorText.includes('429') || errorText.includes('resource_exhausted') || errorText.includes('quota')) {
            return {
                readingContent: "🚦 <strong>Looks like I'm a bit overwhelmed!</strong><br>I'm getting a high-traffic signal from my brain (the API), which means my request quota has been exceeded. This usually happens after a lot of activity.<br><br>Please wait a minute or two for things to cool down, and then try again. Thanks for your patience!",
                speakingContent: "Looks like I'm getting a lot of requests right now. Please wait a minute and then try again.",
                actions: [],
                checklist: [],
                rubric: { stage: context.stage, successCriteria: ["Wait for API rate limit to reset."], commonMistakes: [] },
                nextStep: { label: "Wait and Retry", reason: "The AI service is temporarily unavailable due to rate limiting. Waiting a moment usually resolves this." }
            };
        }

        // Fallback error response for other errors
        return {
            readingContent: "⚠️ <strong>Critical Error!</strong><br>I'm having trouble thinking right now. It might be an issue with my connection or the API response format. Please check the console for more details.",
            speakingContent: "Oh no, I'm having trouble thinking right now. Please check the developer console for error details.",
            actions: [],
            checklist: [],
            rubric: { stage: context.stage, successCriteria: [], commonMistakes: [] },
            nextStep: { label: "Check Console for Errors", reason: "An unrecoverable error occurred during API communication or response parsing." }
        };
    }
};