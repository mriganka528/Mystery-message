'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import React, { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
const Page = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsename] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 500)
    const { toast } = useToast();
    const router = useRouter();
    //zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })
    useEffect(() => {
        const checkUsernameUniqueness = async () => {
            if (username) {
                setIsCheckingUsename(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/check-username-uniqueness?username=${username}`)
                    let message = response.data.message
                    setUsernameMessage(message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    )
                } finally {
                    setIsCheckingUsename(false)
                }
            }
        }
        checkUsernameUniqueness()
    }
        , [username])
    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            toast({
                title: 'Success',
                description: response.data.message
            })
            router.replace(`/verify/${username}`)
            setIsSubmitting(false);
        } catch (error) {
            console.error("Error in sign up of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message
            toast({
                title: 'signup failed',
                description: errorMessage,
                variant: "destructive"
            })
            setIsSubmitting(false)
        }
    }
    return (
        <div className=" flex flex-col justify-evenly sm:justify-around items-center min-h-screen  ">
            <motion.div initial={{ opacity: 0.0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.1,
                    duration: 0.7,
                    ease: "easeInOut",
                }} className="mt-3 w-full flex   justify-center  ">
                <Link href={'/'} className=" shadow-md dark:shadow-gray-900 px-4 sm:px-0 flex justify-center md:w-[30%] space-x-2 pb-3 rounded-sm items-center">

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
                }} className=" w-full max-w-md p-8 space-y-8  rounded-lg dark:shadow-gray-900 shadow-md">
                <div className="text-center">
                    <h1 className=" mb-6">Join Mystery message</h1>
                    <p className=" mb-4">Signup to start your anonymous adventure</p>
                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="username"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="username" {...field} onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }} />
                                        </FormControl>
                                        {isCheckingUsername && <Loader2 className=" animate-spin" />}
                                        <p className={`text-sm ${usernameMessage === "Username is available" ? 'text-green-500' : 'text-red-500'}`}>
                                            {usernameMessage}
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting}>
                                {
                                    isSubmitting ? (<>
                                        <Loader2 className=" mr-2 h-4 w-5 animate-spin" /> Please wait
                                    </>) : ('Sign Up')
                                }
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center mt-4">
                        <p>
                            Already a member?{' '}
                            <Link href={'/sign-in'} className=" text-blue-600 hover:text-blue-800">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Page
