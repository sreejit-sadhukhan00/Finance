'use client'

import React, { useState } from 'react'
import { Wallet } from 'lucide-react' // Added icon import
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button';
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountschema } from '@/lib/formschema';
import z from 'zod';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
function CreateAccountDrawer({children}: {children: React.ReactNode}) {

const {register,
    handleSubmit,
    formState:{errors},
    watch,
    reset,
    setValue
}
= useForm({
    resolver:zodResolver(accountschema),
    defaultValues:{
        name: '',
        type: 'CURRENT',
        balance: '0',
        isDefault: false,
    }
 })

const[open,setopen] =useState(false);































  return (
    <Drawer open={open} onOpenChange={setopen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-center"> {/* Added centered alignment */}
          <Wallet className="w-6 h-6 mx-auto mb-2" /> {/* Added wallet icon */}
          <DrawerTitle className="text-2xl font-bold">Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-2"> {/* Added padding */}
          <form className="space-y-4"> {/* Added vertical spacing */}
            {/* name */}
            <div className="space-y-2"> {/* Added spacing between label and input */}
              <label htmlFor="name" className="text-md  font-medium">Account Name</label>
              <Input 
                id="name"
                placeholder='Enter account name'
                className="w-full" /* Added full width */
                {...register('name')}
              />
              {errors.name && (
                <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
              )}
            </div>

            {/* account type */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-md  font-medium">Account Type</label>
              <Select 
                onValueChange={(value: "CURRENT" | "SAVINGS")=>setValue('type',value)}
                defaultValue={watch('type')}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Choose Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">CURRENT</SelectItem>
                  <SelectItem value="SAVINGS">SAVINGS</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className='text-red-500 text-sm mt-1'>{errors.type.message}</p>
              )}
            </div>

            {/* initial balance */}
            <div className="space-y-2">
              <label htmlFor="balance" className="text-md  font-medium">Initial Balance</label> {/* Fixed label text */}
              <Input 
                id="balance"
                type='number'
                placeholder='Enter initial balance'
                step="0.01"
                className="w-full"
                {...register('balance')}
              />
              {errors.balance && (
                <p className='text-red-500 text-sm mt-1'>{errors.balance.message}</p>
              )}
            </div>

            {/* is default account */}
            <div className='flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 py-2'> {/* Improved layout */}
              <div className="space-y-1">
                <label htmlFor="isDefault" className="text-md  font-medium">Set As Default Account</label>
                <p className="text-sm text-gray-400">This Account will be selected as default for transactions</p>
              </div>
              <Switch 
                id="isDefault"
                onCheckedChange={(checked: boolean)=>setValue('isDefault',checked)}
                checked={watch('isDefault')}
              />
            </div>

            {/* Added form actions */}
            <div className="flex justify-end space-x-2 pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button type="submit">Create Account</Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
   
  )
}

export default CreateAccountDrawer;