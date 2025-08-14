import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { serializeTransaction } from "./Account";

export async function createTransaction(data:any) {
    try {
         const {userId}=await auth();
            if(!userId) throw new Error("User not authenticated");
        
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