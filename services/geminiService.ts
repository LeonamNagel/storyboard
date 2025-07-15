
import { GoogleGenAI, Type } from "@google/genai";
import { SceneOutline } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const sceneSchema = {
    type: Type.OBJECT,
    properties: {
        visual_description: {
            type: Type.STRING,
            description: "Uma descrição visual cinematográfica detalhada da cena, incluindo ângulo da câmera, iluminação, cenário e posicionamento dos personagens."
        },
        action_dialogue: {
            type: Type.STRING,
            description: "A ação principal que ocorre na cena ou o diálogo falado pelos personagens."
        }
    },
    required: ["visual_description", "action_dialogue"],
};

export const generateStoryboardOutline = async (premise: string): Promise<SceneOutline[]> => {
    try {
        const prompt = `Você é um roteirista e diretor de cinema especialista. Dada a seguinte premissa, crie um esboço de storyboard com exatamente 10 cenas. Para cada cena, forneça uma descrição visual cinematográfica e a ação ou diálogo principal. A história deve ter um começo, meio e fim claros distribuídos pelas 10 cenas. Premissa: "${premise}"`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: sceneSchema,
                    description: "Uma lista de exatamente 10 cenas que compõem o storyboard."
                },
            },
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        if (!Array.isArray(parsedData)) {
            throw new Error("A resposta da API não foi um array.");
        }
        
        return parsedData as SceneOutline[];

    } catch (error) {
        console.error("Erro ao gerar esboço do storyboard:", error);
        throw new Error("Falha ao gerar o esboço do storyboard a partir do texto.");
    }
};


export const generateSceneImage = async (sceneDescription: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: sceneDescription,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        
        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error('Nenhuma imagem foi gerada.');
        }

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Erro ao gerar imagem da cena:", error);
        // Return a placeholder or re-throw
        throw new Error("Falha ao gerar a imagem para uma cena.");
    }
};
