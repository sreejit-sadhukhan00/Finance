'use client'
import { Transaction } from '@/types'
import { endOfDay, startOfDay, subDays, format } from 'date-fns';
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

console.log(filteredData)
 const totals=useMemo(()=>{
   return filteredData.reduce((acc:any,day:any)=>({
        income:acc.income +day.income,
        expense:acc.expense +day.expense
   }),{income:0, expense:0});
 },[filteredData]);

  return (
    <div>

        {/* <ResponsiveContainer width="100%" height="100%">
            <BarChart
            //   data={}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, undefined]}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer> */}
    </div>
  )
}

export default ChartPage;