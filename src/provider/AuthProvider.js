
"use client"

import { SessionProvider } from "next-auth/react";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const AuthProvider = ({ children, session }) => {
  // const session = await getServerSession(authOptions);
  return (
    <SessionProvider session={session}>{children}</SessionProvider>
  );
};
