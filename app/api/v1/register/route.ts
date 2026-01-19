import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import prisma from "@/db";


export  async function POST(req: NextRequest){
    const recievedData = await req.json();
    const password = recievedData.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(recievedData);
    //store data in db and return appropriate message
    let hasStored = false;
    try{
        await prisma.user.create({
            data:{
                name: recievedData.name,
                email: recievedData.email,
                password: hashedPassword,
            },
        })
        hasStored = true;
    }catch(err){
        console.log("Error is: ", err);
    }
    return NextResponse.json(
        {
            message: "register request recieved in system",
            hasStored: hasStored
        }
    )
}