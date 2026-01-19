import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
export  async function POST(req: NextRequest){
    const data = await req.json();
    const password = data.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(data);
    //store data in db and return appropriate message
    return NextResponse.json(
        {message: "register request recieved in system"}
    )
}