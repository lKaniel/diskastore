"use client";
import { SessionProvider } from "next-auth/react";
import React, { type FC, type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const MainWrapper: FC<PropsWithChildren> = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <div className="flex min-h-screen flex-col">{props.children}</div>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default MainWrapper;
