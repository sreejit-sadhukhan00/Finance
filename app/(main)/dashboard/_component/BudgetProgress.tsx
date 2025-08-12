"use client"
import { UpdateBudget } from '@/actions/Budget';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import useFetch from '@/hooks/use-fetch';
import { Check, Pencil, X } from 'lucide-react';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

function BudgetProgress({initialBudget, expenses}: {initialBudget: any, expenses: number}) {
const [isEditing, setIsEditing] = React.useState(false);
const [newbudget, setnewBudget] = React.useState(initialBudget?.amount.toString()|| "");

const percentagedUSed= initialBudget? (expenses/initialBudget.amount)*100 :0;
// update budget
const {
loading:isLoading,
error,
fn: updateBudgetFn,
data: updateBudgetData
}=useFetch(UpdateBudget);
const handleUpdateBudget=async()=>{
  const amount=parseFloat(newbudget);
  if(isNaN(amount) || amount <= 0){
    toast.error("Please enter a valid budget amount");
    return;
  }
  setIsEditing(false);
  await updateBudgetFn({amount});
}
useEffect(()=>{
 if(updateBudgetData?.success){
    toast.success("Budget Updated Successfully");
    setIsEditing(false);
    setnewBudget(updateBudgetData.data);
 }
},[updateBudgetData]);
useEffect(()=>{
 if(error){
    toast.error("Failed to update budget");
    setIsEditing(false);
    setnewBudget(initialBudget?.amount.toString());
 }
},[error]);




// cancel editing
const handleCancel=()=>{
 setnewBudget(initialBudget?.amount.toString() || "");
  setIsEditing(false);
}
  return (
    <div>
        <Card className='mt-4'>
  <CardHeader className='flex items-center justify-between space-y-0 pb-3'>
    <div className='flex-1'>
       
    <CardTitle>Monthly Budget (Default Account)</CardTitle>
     <div className='flex items-center justify-between'>
         {isEditing ? (
           <div className='flex items-center space-x-2'>
                 <Input type='number' value={newbudget}
                  onChange={(e)=>setnewBudget(e.target.value)}
                  className='w-30'
                  placeholder='Enter new budget'
                  autoFocus
                  />
                 <Button variant="ghost" size="icon" onClick={handleUpdateBudget}><Check className='h-4 w-4 text-green-500'/></Button>
                 <Button variant="ghost" size="icon"
                 onClick={handleCancel}
                 ><X className='h-4 w-4 text-red-500'/></Button>
            </div>               
         ):(
           
            isLoading ? (
              <div className="flex items-center space-x-2 animate-pulse">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
            ):
            
            (
             <>
             <CardDescription>
              {initialBudget ? `₹${expenses.toFixed(2)} of   ₹${initialBudget.amount.toFixed(2)} spent` : "No Budget Set" }
             </CardDescription>
             <Button
              variant="ghost"
              size="icon"
              onClick={()=>setIsEditing(true)}
              className='h-6 w-6'
              >
              <Pencil className='h-3 w-3'/>
             </Button>
            </>
            )
           
         )
        }
        </div>
     </div>
  </CardHeader>
  <CardContent>
    {
      initialBudget &&  (<div>
         <Progress 
         className='space-y-2'
         value={percentagedUSed} 
          extraStyles={
             ` ${percentagedUSed >= 90 ? 'bg-red-500' : percentagedUSed>=75 ?'bg-orange-500' 
             : 'bg-green-500'
             }`
          }
         />
         <p className='text-sm text-muted-foreground mt-2 text-right'> {
            percentagedUSed.toFixed(2) 
          }% used</p>
      </div>)
    }
  </CardContent>
</Card>
    </div>
  )
}

export default BudgetProgress