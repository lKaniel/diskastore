import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@diskastore/server/auth"; // export const runtime = "edge";

// export const runtime = "edge";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.error().json();
  let { blobs } = await list();

  blobs = blobs.filter((value) =>
    value.pathname.includes(session?.user?.email!),
  );

  return NextResponse.json(blobs);
}
