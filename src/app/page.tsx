"use client";
import { usePathname } from "next/navigation";
import type { PutBlobResult } from "@vercel/blob";
import { useRef, useState } from "react";

export default function HomePage() {
  const pathname = usePathname();

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex max-w-6xl flex-col gap-12 px-4 py-16 ">
        <div
          className={
            "flex h-8 w-full items-center rounded bg-red-50 px-2 font-black text-gray-500"
          }
        >
          {pathname}
        </div>
        <div>
          <h1>Upload Your Avatar</h1>

          <form
            onSubmit={async (event) => {
              event.preventDefault();

              if (!inputFileRef.current?.files) {
                throw new Error("No file selected");
              }

              const file = inputFileRef.current.files[0];

              const response = await fetch(
                `/api/avatar/upload?filename=${file?.name}`,
                {
                  method: "POST",
                  body: file,
                },
              );

              const newBlob = (await response.json()) as PutBlobResult;

              setBlob(newBlob);
            }}
          >
            <input name="file" ref={inputFileRef} type="file" required />
            <button type="submit">Upload</button>
          </form>
          {blob && (
            <div>
              Blob url: <a href={blob.url}>{blob.url}</a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
