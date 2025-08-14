// 'use client'
import { getAccounts } from '@/actions/dashboard';
import { defaultCategories } from '@/data/Categories';
import React from 'react'
import AddTranssactionForm from './_component/AddTranssactionForm';

async function page() {
    const accounts=await getAccounts();
    console.log("accounts", accounts);
  return (
    <div className='max-w-6xl mx-auto px-4'>
        <h1 className='text-4xl mb-8'>Add Transaction</h1>
        <AddTranssactionForm accounts={accounts} 
         catagories={defaultCategories}
        />
    </div>
  )
}

export default page