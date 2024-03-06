import { NextResponse } from "next/server";

export async function GET(req: Request) {
  let gamerUrlWithQueryParams = req.url.substring(req.url.indexOf("?") + 1);

  // Decode the URL
  let decodedUrl = decodeURIComponent(gamerUrlWithQueryParams);

  // Ensure the URL does not end with "="
  if (decodedUrl.endsWith("=")) {
    decodedUrl = decodedUrl.slice(0, -1);
  }

  console.log("url", decodedUrl);

  try {
    const fetchResponse = await fetch(decodedUrl, {
      method: "GET",
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
  } catch (error) {
    console.error("Fetch error:", error);
    // Handle or throw the error appropriately
    throw new Error("Error in fetching data");
  }
}
