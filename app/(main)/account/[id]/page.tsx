import { accountWithTransactions } from '@/actions/Account';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import Transactiontable from '../_components/transactiontable';
import { BarLoader } from 'react-spinners';
import ChartPage from '../_components/ChartPage';


interface accountprops{
    params:{
        id:string
    }
}


async function Account({params}: accountprops) {
    const accountData=await accountWithTransactions(params?.id);
    if(!accountData){
        notFound();
    }
    const {transactions,...account}=accountData
     console.log(accountData);
  return (
    <div className='container mx-auto py-8 px-6'>
      <div className='bg-white rounded-lg shadow-md p-6 flex justify-between items-center'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold font-serif text-gray-800'>{account?.name}</h1>
          <p className='text-foreground font-serif font-medium'>
            {account.type?.charAt(0) + account.type?.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className='text-right pb-2'>
          <div className='text-2xl font-bold text-green-600'>
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className='text-md text-muted-foreground'>
            {account._count?.transactions} Transactions
          </p>
        </div>
      </div>
      {/* chart section  */}
        <Suspense fallback={
        <BarLoader className='mt-4' width={"100%"} color='#9333ea'/>
      }>
        <ChartPage transactions={transactions}/>
      </Suspense>
      {/* transaction table */}
      <Suspense fallback={
        <BarLoader className='mt-4' width={"100%"} color='#9333ea'/>
      }>
        <Transactiontable transactions={transactions}/>
      </Suspense>
    </div>
  )
}

export default Account;