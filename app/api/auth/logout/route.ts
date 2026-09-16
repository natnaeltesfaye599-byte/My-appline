import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ data: { success: true } });

  // Clear the HttpOnly session cookie
  response.cookies.set("myupline_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
    expires: new Date(0)
  });

  // Strict anti-caching headers to prevent any back-button caching
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  // Instruct supporting browsers to clear cached assets and client storage
  response.headers.set("Clear-Site-Data", '"cache", "storage", "cookies"');

  return response;
}
