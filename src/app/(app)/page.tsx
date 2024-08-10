"use client"
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "@/data/messages.json"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card";
import { CheckCheck, MessageSquare, User as Prf } from "lucide-react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
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
    <main className=" mt-20 h-svh flex flex-col justify-between">
      <div className="mt-10 flex justify-center  ">
        <div className=" shadow-md dark:shadow-gray-800 flex justify-center w-[30%] space-x-2 pb-3 rounded-sm items-center">
          <Image src={'/assets/undraw_moving_forward.svg'} alt="Loading" height={55} width={55}></Image>
          <h1 className="text-4xl antialiased text-left  font-bold ">MysticPulse</h1>
        </div>
      </div>
      <div className="w-svw flex justify-center space-x-[7rem] items-center mt-20">
        <div className="flex justify-center  space-x-8  antialiased items-center  border-l-2 max-w-[45%]">
          <Image src={'/assets/undraw_mobile_content_xvgr.svg'} height={280} width={280} alt="Loading"></Image>
          <div>
            <h1 className="text-2xl antialiased">Dive into the unexplained with StrangeSignal, the app that uncovers the secrets behind every message</h1>
            <div className="mt-7">
              <Link className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-3 rounded " href={"/sign-up"}>Join MysticPulse</Link>
            </div>
          </div>
        </div>
        <div>
          <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full max-w-xs">
            <CarouselContent>
              {messages.messages.map((message: CustomMessage) => (
                <CarouselItem key={message.id}>
                  <div className="py-1">
                    <Card>
                      <CardContent className="flex flex-col gap-y-3 antialiased justify-center px-6 py-12">
                        <div>
                          <Prf className="inline h-5 w-5 antialiased  " />
                          <span className="text-md font-bold ml-2">{message.title}</span>
                        </div>
                        <div>
                          <MessageSquare className=" inline h-5 w-5 antialiased " />
                          <p className="inline ml-2  antialiased font-medium">{message.content}</p>
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
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
      <div className="flex justify-between py-2.5 px-9 items-center bg-gray-50 dark:bg-[#21212135] backdrop-blur-sm">
        <Link href={'/'}>
          <Image src={'/assets/undraw_moving_forward.svg'} alt="Loading" height={50} width={50}></Image>
        </Link>
        <span className="dark:text-gray-400 text-gray-600 antialiased"> © 2023 True Feedback. All rights reserved. </span>
      </div>
    </main>
  );
}
