"use client";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/");
    }
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex max-w-6xl flex-col items-center justify-center gap-12 px-4 py-16 ">
        <p className="text-green/300 text-8xl font-bold drop-shadow-xl">
          Welcome
        </p>
        <div className="flex flex-col gap-7">
          <button
            className="rounded-2xl  border-2 bg-[#2e026d] p-4 px-8 text-white"
            onClick={() =>
              signIn("google", {
                callbackUrl: "/",
              })
            }
          >
            Sign In with Google
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;
