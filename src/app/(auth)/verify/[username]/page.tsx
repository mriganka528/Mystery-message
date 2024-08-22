'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
const Page = () => {
    const [isSubmitting, setIsSubmitting]= useState(false);
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })
            toast({
                title: 'Success',
                description: response.data.message
            })
            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title: 'verification failed',
                description: errorMessage,
                variant: "destructive"
            })
        }
        setIsSubmitting(false)
    }
    return (
        <div className=" flex justify-center flex-col space-y-5 items-center min-h-screen ">
            <motion.div initial={{ opacity: 0.0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.1,
                    duration: 0.7,
                    ease: "easeInOut",
                }} className="mt-2 w-full  flex justify-center mx-11  ">
                <Link href={'/'} className=" shadow-md px-4 sm:px-0  dark:shadow-gray-900 flex justify-center md:w-[30%] space-x-2 pb-3 rounded-sm items-center">
                    <Image src={'/assets/undraw_moving_forward.svg'} alt="Loading" height={55} width={55} className=" h-[35px] w-[35px] sm:h-[55px] sm:w-[55px]"></Image>
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl antialiased text-left  font-bold ">MysticPulse</h1>
                </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.1,
                    duration: 0.7,
                    ease: "easeInOut",
                }} className=" w-full max-w-md p-8 space-y-8 border dark:shadow-gray-900 rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className=" mb-6">Verify your account</h1>
                    <p className=" mb-4">Enter your verification code</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="code" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                           <Button type="submit" disabled={isSubmitting}>
                                {
                                    isSubmitting ? (<>
                                        <Loader2 className=" mr-2 h-4 w-5 animate-spin" /> Please wait
                                    </>) : ('Submit')
                                }
                            </Button>
                    </form>
                </Form>
            </motion.div>
        </div>
    )
}

export default Page
