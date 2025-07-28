'use client'

import React from 'react'
import { statsData } from "@/data/landing";
import CountUp from 'react-countup';
function Stats() {
    
  // helper function for the animations
 function parseCountValue(value: string): number {
  const num = parseFloat(value.replace(/[^0-9.]/g, ''));
  if (value.toUpperCase().includes('K')) return num * 1_000;
  if (value.toUpperCase().includes('M')) return num * 1_000_000;
  if (value.toUpperCase().includes('B')) return num * 1_000_000_000;
  return num;
}
// helper function for stats animation 
function getSuffix(value: string): string {
  const match = value.match(/[^\d.]+$/);
  return match ? match[0] : '';
}
  return (
  <section>
    <div>
      <div className="flex justify-around gap-6">
        {statsData.map((stat, index) => {
          const number = parseCountValue(stat.value);
          const suffix = getSuffix(stat.value);
          const label = stat.label;

          return (
            <div key={index} className="space-y-1 mt-[-20]">
              <h3 className="text-2xl md:text-3xl font-bold">
                <span className="text-gray-600">
                  <CountUp
                    start={0}
                    end={number}
                    duration={4}
                    separator=","
                    decimals={stat.value.includes('.') ? 1 : 0}
                  />
                </span>
                <span className="text-black font-semibold">{suffix}</span>
              </h3>
              <p className="text-black text-xl font-bold ">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
  )
}

export default Stats