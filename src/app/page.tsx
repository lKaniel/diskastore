"use client";
import { usePathname, useRouter } from "next/navigation";
import type { PutBlobResult } from "@vercel/blob";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import slugify from "slugify";

export default function HomePage() {
  const pathname = usePathname();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status !== "authenticated") {
      router.push("/login");
    } else {
      router.push(`/files/${slugify(session.data?.user?.email ?? "")}`);
    }
  }, [session]);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  return null;
}
