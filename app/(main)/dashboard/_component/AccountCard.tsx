import React from 'react'
import { Account } from '@/types'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from '@/components/ui/switch'
import { ArrowDownRight, ArrowUpRight, IndianRupee } from 'lucide-react'
import Link from 'next/link'
function AccountCard({ account }: { account: Account }) {
  return (
    <Card className='cursor-pointer hover:bg-secondary transition-all hover:shadow-md hover:scale-103 duration-200'>
        <Link href={`/account/${account.id}`}>
        
  <CardHeader>
    <CardTitle className='uppercase font-semibold mb-4'>{account.name}</CardTitle>
    <Switch checked={account.isDefault}/>
  </CardHeader>
  <div className='mt-4 flex flex-col gap-8 justify-center '>
    <CardContent>
    <div className='text-accent-foreground font-bold flex items-center text-lg'>
        
        <IndianRupee className="w-5 h-5 text-blue-950" />
      {parseFloat(account.balance).toFixed(2)}
     </div>
  </CardContent>
  <CardContent className='mt-[-20]'>
    <p  className='text-lg font-bold text-muted-foreground capitalize'>
        {account.type.charAt(0)+account.type.slice(1).toLocaleLowerCase()} Account
    </p>
  </CardContent>
  </div>
  <CardFooter className='flex justify-between text-sm text-muted-foreground'>
    <div> 
        <ArrowUpRight className='text-green-500'/>
        Income
    </div>
    <div> 
        <ArrowDownRight className='text-red-500'/>
        Expense
    </div>
  </CardFooter>
</Link>
</Card>
  )
}

export default AccountCard