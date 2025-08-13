import { handleUpload, HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif"],
          allowOverwrite: true,
          tokenPayload: JSON.stringify({
            userId: "h348n23jjj23",
            projectId: 23,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log(blob, tokenPayload);

        try {
          const { userId, projectId } = JSON.parse(tokenPayload as string);
          console.log(userId, projectId);
        } catch (error) {
          console.log(error);
          throw new Error("Could not update user");
        }
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      {
        status: 400,
      }
    );
  }
}
