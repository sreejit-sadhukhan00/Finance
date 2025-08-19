'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction } from '@/types'
import { endOfDay, startOfDay, subDays, format } from 'date-fns';
import { IndianRupeeIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge"

type DateRangeKey = "7D" | "1M" | "3M" | "6M" | "ALL";

const DATE_RANGES = {
    "7D":{label:"Last 7 Days", day:7},
    "1M":{label:"Last Month", day:30},
    "3M":{label:"Last 3 Months", day:90},
    "6M":{label:"Last 6 Months", day:180},
    ALL:{label:"All Time", day:null} 
} as const;

function ChartPage({transactions}: {transactions: Transaction[]}) {
  const [dateRange, setDateRange] = useState<DateRangeKey>("3M");
  
const filteredData=useMemo(()=>{
    // get the date range based on the selected dateRange
    const range:typeof DATE_RANGES[DateRangeKey]= DATE_RANGES[dateRange];
    const now = new Date();
    // calculate the start date based on the range
    const startDate=range.day ? startOfDay(subDays(now, range.day)) : startOfDay(new Date(0)); 
   
    // filter transactions based on the date range
    const filtered=transactions.filter((t)=>(
       new Date(t.date) >=startDate && new Date(t.date)<=endOfDay(now)
    ));
    
    // group transactions by date and calculate income and expense totals
    const grouped=filtered.reduce((acc:any, transaction)=>{
         const date=format(new Date(transaction.date), "MMM dd");
            if(!acc[date]){
                acc[date]={date, income:0, expense:0};
            }
          if(transaction.type === "INCOME"){
            acc[date].income += transaction.amount;
          }
          else{
             acc[date].expense += transaction.amount;
          }
          return acc;
    }, {});

    return Object.values(grouped).sort((a:any,b:any)=>new Date(a.date).getTime()-new Date(b.date).getTime());
},[transactions,dateRange])

 const totals:any=useMemo(()=>{
   return filteredData.reduce((acc:any,day:any)=>({
        income:acc.income +day.income,
        expense:acc.expense +day.expense
   }),{income:0, expense:0});
 },[filteredData]);

  return (
  <Card className="backdrop-blur-sm bg-white/30 shadow-xl">
    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-8'>
      <div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Transaction Overview
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Your financial summary for the selected period
        </p>
      </div>
      <Select 
        defaultValue={dateRange}
        onValueChange={(value)=>setDateRange(value as DateRangeKey)}
      >
        <SelectTrigger className="w-[180px] bg-white/50 backdrop-blur-sm">
          <SelectValue placeholder="Select timeframe" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(DATE_RANGES).map(([key,value])=>(
            <SelectItem key={key} value={key}>
              {value.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </CardHeader>
    <CardContent>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='grid grid-cols-3 gap-4 mb-8'
      >
        {/* income */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className='p-4 rounded-lg bg-white/40 backdrop-blur-sm shadow-lg'
        >
          <p className='text-sm font-medium text-muted-foreground mb-2'>Total Income</p>
          <p className='text-2xl font-bold text-green-500'>
            ₹{totals.income.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
          <Badge variant="secondary" className="mt-2">+{((totals.income/totals.expense)*100).toFixed(0)}%</Badge>
        </motion.div>

        {/* expense */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className='p-4 rounded-lg bg-white/40 backdrop-blur-sm shadow-lg'
        >
          <p className='text-sm font-medium text-muted-foreground mb-2'>Total Expenses</p>
          <p className='text-2xl font-bold text-red-500'>
            ₹{totals.expense.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
          <Badge variant="secondary" className="mt-2">Expenses</Badge>
        </motion.div>

        {/* net */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className='p-4 rounded-lg bg-white/40 backdrop-blur-sm shadow-lg'
        >
          <p className='text-sm font-medium text-muted-foreground mb-2'>Net Balance</p>
          <p className={`text-2xl font-bold ${totals.income-totals.expense>=0 ? "text-green-500" : "text-red-500"}`}>
            ₹{(totals.income-totals.expense).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
          <Badge variant="secondary" className="mt-2">Net Worth</Badge>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='h-[300px] p-4 rounded-lg bg-white/40 backdrop-blur-sm shadow-lg'
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="opacity-30" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              stroke="#64748b"
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
              stroke="#64748b"
            />
            <Tooltip
              formatter={(value) => [`₹${value}`, undefined]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "8px",
                padding: "8px",
                border: "none",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Legend 
              wrapperStyle={{
                paddingTop: "20px"
              }}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </CardContent>
  </Card>)
}

export default ChartPage;