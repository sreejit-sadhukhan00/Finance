'use client'
import Hero from "@/component/Hero";
import Stats from "@/component/Stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuresData, howItWorksData, testimonialsData } from "@/data/landing";
import { motion } from "framer-motion"; // Add this import
import Link from "next/link";

export default function Home() {
  return (
   <>
      <div className="">
           <section>
            <Hero/>
            <Stats/>
           </section>
        <section className="mt-10 max-w-5xl mx-auto">
            <div>
               <h2 className="ml-5 text-3xl font-serif -tracking-tight text-center font-md">
                 Everything You Need To Manage Your Finances At One Place
                 <div className="h-1 w-48 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-2 animate-slide"></div>
               </h2>
               <div className="grid grid-cols-3 m-4 md:grid-cols-3 gap-6 justify-center">
                 {featuresData.map((feature,index)=>(
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300 h-76">
                      <CardContent className="p-6">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-left text-gray-600 leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                 ))}
               </div>
            </div>
        </section>
{/* how it works section  */}

        <section className="mt-10 bg-blue-50">
            <div className="max-w-5xl mx-auto p-6">
               <h2 className="ml-5 text-3xl font-serif -tracking-tight text-center font-md">
                 How It Works
                 <div className="h-1 w-48 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-2 animate-slide"></div>
               </h2>
               <div className="grid grid-cols-3 m-4 md:grid-cols-3 gap-6 justify-center">
                 {howItWorksData.map((work,index)=>(
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                   <div className="border-2 border-blue-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300" key={index}>
                      <div>{work.icon}</div>
                      <h3 className="text-lg font-bold tracking-tighter md:left ">{work.title}</h3>
                      <p className="text-gray-600 leading-relaxed md:text-left ">
                        {work.description}
                      </p>
                   </div>
                  </motion.div>

                 ))}
               </div>
            </div>
        </section>

     {/* testimonials section */}

            <section className="mt-10 max-w-5xl mx-auto p-6">
  <div>
    <h2 className="ml-5 text-3xl font-serif -tracking-tight text-center font-md">
      What Our Users Say
      <div className="h-1 w-48 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-2 animate-slide"></div>
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {testimonialsData.map((testimonial, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{testimonial.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{testimonial.role}</p>
                <p className="text-gray-600 leading-relaxed text-center italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
</section>
       
{/* last section  */}

    <section className="mt-10 bg-black">
            <div className="max-w-5xl mx-auto p-6">
               <h2 className="ml-5 text-3xl font-serif -tracking-tight text-center font-md text-white">
                Ready to Take Control of Your Finances?
                 <div className="h-1 w-48 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-2 animate-slide"></div>
               </h2>
          <Link href="/dashboard"
          className="flex justify-center mt-8">
          
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 animate-bounce cursor-pointer "
            >
              Start Free Trial
            </Button>
          </Link>
            </div>
        </section>

      </div>
   </>
  );
}
