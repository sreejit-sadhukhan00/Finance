'use client'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { LayoutDashboard, PenBox } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion' // Import framer-motion

function Header() {
  // Animation variants for header items
  const headerItemVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 27 }
    }
  };

  // Animation variant for border
  const borderVariants = {
    initial: { scaleX: 0 },
    animate: { 
      scaleX: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  return (
    <div className='fixed top-0 w-full backdrop-blur-md bg-white/90 z-50 '>
      {/* Animated border bottom */}
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[80%] h-[2px] bg-gray-300 origin-center"
        initial="initial"
        animate="animate"
        variants={borderVariants}
      />
      
      <nav className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
        {/* Logo section with animation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={headerItemVariants}
          className="flex items-center gap-2"
        >
          <Link href='/' className="flex items-center gap-3">
            <Image
              className="h-20 w-20 transition-transform hover:scale-105 mt-0"
              src='/logo.png'
              alt='Logo'
              width={120}
              height={120}
              priority
            />
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
              className="text-xl font-bold font-serif hover:transition-transform hover:scale-105 cursor-pointer"
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 inline-block text-transparent bg-clip-text">
                Spend
              </span>{' '}
              <span className="text-gray-800">
                Money Smartly
              </span>
            </motion.div>
          </Link>
        </motion.div>

        <div>
          {/* Sign Out State */}
          <SignedOut>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={headerItemVariants}
            >
              <SignInButton forceRedirectUrl={'/dashboard'}>
                <Button className="font-serif font-semibold px-6 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer">
                  Login
                </Button>
              </SignInButton>
            </motion.div>
          </SignedOut>

          {/* Signed In State */}
          <div className='flex items-center justify-center gap-4'>
            <SignedIn>
              {/* Dashboard Button */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={headerItemVariants}
                transition={{ delay: 0.1 }}
              >
                <Link href={'/dashboard'}>
                  <Button className="font-serif font-semibold px-6 py-2.5 bg-white text-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer">
                    <LayoutDashboard size={20} className="mr-2"/>
                    <span className='hidden md:inline'>Dashboard</span>
                  </Button>
                </Link>
              </motion.div>

              {/* Add Transaction Button */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={headerItemVariants}
                transition={{ delay: 0.2 }}
              >
                <Link href={'/transaction/create'}>
                  <Button className="font-serif font-semibold px-6 py-2.5 bg-black text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer border-2 border-black">
                    <PenBox size={20} className="mr-2"/>
                    <span className='hidden md:inline'>Add Transaction</span>
                  </Button>
                </Link>
              </motion.div>

              {/* User Button */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={headerItemVariants}
                transition={{ delay: 0.3 }}
              >
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10',
                      userButtonAvatarImage: 'rounded-full shadow-md',
                      userButtonAvatarBox: 'w-10 h-10 ring-2 ring-offset-2 ring-[#2d3748] transition-all duration-300 hover:ring-4',
                    }
                  }}
                  showEmail={true}
                />
              </motion.div>
            </SignedIn>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header