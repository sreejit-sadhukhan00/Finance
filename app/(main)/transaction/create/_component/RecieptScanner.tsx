'use client'

import { ScanReciept } from '@/actions/transaction';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { ScannedReceipt } from '@/types';
import { Camera, Loader2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner';

function RecieptScanner({onScanComplete}: {onScanComplete: (data: ScannedReceipt) => void}) {

    const fileref = useRef<HTMLInputElement>(null);
    const {
        loading:fileloading,
        data:scannedData,
        fn:ScaningFunc
    }=useFetch(ScanReciept);
    const handleReceiptScan=async(  file: File)=>{
         if(file.size > 10 * 1024 * 1024) {
            toast.error("File size exceeds 5MB limit. Please upload a smaller file.");
            return;
         }
         await ScaningFunc(file);
    }
    useEffect(()=>{
     if(scannedData && !fileloading) {
        if(scannedData.isReceipt){
            onScanComplete(scannedData?.data as ScannedReceipt);
               toast.success("Receipt scanned successfully!");
        }else{
             toast.error(scannedData.message || "Provide a Valid Reciept.");
        }
     }
    },[fileloading, scannedData]);
  return (
    <div className='w-full flex justify-center items-center px-4 sm:px-6'>
         <input 
           type="file" 
           ref={fileref} 
           className='hidden'
           accept='image/*'
           capture='environment'
           onChange={(e)=>{
             const file=e.target.files?.[0];
             if(file) handleReceiptScan(file);
           }}
         />
         <Button 
          onClick={() => fileref.current?.click()}
           className="
             relative w-full max-w-xl
             px-6 py-4
             bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600
             hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500
             text-white font-semibold
             rounded-xl
             shadow-lg shadow-purple-500/30
             hover:shadow-fuchsia-500/40
             transform hover:-translate-y-0.5 
             transition-all duration-300 ease-out
             border border-white/10
             group
             disabled:opacity-70 disabled:cursor-not-allowed
             focus:outline-none focus:ring-4 focus:ring-purple-300
           "
           disabled={fileloading}
         >
           <div className="flex items-center justify-center space-x-2">
             {fileloading ? (
               <>
                 <Loader2 className='w-5 h-5 animate-spin' />
                 <span className="tracking-wide">Scanning Receipt...</span>
               </>
             ) : (
               <>
                 <Camera className='w-5 h-5 transition-transform group-hover:scale-110 duration-300' />
                 <span className="tracking-wide">Scan Receipt With AI</span>
               </>
             )}
           </div>
           <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/20 via-transparent to-fuchsia-600/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
         </Button>
    </div>
  )
}

export default RecieptScanner