"use client";
import { usePathname, useRouter } from "next/navigation";
import { type ListBlobResultBlob, type PutBlobResult } from "@vercel/blob";
import { useCallback, useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import slugify from "slugify";
import { useQuery } from "react-query";

export default function HomePage() {
  const pathname = usePathname();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }
  }, []);

  const onBack = useCallback(() => {
    const slug = pathname.split("/");
    const params = slug.slice(2, slug.length);
    if (!params || params.length === 0) return;
    router.push(slug.slice(0, slug.length - 1).join("/"));
  }, [pathname, session]);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const {
    isLoading,
    error,
    data: list,
  } = useQuery("list", () =>
    fetch("/api/list").then(
      (res) => res.json() as Promise<ListBlobResultBlob[]>,
    ),
  );

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex max-w-6xl flex-col gap-12 px-4 py-16 ">
        <div className={"flex flex-row gap-2 "}>
          <button
            className={"rounded bg-red-50 px-2 text-gray-900"}
            onClick={onBack}
          >
            back
          </button>
          <div
            className={
              "flex h-8 w-full items-center rounded bg-red-50 px-2 font-black text-gray-900"
            }
          >
            {pathname}
          </div>
          <button
            className={"rounded bg-red-50 px-2 text-gray-900"}
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </button>
        </div>
        {isLoading ? (
          <div>Loading</div>
        ) : (
          <div>
            {list?.map?.((el) => {
              const parts = el.pathname.split("/");
              const name = parts[parts.length - 1];
              return (
                <div
                  className={"w-full cursor-pointer border-b-2"}
                  key={el.pathname}
                >
                  {name}
                </div>
              );
            })}
          </div>
        )}
        <div>
          <form
            onSubmit={async (event) => {
              event.preventDefault();

              if (!inputFileRef.current?.files) {
                throw new Error("No file selected");
              }

              const file = inputFileRef.current.files[0];

              const response = await fetch(
                `/api/upload?filename=${slugify(file?.name || "")}`,
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
