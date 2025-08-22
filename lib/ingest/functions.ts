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

export const triggerRecurringTransactions = inngest.createFunction({
    id: "trigger-recurring-transactions",
    name: "Trigger Recurring Transactions"
   } 
    ,{ cron: "0 0 * * *" }, // Runs daily at midnight

    async({step})=>{
        // fetch all recurring transactions
        const recurringTransac=await step.run(
            "fetch-recurring-transactions",
            async()=>{
                return await db.transaction.findMany({
                    where:{
                        isRecurring:true,
                        status:'COMPLETED',
                        OR:[

                            {lastProcessed:null} // For transactions that have never been processed
                            ,{
                                nextRecurringDate:{
                                    lte:new Date()
                                    // For transactions that are due today or earlier
                                }
                            },
                        ],
                        } 
                });
            }
        ) ;
    // create events for each recurring transaction
      if(recurringTransac.length >0){
         const events= recurringTransac.map((transac)=>({
            name:"transaction-recurring-process",
            data:{
                transactionId:transac.id,
                userId:transac.userId,
            }
         }));
         // send events to inngest to be processed
         await inngest.send(events);
      }
    }
   );

   export const  ProcessRecurringTransac= inngest.createFunction({
    id: "process-recurring-transactions",
    throttle:{
        limit: 10, // Limit to 10 events per minute
        period:"1m",
        key:"event.data.userId"
    },
} ,
{event:"transaction-recurring-process"},
async({event,step})=>{
    //  validate event data
    if(!event?.data?.transactionId || !event.data?.userId){
       console.error("Invalid event data", event.data)
       return {error: "Invalid event data"};
       
    };
//  load the source recurring transaction
    await step.run("process-recurring-transaction", async()=>{
        const transaction=await db.transaction.findUnique({
            where:{
                id:event.data.transactionId,
                userId:event.data.userId,
            },
            include:{
                account:true
            }
        }) ;
        //    check if transaction is due
        if(!transaction || !isTransacdue(transaction)) return;
       console.log("Processing recurring transaction:", transaction.id);
        //   create a new transaction based on the recurring transaction
        await db.$transaction(async(tx)=>{
            // create new transaction
        const newtransac= await tx.transaction.create({
                data:{
                    userId:transaction.userId,
                    accountId:transaction.accountId,
                    type:transaction.type,
                    category:transaction.category,
                    amount:transaction.amount,
                    description:`${transaction.description} (Recurring)`,
                    date:new Date(),
                    isRecurring:false, // New transaction is not recurring
                }
            });
 console.log("new transac",newtransac)
        // update the account balance
    const balancechanged=transaction.type ===
    'INCOME' ? transaction.amount.toFixed(2) :
    -transaction.amount.toFixed(2);


          await tx.account.update({
           where:{
              id:transaction.accountId,
           },
           data:{
            balance:{
                increment:balancechanged,
            }
           }
          });
          console.log("Account balance updated");
        //   updatelast processed date
          await tx.transaction.update({
            where:{id:transaction.id},
            data:{
                lastProcessed:new Date(),
                nextRecurringDate:calculateRecurringDate(
                    new Date(),
                    transaction.recurringInterval ||
                    ''
                )
            }
          }) 
        });
    })
}

);

// helper functions 
function isTransacdue(transaction: any): boolean {
//   if no lastprocessed date, it is due
if(!transaction.lastProcessed) return true;

const today = new Date();
const nextDue=new Date(transaction.nextRecurringDate);

// compare with new due date
 return nextDue<=today;
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