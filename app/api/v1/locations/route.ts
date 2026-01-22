import fetchStations from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const {searchParams} = new URL(req.url);
    const latitude = parseFloat(searchParams.get('lat') || '0');
    const longitude = parseFloat(searchParams.get('long') || '0');
    const movieid = searchParams.get('mid') ? parseFloat(searchParams.get('mid')!) : undefined;

    const response = await fetchStations(latitude, longitude, 20, movieid);
    console.log(response);
    return NextResponse.json(response)
}