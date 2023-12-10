"use client";
import { usePathname, useRouter } from "next/navigation";
import { type ListBlobResultBlob, type PutBlobResult } from "@vercel/blob";
import { useCallback, useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import slugify from "slugify";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useDownloader from "react-use-downloader";
import FileIcon from "./file-icon.svg";
import FolderIcon from "./folder-icon.svg";
import DeleteIcon from "./delete-icon.svg";

export default function HomePage() {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const session = useSession();
  const router = useRouter();

  const [foldername, setFoldername] = useState("");

  const [files, setFiles] = useState<
    {
      name: string;
      key: string;
      url: string;
    }[]
  >([]);

  const [folders, setFolders] = useState<
    {
      name: string;
    }[]
  >([]);

  const { size, elapsed, percentage, download, cancel, isInProgress } =
    useDownloader();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }
  }, []);

  const onBack = useCallback(() => {
    const slug = pathname.split("/");
    const params = slug.slice(3, slug.length);
    if (!params || params.length === 0) return;
    router.push(slug.slice(0, slug.length - 1).join("/"));
  }, [pathname, session]);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const {
    isLoading,
    error,
    data: list,
  } = useQuery(
    "list",
    () =>
      fetch("/api/list").then(
        (res) => res.json() as Promise<ListBlobResultBlob[]>,
      ),
    {
      onSuccess: (data) => {
        const slug = pathname.split("/");
        const params = slug.slice(2, slug.length);
        const prefix = params.join("/") + "/";
        const filtered = data.filter((el) => el.pathname.includes(prefix));

        const files = filtered
          .filter((el) => !el.pathname.split(prefix)?.[1]?.includes("/"))
          .map((el) => {
            const parts = el.pathname.split("/");
            const name = parts[parts.length - 1] ?? "";
            return {
              name,
              url: el.url,
              key: el.pathname,
            };
          });
        setFiles(files);
        const folders = filtered
          .filter((el) => el.pathname.split(prefix)?.[1]?.includes("/"))
          .map((el) => {
            const name = el.pathname.split(prefix)?.[1]?.split("/")?.[0] ?? "";
            return {
              name,
            };
          });
        setFolders(folders);
      },
    },
  );

  const addMutation = useMutation(
    async (event) => {
      if (!inputFileRef.current?.files) {
        throw new Error("No file selected");
      }

      const file = inputFileRef.current.files[0];
      let name = slugify(file?.name ?? "");
      const slug = pathname.split("/");
      const params = slug.slice(3, slug.length);
      if (params.length > 0) {
        name = `${params.join("/")}/${slugify(file?.name ?? "")}`;
      }

      const response = await fetch(`/api/upload?filename=${name}`, {
        method: "POST",
        body: file,
      });

      const newBlob = (await response.json()) as PutBlobResult;
    },
    {
      onSuccess: async () => {
        await queryClient?.invalidateQueries("list");
      },
    },
  );

  const deleteMutation = useMutation(
    async (url: string) => {
      const response = await fetch(`/api/delete?url=${url}`, {
        method: "DELETE",
      });
    },
    {
      onSuccess: async () => {
        await queryClient?.invalidateQueries("list");
      },
    },
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
            {"/" + pathname.split("/").splice(3, pathname.length).join("/")}
          </div>
          <button
            className={"rounded bg-red-50 px-2 text-gray-900"}
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </button>
        </div>
        <div className={"flex flex-col gap-4"}>
          {isLoading ? null : (
            <>
              {folders?.map?.((el) => {
                return (
                  <div
                    className={
                      "flex w-full cursor-pointer flex-row items-center gap-2 border-b"
                    }
                    key={el.name}
                    onClick={() => router.push(pathname + `/${el.name}`)}
                  >
                    <FolderIcon className={"h-4 w-4 object-cover"} />
                    {el.name}
                  </div>
                );
              })}
            </>
          )}
          {isLoading ? (
            <div>Loading</div>
          ) : (
            <>
              {files?.map?.((el) => {
                return (
                  <div
                    className={
                      "flex w-full cursor-pointer flex-row items-center gap-2 border-b"
                    }
                    key={el.key}
                  >
                    <FileIcon
                      className={"h-4 w-4 object-cover"}
                      onClick={() => download(el.url, el.name)}
                    />
                    {el.name}
                    <DeleteIcon
                      className={"h-4 w-4 object-cover"}
                      onClick={() => deleteMutation.mutate(el.url)}
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
        <div className={"flex flex-row items-center justify-start gap-2"}>
          <label className={"rounded bg-red-50 p-2 text-gray-900"}>
            Upload file
            <input
              className={"hidden"}
              name="file"
              ref={inputFileRef}
              type="file"
              onChange={async (event) => {
                event.preventDefault();

                addMutation.mutate();
              }}
              required
            />
          </label>
          <div
            className={"cursor-pointer rounded bg-red-50 p-2 text-gray-900"}
            onClick={() => {
              if (!foldername) return;
              setFolders((prev) => {
                return [...prev, { name: slugify(foldername) }];
              });
              setFoldername("");
            }}
          >
            Add folder
          </div>
          <input
            className={
              "box-border h-full  rounded border-0 p-2 text-gray-900 outline-0"
            }
            name={"foldername"}
            value={foldername}
            placeholder={"Foldername"}
            onChange={(event) => setFoldername(event.target.value)}
          />
        </div>
      </div>
    </main>
  );
}
