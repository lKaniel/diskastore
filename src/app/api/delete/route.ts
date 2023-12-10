import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { authOptions } from "@diskastore/server/auth";
import { getServerSession } from "next-auth";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.error().json();

  if (!filename) return NextResponse.error().json();
  if (!request.body) return NextResponse.error().json();

  const blob = await put(`${session?.user?.email}/${filename}`, request.body, {
    access: "public",
  });

  return NextResponse.json(blob);
}
