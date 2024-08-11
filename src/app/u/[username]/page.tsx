"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema } from '@/schemas/messageSchema';
import { z } from 'zod';
import { useParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from '@/components/ui/use-toast';
const page = () => {
    const params = useParams<{ username: string }>();
    const username = params.username;
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema)
    })
    const messageContent = form.watch('content');
    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            setLoading(true);
            const response = await axios.post<ApiResponse>('/api/send-message', {
                content: messageContent,
                username
            })
            toast({
                description: response.data.message,
            })
            console.log(response);
            form.reset({ ...form.getValues(), content: '' })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message ?? 'Failed to send message',
                variant: "destructive"
            })
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <div className="mt-10 flex justify-center  ">
                <div className=" shadow-md dark:shadow-gray-900 flex justify-center w-[30%] space-x-2 pb-3 rounded-sm items-center">
                    <Image src={'/assets/undraw_moving_forward.svg'} alt="Loading" height={55} width={55}></Image>
                    <h1 className="text-4xl antialiased text-left  font-bold ">MysticPulse</h1>
                </div>
            </div>
            <div className=' flex justify-center gap-x-2 items-center mt-20'>
                <Image src={'/assets/undraw_link_shortener.svg'} alt='profile link image' height={48} width={48}></Image>
                <span className=' text-3xl'>Public Profile Link</span>
            </div>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write your anonymous message here"
                                            className="resize-none"
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
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page
