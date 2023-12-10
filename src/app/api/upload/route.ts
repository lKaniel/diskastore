import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { authOptions } from "@diskastore/server/auth";
import { getServerSession } from "next-auth";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  const session = await getServerSession(authOptions);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  if (!session) return NextResponse.error().json();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  if (!filename) return NextResponse.error().json();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  if (!request.body) return NextResponse.error().json();

  const blob = await put(`${session?.user?.email}/${filename}`, request.body, {
    access: "public",
  });

  return NextResponse.json(blob);
}
