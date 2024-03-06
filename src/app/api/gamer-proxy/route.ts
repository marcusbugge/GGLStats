import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const gamerUrlWithQueryParams = req.url.substring(req.url.indexOf("?") + 1);

  // Decode the URL
  const decodedUrl = decodeURIComponent(gamerUrlWithQueryParams);

  console.log("url", decodedUrl);

  const fetchResponse = await fetch(decodedUrl, {
    method: "GET", // Optional, as GET is the default method
    headers: {
      Authorization: `Bearer ${process.env.GAMER_API_TOKEN}`,
      Accept: "application/json",
    },
  });

  if (!fetchResponse.ok) {
    // Handle the error according to your needs
    throw new Error(`Error fetching data: ${fetchResponse.statusText}`);
  }

  const responseData = await fetchResponse.json();

  return NextResponse.json(responseData);
}
