'use server'
import aj from "@/lib/Arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genai = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

const serializeTransaction = (obj: any) => {
     const serialized={...obj};

     if(obj.balance){
        serialized.balance=obj.balance.toNumber();
     }
     if(obj.amount){
        serialized.amount=obj.amount.toNumber();
     }
     return serialized;
}

export async function createTransaction(data:any) {
    try {
         const {userId}=await auth();
            if(!userId) throw new Error("User not authenticated");
            // arcjet request for rate limiting
        const req=await request();
        const decision=await aj.protect(req,{
             userID: userId,
             requested:1,
        });
          if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                const {remaining,reset}=decision.reason;
               console.error({
                code:"RATE_LIMIT_EXCEEDED",
                details:{
                    remaining,
                    resetInSeconds:reset
                }
               }) ;
               throw new Error("Rate limit exceeded. Please try again later.");
            }
            throw new Error("Request denied Server");
          }
            const user=await db.user.findUnique({
                where:{
                    clerkUserId:userId
                },
                select:{
                    id:true
                }
            });
            if(!user) throw new Error("User not found");
       const account=await db.account.findUnique({
        where:{
            id:data.accountId,
            userId:user.id
        }
       });
        if(!account) throw new Error("Account not found");
      
      const balanceChange=data.type==="EXPENSE"? -data.amount : data.amount;
      const newBalance=account.balance.toNumber() + balanceChange;

      const transaction=await db.$transaction(async(tx)=>{
             const newTransac=await tx.transaction.create({
                data:{
                    ...data,
                    userId:user.id,
                    nextRecurringDate:data.isRecurring && data.RecurringInterval ? calculateRecurringDate(data.date,data.RecurringInterval) : null,
                }
             });

                await tx.account.update({
                    where:{
                        id:account.id
                    },
                    data:{
                        balance:newBalance
                    }
                });
             
                return newTransac;
      });
      revalidatePath('/dashboard');
      revalidatePath('/account/${transaction.accountId}');

      return {success:true,data: serializeTransaction(transaction)};
    } catch (error) {
        console.error("Error creating transaction:", error);
        throw new Error("Failed to create transaction");
    }
}

function calculateRecurringDate(startDate: string | Date, Interval: string){
   const date = new Date(startDate);
    switch(Interval) {
        case 'DAILY':
            date.setDate(date.getDate() + 1);
            break;
        case 'WEEKLY':
            date.setDate(date.getDate() + 7);
            break;
        case 'MONTHLY':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'YEARLY':
            date.setFullYear(date.getFullYear() + 1);
            break;
        default:
            throw new Error("Invalid interval");
    }
    return date;
}

export async function ScanReciept(file: File){
  try {
    const model=genai.getGenerativeModel({model:"gemini-1.5-flash"});
    // convert file to arrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');
    const prompt= `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "isReceipt": true,
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If the image is not a receipt, respond with this exact JSON and nothing else:
      {
        "isReceipt": false,
        "message": "Only for receipts"
      }

      If it is a receipt, respond only with the receipt JSON specified above.
      Do not include any explanatory text or markdown code fences.
    `;

    const result=await model.generateContent([
        {
            inlineData:{
                data: base64String,
                mimeType:file.type
            },
        },
        prompt
    ]);

    const response=await result.response;
      const text=response.text();
    
       const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
     try {
        const data=JSON.parse(cleanedText);
        if(data.isReceipt === false) {
            return {isReceipt: false, message: "Only for receipts"};
        }
        else{
            return{
                isReceipt: true,
                data: {
                    amount: parseFloat(data.amount),
                    date: new Date(data.date),
                    description: data.description,
                    merchantName: data.merchantName,
                    category: data.category
                }
            }
        }
     } catch (error) {
        console.error("Error parsing JSON response:", error);
        return {isReceipt: false, message: "Invalid response format"};
     }


  } catch (error) {
    console.error("Error scanning receipt:", error);
    return {isReceipt: false, message: "Failed to scan receipt"};
  }
}