import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Logo() {
  return (
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
  )
}