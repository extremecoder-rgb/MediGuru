import { GoogleGenerativeAI } from "@google/generative-ai";
import { HfInference } from '@huggingface/inference';

// Initialize both Gemini and HuggingFace
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

// Available models in priority order
const MODELS = {
    GEMINI_PRO: "gemini-1.5-pro",
    GEMINI_VISION: "gemini-pro-vision",
    HF_VISION: "Salesforce/blip-image-captioning-large"
};

const prompt = "Briefly list any abnormal findings in this clinical report.";
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function tryGeminiModel(modelName: string, base64Data: string, mimeType: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent({
        contents: [{ 
            role: 'user', 
            parts: [
                { text: prompt }, 
                { inline_data: { mime_type: mimeType, data: base64Data } }
            ] 
        }],
    });
    return result.response.text();
}

async function tryHuggingFace(base64Data: string): Promise<string> {
    const imageData = Buffer.from(base64Data, 'base64');
    const result = await hf.imageToText({
        model: MODELS.HF_VISION,
        data: imageData
    });
    return result.generated_text;
}

export async function POST(req: Request) {
    try {
        const { base64 } = await req.json();
        
        if (!base64?.startsWith('data:image/')) {
            return new Response(
                JSON.stringify({ error: "Invalid image format" }), 
                { status: 400 }
            );
        }

        const base64Data = base64.split(',')[1];
        const mimeType = base64.split(';')[0].split(':')[1];
        let errors: string[] = [];

        // Try Gemini Pro first
        try {
            console.log("Attempting with Gemini Pro...");
            const text = await tryGeminiModel(MODELS.GEMINI_PRO, base64Data, mimeType);
            if (text) {
                return new Response(
                    JSON.stringify({ summary: text }), 
                    { status: 200 }
                );
            }
        } catch (error: any) {
            errors.push(`Gemini Pro error: ${error.message}`);
            await sleep(2000); // Wait before trying next model
        }

        // Try Gemini Vision if Pro fails
        try {
            console.log("Attempting with Gemini Vision...");
            const text = await tryGeminiModel(MODELS.GEMINI_VISION, base64Data, mimeType);
            if (text) {
                return new Response(
                    JSON.stringify({ summary: text }), 
                    { status: 200 }
                );
            }
        } catch (error: any) {
            errors.push(`Gemini Vision error: ${error.message}`);
            await sleep(2000);
        }

        // Finally try HuggingFace
        try {
            console.log("Attempting with HuggingFace...");
            const text = await tryHuggingFace(base64Data);
            if (text) {
                return new Response(
                    JSON.stringify({ summary: text }), 
                    { status: 200 }
                );
            }
        } catch (error: any) {
            errors.push(`HuggingFace error: ${error.message}`);
        }

        // If all attempts failed
        throw new Error(`All models failed: ${errors.join('; ')}`);

    } catch (error: any) {
        console.error('API Error:', error);
        
        return new Response(
            JSON.stringify({ 
                error: "Failed to process image",
                details: error.message
            }), 
            { status: 500 }
        );
    }
}