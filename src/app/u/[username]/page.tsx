"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCwSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema } from '@/schemas/messageSchema';
import { z } from 'zod';
import { useParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from '@/components/ui/use-toast';
import sampleMessages from '@/data/sampleMessages.json';
import Link from 'next/link';

const Page = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post<ApiResponse>('/api/send-message', {
        content: messageContent,
        username,
      });
      toast({
        description: response.data.message,
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRandomMessages = () => {
    const shuffled = [...sampleMessages.questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  const [displayMessages, setDisplayMessages] = useState<string[]>([]);

  useEffect(() => {
    setDisplayMessages(getRandomMessages());
  }, []);

  const handleRefresh = () => {
    setDisplayMessages(getRandomMessages());
  };

  const handleCopy = (message: string) => {
    form.setValue('content', message);
    toast({
      title: "Message copied successfully"
    })
  };

  return (
    <div >
      <div className="mt-10 flex justify-center">
        <div className="shadow-md dark:shadow-gray-900 flex justify-center w-[30%] space-x-2 pb-3 rounded-sm items-center">
          <Image
            src={'/assets/undraw_moving_forward.svg'}
            alt="Loading"
            height={55}
            width={55}
          />
          <h1 className="text-4xl antialiased text-left font-bold">MysticPulse</h1>
        </div>
      </div>
      <div className="flex justify-center gap-x-2 items-center mt-20">
        <Image
          src={'/assets/undraw_link_shortener.svg'}
          alt="profile link image"
          height={48}
          width={48}
        />
        <span className="text-3xl antialiased">Public Profile Link</span>
      </div>
      <div className="px-10 sm:px-14">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="py-2 antialiased">
                    Send Anonymous Message to @{username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none antialiased"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {loading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" disabled={loading || !messageContent}>
                  Send It
                </Button>
              )}
              <div className=' ml-3'>
                  <Button type='button' variant={'destructive'} onClick={()=>{form.setValue('content',' ')}}> Clear text</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <div className="flex flex-col justify-center items-center mt-24">
        <Image
          src={'/assets/undraw_new_message.svg'}
          alt="Image"
          height={250}
          width={250}
        />
        <div className="mt-14 mb-10">
          <Button variant={'secondary'} size={'lg'} onClick={handleRefresh}>
            Suggest Message
          </Button>
        </div>
        <div className="my-4 w-[41%]">
          <RotateCwSquare className="inline mr-1" />
          <span className=' antialiased '>Click on any message below to select it</span>
        </div>
        <ul className="border shadow-md dark:shadow-gray-900 rounded-md py-10 px-20">
          {displayMessages.map((mes, index) => (
            <li
              onClick={() => {
                handleCopy(mes);
              }}
              className=" border  shadow-md dark:shadow-gray-900 antialiased hover:dark:bg-slate-950 hover:bg-gray-100 rounded py-4 my-6 px-6"
              key={index}
            >
              {mes}
            </li>
          ))}
        </ul>
        <div className="my-16 shadow-md dark:shadow-gray-900 border py-6 px-16 rounded-md">
          <h1 className="mb-7">Get Your Message board</h1>
          <Link
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-3 rounded"
            href={'/sign-up'}
          >
            Create your account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
