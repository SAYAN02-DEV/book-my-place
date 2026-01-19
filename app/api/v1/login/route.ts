import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/db";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest){
    try{
        const data = await req.json();
        const recievedPassword  = data.password;
        const recievedEmail = data.email;
        const user  = await prisma.user.findUnique({
        where:{
            email: recievedEmail,
        },
    });
    if(!user){
        console.log("User not found");
        return NextResponse.json(
            {
                requestState: "signin request recieved",
                message:"User not found"
            },
            {status: 402}
        )
    }else{
        if(user.oauth){
            console.log("No password set for this account use google");
            return NextResponse.json(
                {
                    requestState: " signin request recieved",
                    message: "No password set for this account use google"
                },
                {status:401}
            )
        }else{
            const flag = await bcrypt.compare(
                recievedPassword,
                user.password
            )
            if(!flag){
                console.log("Invalid credentials");
                return NextResponse.json(
                    {
                        requestState: "signin request recieved",
                        message: "Invalid credentials"
                    },
                    {status:401}
                )
            }else{
                const token = jwt.sign(
                    {
                        email: user.email
                    },
                    process.env.JWT_SECRET!,
                );
                console.log("correct credentials");
                return NextResponse.json(
                    {
                        requestState: "signin request recieved",
                        message: "you are logged in",
                        token: token
                    },
                    {status: 200}
                )
            }
        }
    }
    }catch(err){
        console.log("Error: ", err);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        )
    }
}

