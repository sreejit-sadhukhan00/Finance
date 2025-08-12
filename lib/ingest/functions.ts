import { sendEmails } from "@/actions/Send-Emails";
import { db } from "../prisma";
import { inngest } from "./client";
import Email from "@/emails/template";

export const CheckBudgetAlert = inngest.createFunction(
  { id: "check-budget-alert", name: "check Budget Alert" },
  { cron:"0 */6 * * *" },
  async ({ step }) => {
     const budget=await step.run("fetch budget",async()=>{
        return await db.budget.findMany({
            include:{
                user:{
                    include:{
                        accounts:{
                            where:{
                                isDefault:true
                            }
                        }
                    }
                }
            }
        })
     });

     for(const b of budget){
        const defaultAccount=b.user.accounts[0];
        if(!defaultAccount) continue;

        await step.run(`check-budget-${b.id}`,async()=>{
         
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
                    userId:b.userId,
                    accountId:defaultAccount.id,
                    type:'EXPENSE',
                    date:{
                        gte:startofMonth,
                        lte:endofMonth
                    },
                },
                _sum:{
                    amount:true
                }
             });
             const totalExpenses=expenses._sum.amount?.toNumber() || 0;
             const budgetAmount=Number(b.amount);
                const percentageUsed=(totalExpenses / budgetAmount) * 100;
                  console.log(percentageUsed)
                if(percentageUsed > 80 && (!b.lastAlertSent || isNewMonth(new Date(b.lastAlertSent),new Date()))){
            // send email alert
               console.log("reached here" ,
                b
               )
              await sendEmails({
                to:b.user.email,
                subject:"Budget Alert",
                react:Email({
                    username:b.user.name ?? undefined,
                    type:"budget-alert",
                    data:{
                        percentageUsed,
                        budgetAmount:parseInt(b.amount).toFixed(1),
                        totalExpenses:totalExpenses.toFixed(1),
                        accountName:defaultAccount.name,
                    }
                })
              })
            //   update last alert date
                 await db.budget.update({
                    where:{id:b.id},
                    data:{
                        lastAlertSent: new Date()
                    }
                 })
                }
        });
     }
  },
);


function isNewMonth(lastAlertDate: Date, currentDate: Date): boolean {
  return lastAlertDate.getMonth() !== currentDate.getMonth() || lastAlertDate.getFullYear() !== currentDate.getFullYear();
}