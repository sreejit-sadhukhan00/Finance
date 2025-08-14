import { Description } from '@radix-ui/react-dialog';
import {z} from 'zod';



export const accountschema=z.object({
    name:z.string().min(1,"Account name is required"),
    type:z.enum(['CURRENT','SAVINGS']),
    balance:z.string().min(1,"Balance must be a positive number"),
    isDefault:z.boolean().default(false)
});

export const TransactionSchema=z.object({
    type:z.enum(['INCOME','EXPENSE']),
    amount:z.string().min(1,"Amount is required"),
    description:z.string().optional(),
    date:z.date({message:"Date is required"}),
    accountId:z.string().min(1,"Account ID is required"),
    category:z.string().min(1,"Category is required"),
    isRecurring:z.boolean().default(false),
    recurringInterval:z.enum(['DAILY','WEEKLY','MONTHLY','YEARLY']).optional(),
    nextRecurringDate:z.date().optional(),
}).superRefine((data,ctx)=>{
    if(data.isRecurring && !data.recurringInterval) {
         ctx.addIssue({
           code: z.ZodIssueCode.custom,
            message: "Recurring interval is required for recurring transactions",
            path: ['recurringInterval']
         }) 
    };
});