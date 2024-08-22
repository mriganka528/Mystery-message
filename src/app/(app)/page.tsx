"use client"
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import messages from "@/data/messages.json"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card";
import { CheckCheck, Loader2, MessageSquare, User as Prf } from "lucide-react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { motion } from 'framer-motion';
interface CustomMessage {
  id: number,
  title: string,
  content: string,
  received: string
}
export default function Home() {
  const { data: session } = useSession()
  const user: User = session?.user as User;

  return (

    <main className=" mt-20 h-screen flex flex-col justify-between">
      <motion.div initial={{ opacity: 0.0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
          duration: 0.7,
          ease: "easeInOut",
        }} className="mt-10 flex justify-center  ">
        <div className=" shadow-md dark:shadow-gray-900 px-4 sm:px-0 flex justify-center md:w-[30%] space-x-2 pb-3 rounded-sm items-center">
          <Image src={'/assets/undraw_moving_forward.svg'} alt="Loading" height={55} width={55} className=" h-[35px] w-[35px] sm:h-[55px] sm:w-[55px]"></Image>
          <h1 className=" text-xl sm:text-2xl md:text-3xl lg:text-4xl antialiased text-left  font-bold ">MysticPulse</h1>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
          duration: 0.7,
          ease: "easeInOut",
        }} className="w-svw flex flex-col lg:flex-row  justify-center lg:space-x-[5rem] items-center mt-1 sm:mt-20">
        <div className="flex justify-center space-x-3 sm:space-x-8 mx-9 sm:mx-0  antialiased items-center  border-l-2 max-w-[88%] md:max-w-[70%] lg:max-w-[45%]">
          <Image src={'/assets/undraw_mobile_content_xvgr.svg'} height={280} width={280} className="h-[200px] w-[200px] sm:h-[280px] sm:w-[280px]" alt="Loading"></Image>
          <div>
            <h1 className=" text-md sm:text-xl  md::text-2xl antialiased">Dive into the unexplained with StrangeSignal, the app that uncovers the secrets behind every message</h1>
            <div className="mt-7">
              {session ? (
                <Link className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 text-xs sm:text-base px-1.5 sm:px-4 py-3 rounded " href={"/dashboard"}>Join MysticPulse</Link>
              ) : (
                <Link className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 text-xs sm:text-base px-1.5 sm:px-4 py-3 rounded " href={"/sign-up"}>
                  Join MysticPulse
                </Link>
              )}

            </div>
          </div>
        </div>
        <div className="mt-16 lg:mt-0  flex justify-center items-center">
          <Carousel plugins={[Autoplay({ delay: 1500 })]} className="w-full  max-w-xs">
            <CarouselContent>
              {messages.messages.map((message: CustomMessage) => (
                <CarouselItem key={message.id} >
                  <div className="py-1">
                    <Card >
                      <CardContent className="flex flex-col gap-y-3 antialiased justify-center px-6 py-12">
                        <div>
                          <Prf className="inline h-5 w-5 antialiased  " />
                          <span className=" text-sm sm:text-base font-bold ml-2">{message.title}</span>
                        </div>
                        <div>
                          <MessageSquare className=" inline h-5 w-5 antialiased " />
                          <p className="inline ml-2   antialiased font-medium">{message.content}</p>
                        </div>
                        <div>
                          <CheckCheck className=" inline h-4 w-4 antialiased " />
                          <span className="text-sm ml-2 font-light antialiased">{message.received}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </motion.div>
      <div className="flex justify-between py-2.5 px-4 sm:px-9 items-center bg-gray-50 dark:bg-[#21212135] backdrop-blur-sm">
        <Link href={'/'}>
          <Image src={'/assets/undraw_moving_forward.svg'} alt="Loading" height={50} width={50} className=" h-[40px] w-[40px] sm:h-[50px] sm:w-[50px]" ></Image>
        </Link>
        <span className="dark:text-gray-400 text-sm sm:text-base text-gray-600 antialiased"> © 2023 MysticPulse. All rights reserved. </span>
      </div>
    </main>
  );
}
