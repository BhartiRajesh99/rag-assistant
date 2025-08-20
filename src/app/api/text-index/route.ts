import { NextResponse, NextRequest } from "next/server";
import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";

export async function POST(request: NextRequest) {
  try {
    const response = await request.json();
    if(!response){
      return NextResponse.json({message: "Something wrong happened"},{status: 400})
    }
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const vectorStore = new QdrantVectorStore(embeddings, {
      url: process.env.VECTOR_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: "rag-collection",
    });

    await vectorStore.addDocuments([
      {pageContent: response.content, metadata: {documentId: response.id}}
    ])

    const updatedResponse = {...response, status: "indexed"}

    console.log("✅Indexing of text done");
    return NextResponse.json(
      { message: "Url Indexing Done", updatedResponse },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error: ", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
