'use client'
import { createTransaction } from '@/actions/transaction'
import CreateAccountDrawer from '@/component/CreateAccountDrawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { defaultCategories } from '@/data/Categories'
import useFetch from '@/hooks/use-fetch'
import { TransactionSchema } from '@/lib/formschema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { Calendar1Icon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Switch } from '@/components/ui/switch'
import { Router } from 'next/router'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import RecieptScanner from './RecieptScanner'
import { ScannedReceipt } from '@/types'

function AddTranssactionForm({
    accounts,
    catagories
}: {
    accounts: any[],
    catagories: any[]
}) {

const router= useRouter();
const{register,setValue,handleSubmit,formState:{errors},watch,getValues,reset}= useForm({
     resolver:zodResolver(TransactionSchema),
     defaultValues:{
        type: 'EXPENSE',
        amount: '',
        description: '',
        date: new Date(),
        accountId: accounts.find((account:any)=>account.isDefault)?.id,
        category: '',
        isRecurring: false,
     }
  });
  // variables
  const date=watch('date');
  const isRecurring=watch('isRecurring');
   const filteredCategories=defaultCategories.filter((category)=>category.type===getValues('type'));
  //  hook 
    const{
    loading:transactionloading,
    fn:transactionfunc,
    data:transactiondata,
    error:transactionerror,
    }=useFetch(createTransaction); 
// submithandler call 
 const submitHandler=async(data:any)=>{
  const formData={
    ...data,
    amount: parseFloat(data.amount).toFixed(2) 
  }
  transactionfunc(formData);
 };
 useEffect(()=>{
    if(transactiondata?.success && !transactionloading){
      reset();
      toast.success('Transaction added successfully!');
      router.push(`/account/${transactiondata.data.accountId}`);
    }
 },[transactiondata,transactionloading]);
 useEffect(()=>{
    if(!transactiondata?.success && !transactionloading){
      reset();
      toast.error('Failed to add transaction. Please try again.');
      
    }
 },[transactiondata,transactionloading]);

 const category= watch('category');
 const handleScanComplete = async (scannedData: ScannedReceipt) => {
    console.log("Scanned Data:", scannedData);

     // try to match scanned category with available categories
  const matchedCategory = filteredCategories.find(
    (cat) =>
      cat.name.toLowerCase().trim() === scannedData.category?.toLowerCase().trim()
  );
    // // Assuming scannedData contains the necessary fields
     setValue('amount', scannedData.amount.toString());
     setValue('date', new Date(scannedData.date));
   if (scannedData.description) {
        setValue("description", scannedData.description);
      }
        if (matchedCategory) {
    setValue("category", matchedCategory.id);
  } else {
    toast.error(
      `No matching category found for "${scannedData.category}". Please select manually.`
    );
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 animate-fadeIn">
        {/* Ai Reciept Scanner */}
            

            {/* Reduced max width and padding */}
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
                

                {/* Smaller header with reduced margins */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Add New Transaction
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                        Enter the details of your transaction below
                    </p>
                </div>
                {/* Receipt Scanner Component */}
                <div className='flex justify-center mb-4  '>
                     <RecieptScanner onScanComplete={handleScanComplete}/>
                </div>
               <div>
                 <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}> {/* Reduced space between form elements */}
                    {/* Transaction Type Selection */}
                    <div className="form-group">
                        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                            Type
                        </label>
                        <Select
                            onValueChange={(value: "EXPENSE" | "INCOME") => setValue('type', value)}
                            defaultValue={watch('type')}
                        >
                            <SelectTrigger className="w-full md:w-[180px] transition-all duration-200 hover:border-blue-500">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EXPENSE">EXPENSE</SelectItem>
                                <SelectItem value="INCOME">INCOME</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                        )}
                    </div>

                    {/* Amount and Account Selection in tighter grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Amount Input */}
                        <div className="form-group">
                            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Amount
                            </label>
                            <Input
                                className="w-full transition-all duration-200 hover:border-blue-500"
                                placeholder="Enter Amount"
                                type="number"
                                step="0.1"
                                {...register('amount')}
                            />
                            {errors.amount && (
                                <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                            )}
                        </div>

                        {/* Account Selection */}
                        <div className="form-group">
                            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Account
                            </label>
                            <Select
                                onValueChange={(value: string) => setValue('accountId', value)}
                                defaultValue={getValues('accountId')}
                            >
                                <SelectTrigger className="w-full md:w-[180px] transition-all duration-200 hover:border-blue-500">
                                    <SelectValue placeholder="Account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.map((account: any) => (
                                        <SelectItem key={account.id} value={account.id}>
                                            {account.name} (₹{parseFloat(account.balance).toFixed(2)})
                                        </SelectItem>
                                    ))}
                                    <CreateAccountDrawer>
                                        <Button variant='ghost' className='w-full select-none items-center text-sm outline-none'> Create Account</Button>
                                    </CreateAccountDrawer>
                                </SelectContent>
                            </Select>

                            {errors.accountId && (
                                <p className="text-red-500 text-sm mt-1">{errors.accountId.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Category Selection with reduced height */}
                    <div className="form-group">
                        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                            Category
                        </label>
                        <Select
                            onValueChange={(value: string) => setValue('category', value)}
                            value={watch("category")}
                        >
                            <SelectTrigger className="w-full md:w-[180px] transition-all duration-200 hover:border-blue-500">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredCategories.map((category: any) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                        )}
                    </div>

                    {/* Date and Description in a grid for better space usage */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Date Selection */}
                        <div className="form-group">
                            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                Date
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant='outline' className='w-full h-10 px-3 text-left font-normal '>
                                        {date ? format(date, "PPP") : <span>Pick a Date</span>}
                                        <Calendar1Icon className='ml-auto h-4 w-4 text-gray-500' />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0' align='start'>
                                    <Calendar mode='single' selected={date}
                                        onSelect={(date: Date | undefined) => { setValue('date', date || new Date()) }}
                                        disabled={(date: Date) => date > new Date() || date < new Date('1900-01-01')}
                                    />
                                </PopoverContent>
                            </Popover>

                            {errors.date && (
                                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                            )}
                        </div>

                        {/* Description Input */}
                        <div className="form-group">
                            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                Description
                            </label>
                            <Input
                                className="w-full transition-all duration-200 hover:border-blue-500"
                                placeholder="Enter Description about the transaction"
                                type="text"
                                {...register('description')}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Recurring Transaction Toggle with reduced padding */}
                    <div className="form-group bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <label htmlFor="isDefault" className="text-lg font-semibold">
                                    Recurring Transaction
                                </label>
                                <p className="text-xs text-gray-400">
                                    Set Up Recurring Schedule
                                </p>
                            </div>
                            <Switch
                                checked={isRecurring}
                                onCheckedChange={(checked: boolean) =>
                                    setValue('isRecurring', checked)
                                }
                            />
                        </div>
                    </div>

                    {/* Conditional Recurring Interval with reduced spacing */}
                    {isRecurring && (
                        <div className="form-group">
                            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                Recurring Interval
                            </label>
                            <Select
                                onValueChange={(value: any) => setValue('recurringInterval', value)}
                                defaultValue={getValues('recurringInterval') || 'MONTHLY'}
                            >
                                <SelectTrigger className="w-full md:w-[180px] transition-all duration-200 hover:border-blue-500">
                                    <SelectValue placeholder="Select Interval" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DAILY">Daily</SelectItem>
                                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                                    <SelectItem value="YEARLY">Yearly</SelectItem>
                                </SelectContent>
                            </Select>

                            {errors.recurringInterval && (
                                <p className="text-red-500 text-sm mt-1">{errors.recurringInterval.message}</p>
                            )}
                        </div>
                    )}

                    {/* Form Actions with reduced padding */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700
                    
                    ">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-20 
                            font-semibold
                            text-md
                            font-serif
                            transition-all duration-200"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className=" 
                            font-semibold
                            font-serif
                            text-md
                            bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                            disabled={transactionloading}
                        >
                            Add Transaction
                        </Button>
                    </div>
                </form>
               </div>
            </div>
        </div>
  )
}

export default AddTranssactionForm;
