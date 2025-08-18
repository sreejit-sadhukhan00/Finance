'use client'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns';
import {  ChevronDown, ChevronUp, Clock1, IndianRupee, MoreHorizontal, RefreshCw, SearchIcon, Trash, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import { categoryColors, Category, CategoryType } from '@/data/Categories';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {  useRouter } from  'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFetch from '@/hooks/use-fetch';
import { deleteTransactions } from '@/actions/Account';
import { toast } from 'sonner';
import { BarLoader } from 'react-spinners';


function Transactiontable({transactions}: {transactions: any[]} ) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchterm, setSearchTerm] = useState("");
  const [typefilter,settypefilter]=useState("");
  const [recurringFilter,setrecurringFilter]=useState("");


 const{
  loading: deleteLoading,
  error: deleteError,
  fn:deletefn,
  data: deleteData
 }= useFetch(deleteTransactions);



  const[sortconfig,setsortconfig]=useState({
    field:"date",
    direction:"asc"
  });





  const filteredandSortedTransactions = useMemo(()=>{
       let result=[...transactions];
        //  search filter
        if (searchterm) {
        const newsearchterm = searchterm.toLowerCase();
        result= result.filter((transac) =>(
            transac.description.toLowerCase().includes(newsearchterm)) ||
            transac.category.toLowerCase().includes(newsearchterm)
        );
    }
    //  recurring filter 
        if(recurringFilter){
          
           if(recurringFilter ==='recurring'){
            result=result.filter((transac)=>transac.isRecurring===true)
           }
           if(recurringFilter ==='non-recurring'){
            result=result.filter((transac)=>transac.isRecurring===false)
           }
        }
      // type filter 
         if(typefilter){
              result=result.filter((transac)=>transac.type === typefilter);
         }

        //  sorting 
           result.sort((a,b)=>{
             let comparison=0;
             switch (sortconfig.field) {
              case "date":
                comparison=new Date(a.date).getTime()-new Date(b.date).getTime();
                   break;
              case "amount":
                comparison=a.amount-b.amount;
                break;

                case "category":
                comparison=a.category.localeCompare(b.category);
                break;

              default:
                comparison=0
                break;
             }
             return sortconfig.direction === 'asc' ? comparison : -comparison;
           })
        return result;
  },[transactions, searchterm, recurringFilter, typefilter, sortconfig]);
  
  const router=useRouter();
  // filtering function
    const handlesort=({field}: {field: string})=>{
          setsortconfig(current=>({
           field: field,
            direction:current.field==field && current.direction==='asc' ? 'desc':'asc'
          }));
        }

   const handleSelect=(id:string)=>{
     setSelectedIds(current=>current.includes(id)?current.filter(item=>item!=id):[...current,id])
   }
   const handleSelectAll=()=>{
     if(selectedIds.length === transactions.length
      && transactions.length >0
     ){
      setSelectedIds([]);
     }
     else{
      setSelectedIds(transactions.map(transaction=>transaction.id));
     }
   }


  const handleBulkDelete=async ()=>{
      if(!window.confirm("Are you sure you want to delete these transactions? This action cannot be undone."))
          {
            return;
  }
   deletefn(selectedIds);
}
  useEffect(()=>{
     if(deleteData && !deleteLoading){
       setSelectedIds([]);
       toast.success("Transactions deleted successfully");
     }
      if(deleteError && !deleteLoading){
        toast.error("Failed to delete transactions: " );
      }
  },[deleteLoading,deleteData,deleteError])






  return (
    <div className='space-y-4'>
     <BarLoader className='mt-4' color='#4f46e5' 
     loading={deleteLoading} width='100%' height={3} />
        {/* ===== Filters Section Start ===== */}
<div className='mt-6 flex flex-col gap-4 lg:flex-row lg:items-center transition-all duration-300 ease-in-out'>
    {/* Search Input */}
    <div className='flex-1 group transition-all duration-200'>
        <div className='flex items-center relative'>
            <SearchIcon className='absolute h-4 w-4 text-muted-foreground ml-3 transition-transform group-hover:scale-110'/>
            <input 
                type='text' 
                className='pl-10 w-full pt-3 pb-2 rounded-md border-gray-200 focus:border-primary 
                         transition-all duration-200 hover:shadow-sm focus:shadow-md
                         focus:ring-2 focus:ring-primary/20'
                placeholder='Search transactions...'
                value={searchterm}
                onChange={(e)=>setSearchTerm(e.target.value)}
            />
        </div>
    </div>
      
    {/* Filter Selects */}
    <div className='flex flex-wrap items-center gap-3 transition-all duration-300'>
        <Select value={typefilter} onValueChange={(value)=>settypefilter(value)}>
            <SelectTrigger className="w-full sm:w-[150px] hover:shadow-sm transition-all duration-200">
                <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
        </Select>

        <Select value={recurringFilter} onValueChange={(value)=>setrecurringFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px] hover:shadow-sm transition-all duration-200">
                <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="recurring">Recurring only</SelectItem>
                <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
            </SelectContent>
        </Select>

        {selectedIds.length > 0 && (
            <Button
                variant='destructive'
                className='h-8 px-4 text-sm font-medium'
                onClick={handleBulkDelete}
            >
                <Trash className='w-4 h-4 mr-2' />
                Delete Selected ({selectedIds.length})
            </Button>
        )}

        {(searchterm || typefilter || recurringFilter) && (
            <Button 
                onClick={()=>{
                    setSearchTerm('');
                    settypefilter('');
                    setrecurringFilter('');
                    setSelectedIds([]);
                    
                }}
                variant='outline'
                size='icon'
            >
                <X className='w-4 h-4 text-center block font-extrabold' />
            </Button>
        )}
    </div>
</div>
{/* ===== Filters Section End ===== */}

    {/* transactions */}
       <div className='mt-6'>
         <Table>

  <TableHeader>
    <TableRow>
      <TableHead className="w-[50px]">
        <Checkbox  checked={selectedIds.length==transactions.length} onCheckedChange={()=>handleSelectAll()}/>
      </TableHead>
      <TableHead className="cursor-pointer"
      onClick={()=>handlesort({field: "date"})}
      >
        <div className='flex items-center '>Date
          {sortconfig.field === 'date' &&(
            sortconfig.direction === 'asc' ? <ChevronUp className='w-4 h-4 ml-2' /> : <ChevronDown className='w-4 h-4 ml-2' />
          )}
        </div>
        
      </TableHead>

      <TableHead className="cursor-pointer">
        <div>Description</div>
      </TableHead>
      
      <TableHead className="cursor-pointer"
      onClick={()=>handlesort({field: "category"})}
      ><div className='flex items-center'>
        Category  
        {sortconfig.field === 'category' &&(
            sortconfig.direction === 'asc' ? <ChevronUp className='w-4 h-4 ml-2' /> : <ChevronDown className='w-4 h-4 ml-2' />
          )}
        </div></TableHead>


      <TableHead className="cursor-pointer"
      onClick={()=>handlesort({field: "amount"})}
      >
        <div className='flex items-center justify-end'>
          Amount
{sortconfig.field === 'amount' &&(
            sortconfig.direction === 'asc' ? <ChevronUp className='w-4 h-4 ml-2' /> : <ChevronDown className='w-4 h-4 ml-2' />
          )}
        </div>
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
        <Checkbox checked={selectedIds.includes(transaction.id)} onCheckedChange={()=>handleSelect(transaction.id)}/>
      </TableCell>
      <TableCell>
        {transaction?.date 
          ? format(new Date(transaction.date), "PP")
          : "Invalid date"}
      </TableCell>
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
  <DropdownMenuTrigger asChild>
    <Button className='h-8 w-8 p-0 rounded-full' variant="ghost">

      <MoreHorizontal className='h-4 w-4'/>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem
      onClick={()=>
        router.push(`/transaction/create?edit=${transaction.id}`)
      }
    >Edit</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className='text-destructive'
    // bulk dlete function 
    onClick={()=>deletefn([transaction.id])}
    >Delete</DropdownMenuItem>
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