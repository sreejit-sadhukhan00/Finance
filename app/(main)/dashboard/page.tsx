
import { getAccounts } from '@/actions/dashboard'
import CreateAccountDrawer from '@/component/CreateAccountDrawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React from 'react'
import AccountCard from './_component/AccountCard'
import { GetCurrentBudget } from '@/actions/Budget'
import BudgetProgress from './_component/BudgetProgress'

async function Dashboardpage() {
const accounts=await getAccounts();

const defaultAccount=accounts.data.find((account)=> account.isDefault);
let budgetdata=null;
 if(defaultAccount){
   budgetdata=await GetCurrentBudget({accountId:defaultAccount.id});
 }

  return (
    <div className='px-5'>
      {/* budget progress  */}
    {  defaultAccount &&  (
      <BudgetProgress
        initialBudget={budgetdata?.budget}
        expenses={budgetdata?.expenses || 0}
      />
    )}

      {/* overview account */}

      {/* Accpunt grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-10 max-w-7xl mx-auto grid-cols-2'>
        <CreateAccountDrawer>
            <Card className='cursor-pointer hover:bg-secondary transition-all hover:shadow-md hover:scale-103 duration-200'>
               <CardContent className='flex flex-col items-center justify-center h-full pt-3'>
                <Plus className='h-10 w-10 mb-2 text-gray-600'/>
                <p className='text-lg text-muted-foreground font-medium'>
                   Create Account
                </p>
               </CardContent>
            </Card>
        </CreateAccountDrawer>
        { accounts?.data.length>0 &&
           accounts.data.map((account=>(
            <AccountCard key={account.id} account={account}/>
          )))
        }
      </div>

    </div>
  )
}

export default Dashboardpage