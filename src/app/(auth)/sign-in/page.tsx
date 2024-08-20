'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as  z from 'zod'
const Page = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        if (result?.error) {
            toast({
                title: "Login failed",
                description: "Incurrect username or password",
                variant: "destructive"
            })
        }
        if (result?.url) {

            router.replace('/dashboard')
        }
    }
    return (
        <div className=" flex  flex-col justify-evenly sm:justify-around items-center min-h-screen   ">
            <div className="mt-2 w-full  flex justify-center  ">
                <Link href={'/'} className=" shadow-md px-4 sm:px-0  dark:shadow-gray-900 flex justify-center md:w-[30%] space-x-2 pb-3 rounded-sm items-center">
                    <Image src={'/assets/undraw_moving_forward.svg'} alt="Loading" height={55} width={55} className=" h-[35px] w-[35px] sm:h-[55px] sm:w-[55px]"></Image>
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl antialiased text-left  font-bold ">MysticPulse</h1>
                </Link>
            </div>
            <div className=" w-full max-w-sm p-8 space-y-8 dark:shadow-gray-900 rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className=" mb-6">Join MysticPulse</h1>
                    <p className=" mb-4">Sign in to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="email/username" {...field} />
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
                        <Button type="submit">Sign In</Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Not a member yet?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page
