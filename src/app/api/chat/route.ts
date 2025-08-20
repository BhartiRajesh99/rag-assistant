import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.GOOGLE_API_KEY,
  baseURL: process.env.BASE_URL
})

export async function POST(request: NextRequest){
  try {
    const {query} = await request.json()

    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004",
        apiKey: process.env.GOOGLE_API_KEY,
      });
    
      const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
          url: process.env.VECTOR_URL,
          collectionName: "rag-collection"
        });
    
      const vectorRetriever = vectorStore.asRetriever({
        k: 5,
      })
    
      const relevantChunks = await vectorRetriever.invoke(query)
    
      const SYSTEM_PROMPT = `
        You are an AI assistant who helps resolving user query based on the
        context available to you from a PDF, docx, text, csv  file or website with the content and page number.
    
        Only ans based on the available context from file or website only.
    
        Context:
        ${JSON.stringify(relevantChunks)}
      `;
    
      const response = await client.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {role: "user", content: query}
        ]
      })

      if(!response.choices){
        return NextResponse.json({message: "Couldn't process query"}, {status: 400})
      }

      return NextResponse.json({message: response.choices[0].message.content}, {status: 200})
  } catch (error: any) {
    console.log("Error: ", error)
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}