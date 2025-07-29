import CreateAccountDrawer from '@/component/CreateAccountDrawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React from 'react'

function Dashboardpage() {
  return (
    <div className='px-5'>
      {/* budget progress  */}


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
      </div>

    </div>
  )
}

export default Dashboardpage