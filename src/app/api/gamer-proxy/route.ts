import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { json } from 'stream/consumers';
import { NextRequest, NextResponse } from 'next/server';



export async function GET(req: Request) {

    const gamerUrlWithQueryParams = req.url.substring(req.url.indexOf("?")+1)

    const axiosResponse = await axios.get(gamerUrlWithQueryParams, {
      headers: {
        Authorization: `Bearer ${process.env.GAMER_API_TOKEN}`,
        Accept: 'application/json',
      },
    })
    
return NextResponse.json(axiosResponse.data);

}