'use client'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { LayoutDashboard, PenBox } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Logo from './Logo'

export default function HeaderClient() {
  const headerItemVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 27 }
    }
  }
  const borderVariants = {
    initial: { scaleX: 0 },
    animate: { 
      scaleX: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  }

  return (
    <div className='fixed top-0 w-full backdrop-blur-md bg-white/90 z-50 '>
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[80%] h-[2px] bg-gray-300 origin-center"
        initial="initial"
        animate="animate"
        variants={borderVariants}
      />
      <nav className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={headerItemVariants}
          className="flex items-center gap-2"
        >
          <Logo />
        </motion.div>
        <div>
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
          <div className='flex items-center justify-center gap-4'>
            <SignedIn>
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