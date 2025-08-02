import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'

function Transactiontable({transactions}: {transactions: any[]} ) {
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
      <TableHead className="cursor-pointer">
        Date
      </TableHead>
      
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
       </div>
    </div>
  )
}

export default Transactiontable