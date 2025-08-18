// 'use client'
import { getAccounts } from '@/actions/dashboard';
import { defaultCategories } from '@/data/Categories';
import React from 'react'
import AddTranssactionForm from './_component/AddTranssactionForm';

async function page() {
    const accounts=await getAccounts();
  return (
    <div className='max-w-6xl mx-auto px-4'>
        <AddTranssactionForm accounts={accounts.data} 
         catagories={defaultCategories}
        />
    </div>
  )
}

export default page