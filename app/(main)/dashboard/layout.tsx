import React, { Suspense } from 'react'
import Dashboardpage from './page'
import { BarLoader } from 'react-spinners'
function page({children}:{children: React.ReactNode}) {
  return (
    <div>
        <div>
             <span className="text-4xl font-bold font-raleway bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent  animate-gradient py-2 tracking-tight  sm:ml-16 shadow-md rounded-2xl p-4">
                DashBoard
             </span>
        </div>
         <Suspense fallback={<BarLoader className='mt-10' width={"100%"} color='#9333ea'/>}
         >

             <Dashboardpage/>  
         </Suspense>
          
    </div>
  )
}

export default page