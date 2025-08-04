'use client'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns';
import {  Clock1, IndianRupee, MoreHorizontal, RefreshCw } from 'lucide-react';
import React from 'react'
import { categoryColors, Category, CategoryType } from '@/data/Categories';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const recurringInterval={
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
}
function Transactiontable({transactions}: {transactions: any[]} ) {
  const filteredandSortedTransactions = transactions;

  // filtering function
    const handlesort=({ })=>{

      }


  return (
    <div className=''>
     
        {/* filters */}

        {/* transactions */}
       <div className='mt-6'>
         <Table>

  <TableHeader>
    <TableRow>
      <TableHead className="w-[50px]">
        <Checkbox/>
      </TableHead>
      <TableHead className="cursor-pointer"
      onClick={()=>handlesort("date")}
      >
        <div className='flex items-center '>Date</div>
        
      </TableHead>

      <TableHead className="cursor-pointer">
        <div>Description</div>
      </TableHead>
      
      <TableHead className="cursor-pointer"
      onClick={()=>handlesort("category")}
      ><div className='flex items-center'>
        Category
        </div></TableHead>


      <TableHead className="cursor-pointer"
      onClick={()=>handlesort("amount")}
      >
        <div className='flex items-center justify-end'>Amount</div>
      </TableHead>

      <TableHead className=''>Recurring</TableHead>

      <TableHead></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredandSortedTransactions.length === 0? 
   (
   <TableRow>
    <TableCell className='text-center' colSpan={7}>
      <div className='text-center text-muted-foreground'>No transactions found</div>
    </TableCell>
   </TableRow>)  :(
    filteredandSortedTransactions.map((transaction,index)=>(

    <TableRow key={index}>
      <TableCell className="font-medium">
        <Checkbox />
      </TableCell>
      <TableCell>{format(new Date(transaction.date),"PP")}</TableCell>
      <TableCell>{transaction.description}</TableCell>
      <TableCell className='capitalize' >
        <span style={{
          background: categoryColors[transaction.category] || '#f0f0f0',
        }}
         className='px-2 py-2 rounded-md text-md font-semibold text-white'
        >
          {transaction.category}
        </span>
</TableCell>
      <TableCell className="text-right flex items-center justify-end">
        <span>
          <IndianRupee className='w-4'/>
        </span>
        <span style={{color: transaction.type === 'EXPENSE' ? 'red' : 'green'}}
         className='ml-1 font-semibold text-md'
        >
          
             {transaction.type === 'EXPENSE' ? '-' : '+'}
             {transaction.amount.toFixed(2)}
          </span></TableCell>

          <TableCell className='text-left ml-2'>
            {
              transaction.isRecurring?(
                <TooltipProvider>

                
                <Tooltip >
            <TooltipTrigger >
              <Badge variant="outline" className='gap-2 px-2 py-2 text-md font-md capitalize bg-purple-100 text-purple-700  hover:bg-purple-200'>
                  <RefreshCw className='w-4 h-4' />
                  {transaction.recurringInterval}</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                 <div>Next Date :</div>
                 <div>{format(new Date(transaction.nextRecurringDate),"PP")}</div>
              </div>
            </TooltipContent>
          </Tooltip>
          </TooltipProvider>
              ):(
                <Badge variant="outline" className='gap-2 px-2 py-2 text-md font-md'>
                  <Clock1 className='w-4 h-4' />
                  One-Time</Badge>
              )
            }
          </TableCell>

          <TableCell>
            <DropdownMenu>
  <DropdownMenuTrigger>
    <Button className='h-8 w-8 p-0 rounded-full' variant="ghost">

      <MoreHorizontal className='h-4 w-4'/>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
          </TableCell>
    </TableRow>
    ))
    )
  }
  </TableBody>
</Table>
       </div>
    </div>
  )
}

export default Transactiontable