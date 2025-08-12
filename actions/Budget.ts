'use server'
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function GetCurrentBudget({accountId}: { accountId: string }) {
      try {
         const {userId}=await auth();
            if (!userId) {
                throw new Error("User not authenticated");
            }

        const user=await db.user.findUnique({
            where:{
                clerkUserId:userId
            }
        })  ;
        if (!user) {
            throw new Error("User not found");
        }  
      const budget=await db.budget.findFirst({
        where:{
            userId:user.id
        }
      });
        if (!budget) {
            // throw new Error("Budget not found");
        }

       const currdate=new Date();
       const startofMonth=new Date(
                currdate.getFullYear(),
                currdate.getMonth(),
                1   
             );
        const endofMonth=new Date(
                currdate.getFullYear(),
                currdate.getMonth() + 1,
                0
            );
       const expenses=await db.transaction.aggregate({
        where:{
            userId:user.id,
            type:'EXPENSE',
            date:{
                gte:startofMonth,
                lte:endofMonth
            },
            accountId
        },
        _sum:{
            amount:true
        }
       }) ;

       return {
          budget: budget?{...budget,amount: budget.amount.toNumber()} : null,
          expenses:expenses._sum.amount? expenses._sum.amount.toNumber() : 0
       }

      } catch (error) {
        console.error("Error in GetCurrentBudget:", error);
        throw new Error("Failed to retrieve current budget");
      }
}


export async function UpdateBudget({amount}:{amount:number}){
          try {
             const {userId}=await auth();
            if (!userId) {
                throw new Error("User not authenticated");
            }

        const user=await db.user.findUnique({
            where:{
                clerkUserId:userId
            }
        })  ;
        if (!user) {
            throw new Error("User not found");
        }  

        var budget=await db.budget.findFirst({
            where:{
                userId:user.id
            }
        });

        if (budget) {
            await db.budget.update({
                where: { id: budget.id },
                data: {
                    amount:parseFloat(amount.toString())
                }
            });
        } else {
           budget= await db.budget.create({
                data: {
                    userId:user.id,
                    amount:parseFloat(amount.toString())
                }
            });
        }

        revalidatePath('/dashboard');
        return { success: true, 
            message: "Budget updated successfully" ,
            data:{...budget,amount: budget.amount.toNumber()}
        };
          } catch (error) {
            console.error(error);
    return { success: false, message: "Failed to update budget" };
          }
}