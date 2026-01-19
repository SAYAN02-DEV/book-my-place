import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const data = await req.json();
    //verify data with database and return appropriate message
    return NextResponse.json(
        {requestState: " signin request recieved"}
    )
}

