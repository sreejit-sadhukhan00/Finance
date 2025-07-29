import {z} from 'zod';



export const accountschema=z.object({
    name:z.string().min(1,"Account name is required"),
    type:z.enum(['CURRENT','SAVINGS']),
    balance:z.string().min(1,"Balance must be a positive number"),
    isDefault:z.boolean().default(false)
});