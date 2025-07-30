'use server'

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export enum AccountType {
    CURRENT = 'CURRENT',
    SAVINGS = 'SAVINGS',
}
export interface CreateAccountData {
    name: string;
    type: AccountType;
    balance: number;
    isDefault: boolean;
}

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


export async function createAccount(data:CreateAccountData){
  try{
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
    
    //  CONVERT BALANCE TO FLOAT 

    const balancefloat=parseFloat(data.balance.toString());
     if(isNaN(balancefloat)){
        throw new Error("Invalid balance value");
     }

    //  check if  account with same name already exists
  const existingAccount=await db.account.findMany({
    where:{
        userId:user.id
    }
  });
      const shouldbeDefault=existingAccount.length===0?true:data.isDefault;
      
    // if this one is default, set all others to non-default  
    if(shouldbeDefault){
        await db.account.updateMany({
            where:{
                userId:user.id,
                isDefault:true
            },
            data:{
                isDefault:false
            }
        })
    };

    // create the account
    const account=await db.account.create({
        data:{
            ...data,
            balance:balancefloat,
            userId:user.id,
            isDefault:shouldbeDefault,
            }
    });
      
    const serializedAccount=serializeTransaction(account);
   revalidatePath('/dashboard');
   return {success:true,data:serializedAccount};
  }
  catch(err){
    console.error("Error creating account:", err);
    return {success:false, error: err instanceof Error ? err.message : "Unknown error occurred"};
  }
}

export async function getAccounts() {
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
    
    const accounts=await db.account.findMany({
        where:{
            userId:user.id
        },
        orderBy:{
            createdAt:'desc'
        },
        include:{
            _count:{
                select:{
                    transactions:true
                },
            },
        },

    });
    const serializedAccounts = accounts.map(serializeTransaction);
    return {success:true, data: serializedAccounts};
}