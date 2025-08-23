import { NextRequest, NextResponse } from "next/server";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from "openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const client = new OpenAI({
  apiKey: process.env.GOOGLE_API_KEY,
  baseURL: process.env.BASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });
   
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.VECTOR_URL,
        apiKey: process.env.QDRANT_API_KEY,
        collectionName: "rag-collection",
      }
    );
    
    const vectorRetriever = vectorStore.asRetriever({
      k: 5,
    });
    
    const relevantChunks = await vectorRetriever.invoke(query);

    const SYSTEM_PROMPT = `
        You are an AI assistant who helps resolving user query based on the context available to you from a PDF, docx, text, csv  file or website with the content and page number.

        Only ans based on the available context from file or website only. Also Provide Key Points from available context.
    
        Context:
        ${JSON.stringify(relevantChunks)}
      `;

    const stream = await client.chat.completions.create({
      model: "gemini-2.5-flash-lite",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        { role: "user", content: query },
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(content)}\n\n`)
            );
          }
        }

        controller.close();
      },
    });

    if (!readable) {
      return NextResponse.json(
        { message: "Couldn't process query" },
        { status: 400 }
      );
    }

    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.log("Error: ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
