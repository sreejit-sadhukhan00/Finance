"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { Raleway } from 'next/font/google'
import Image from 'next/image'
// Framer Motion imports for animations and scroll effects
import { motion, useScroll, useTransform } from 'framer-motion'

// Custom Google Font configuration
const raleway = Raleway({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900']
})

function Hero() {
  // Hook to track scroll position for scroll-based animations
  const { scrollY } = useScroll()
  
  // Transform scroll values into animation properties for smooth parallax effects
  const imageY = useTransform(scrollY, [0, 300], [0, -50])
  const imageScale = useTransform(scrollY, [0, 300], [1, 0.95])
  const imageOpacity = useTransform(scrollY, [0, 200], [1, 0.8])

  return (
    <div className={`pb-20 px-4 max-w-4xl mx-auto ${raleway.className} text-center`}>
       <div className='flex flex-col items-center
         '>
           <motion.h1 
             className='text-center font-black text-4xl md:text-5xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
           > 
             Smarter Spending Starts Here <br/>  Let AI Handle the Math!
           </motion.h1><br/>
           
           <motion.p 
             className='text-muted-foreground text-lg font-md '
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
           >
            Take charge of your finances with intelligence. Our AI-powered finance tracker analyzes your spending habits, offers personalized insights, and helps you budget smarter—without the spreadsheets. Whether you're saving for a goal or cutting back on overspending, our smart assistant makes managing money effortless and efficient.
           </motion.p>
       </div>
       {/* Button section with hover effects */}
       <div className='flex items-center justify-center gap-4'>
        <Link href="/dashboard">
       {/* Primary CTA button with hover animations */}
       <Button size="lg" className='mt-4 text-lg font-semibold hover:scale-108 hover:shadow-2xl cursor-pointer'>
           Get Started  
           </Button>
       </Link>
       <Link href="/dashboard">
       {/* Secondary CTA button with outline variant */}
       <Button size="lg" variant="outline" className='mt-4 text-lg font-semibold hover:scale-108 hover:shadow-2xl cursor-pointer'>
           Watch Demo 
           </Button>
       </Link>
       </div>

       {/* Hero image section with scroll-based animations */}
       <div className='hero-image-wrapper'>
           {/* Motion div that responds to scroll with parallax, scale, and opacity changes */}
           <motion.div 
             className="hero-image"
             style={{
               y: imageY,         
               scale: imageScale,   // Subtle zoom effect on scroll
               opacity: imageOpacity // Fade effect for depth
             }}
             initial={{ opacity: 0, y: 100 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
           >
               {/* Main hero banner image */}
               <Image 
               src='/image.png'
                alt='banner' 
                height={1280} 
                 width={720}
                 priority
                 className='rounded-lg mt-10 shadow-2xl mx-auto'
                 />
                 
           </motion.div>
       </div>
    </div>
  )
}

export default Hero