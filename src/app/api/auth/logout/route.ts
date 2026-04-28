import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const response = NextResponse.redirect(new URL("/login", url.origin));
  
  // Clear the auth-token cookie by setting maxAge to 0
  response.cookies.set({
    name: "auth-token",
    value: "",
    maxAge: 0,
    path: "/",
  });

  return response;
}
