import { NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";

export async function DELETE() {
  try {
    const client = new QdrantClient({
      url: process.env.VECTOR_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });

    const isDeleted = await client.deleteCollection("rag-collection");

    if (isDeleted) {
      return NextResponse.json(
        { message: "Data sources deleted successfully" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Data sources couldn't deleted" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Data sources deltetion failed" },
      { status: 500 }
    );
  }
}
