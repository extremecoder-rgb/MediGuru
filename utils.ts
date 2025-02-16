import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export async function queryPineconeVectorStore(
    client: Pinecone,
    indexName: string,
    query: string,
): Promise<string> {
    try {
        const apiOutput = await hf.featureExtraction({
            model: "mixedbread-ai/mxbai-embed-large-v1",
            inputs: query,
        });

        // Ensure the output is an array of numbers
        const queryEmbedding: number[] = Array.isArray(apiOutput) 
            ? apiOutput.flat() as number[] 
            : [];

        if (queryEmbedding.length === 0) {
            throw new Error("Feature extraction failed: Empty embedding received.");
        }

        const index = client.index(indexName);

        // Pinecone query (removed namespace)
        const queryResponse = await index.query({
            vector: queryEmbedding,
            topK: 5,
            includeMetadata: true
        });

        if (!queryResponse.matches?.length) {
            return "<nomatches>";
        }

        const concatenatedRetrievals = queryResponse.matches
            .filter(match => typeof match.metadata?.chunk === "string") // Ensure chunk is a string
            .map((match, index) => {
                const score = match.score ? Math.round(match.score * 100) : 0;
                return `\nClinical Finding ${index + 1} (${score}% match):\n${match.metadata?.chunk}`;
            })
            .join("\n\n");

        return concatenatedRetrievals || "<nomatches>";

    } catch (error) {
        console.error('Error in queryPineconeVectorStore:', error);
        return "<nomatches>"; // Always return this instead of throwing
    }
}
