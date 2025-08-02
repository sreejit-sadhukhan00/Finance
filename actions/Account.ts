'use server'
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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


export async function updateDefaultAccount(accountId:string){
    try {
        const {userId}=await auth();
        if(!userId) throw new Error("User not authenticated");
       
        const user=await db.user.findUnique({
            where:{
                clerkUserId:userId
            }
        });
        if(!user) throw new Error("User not found");
       
      await db.account.updateMany({
        where:{
            userId:user.id,isDefault:true
        },
        data:{
            isDefault:false
        }
      })  ;

    const account=  await db.account.update({
        where:{
            id:accountId
        },
        data:{
            isDefault:true
        }
    });
      

    revalidatePath('/dashboard');
    return {success:true,data:serializeTransaction(account)}
    } catch (error) {
        return {success:false,error:(error as Error).message}
    }
}

export async function accountWithTransactions(accountId:string){
try {
    const {userId}=await auth();
        if(!userId) throw new Error("User not authenticated");
       
        const user=await db.user.findUnique({
            where:{
                clerkUserId:userId
            }
        });
        if(!user) throw new Error("User not found");
       
        const account=await db.account.findUnique({
            where:{
                id:accountId,
                userId:user.id
            },
            include:{
                transactions:{
                    orderBy:{
                        date:'desc'
                    }
                },
                _count:{
                    select:{transactions:true}
                }
            }
        });
        if(!account)    throw new Error("Account not found");

        return {...serializeTransaction(account),
         transactions:account.transactions.map(serializeTransaction)
        };
} catch (error) {
    
}
}