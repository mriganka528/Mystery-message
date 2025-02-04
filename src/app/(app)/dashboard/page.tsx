'use client';
import MessageCard from '@/components/messageCard/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/models/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { LayoutDashboard, Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
function Page() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const { toast } = useToast();
    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };
    const { data: session } = useSession();
    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    });
    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            setValue('acceptMessages', response.data.isAcceptingMessages);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || 'Failed to fetch message setting',
                variant: 'destructive'
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, toast]);

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(response.data.messages || []);
            if (refresh) {
                toast({
                    title: 'Refreshed messages',
                    description: 'Showing latest messages',
                    variant: 'default'
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || 'Failed to fetch message setting',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
            setIsSwitchLoading(false);
        }
    }, [setIsLoading, setMessages, toast]);
    //To fatch initial value from the server;
    useEffect(() => {
        if (!session || !session.user) {
            return;
        }
        fetchMessages();
        fetchAcceptMessage();
    }, [session, setValue, fetchAcceptMessage, fetchMessages]);

    // Handle switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            });
            setValue('acceptMessages', !acceptMessages);
            toast({
                title: response.data.message,
                variant: 'default'
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || 'Failed to fetch message setting',
                variant: 'destructive'
            });
        }
    };

    const [profileUrl, setProfileUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // const username = (session?.user as User)?.name || 'defaultUsername';
            const username = session?.user.username
            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            setProfileUrl(`${baseUrl}/u/${username}`);
        }
    }, [session]);

    const copyToClipboard = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(profileUrl);
            toast({
                title: 'URL copied',
                description: 'Profile URL has been copied to clipboard'
            });
        }
    };

    if (!session || !session.user) {
        return;
    }

    return (
        <div className="mt-32">
            <motion.div initial={{ opacity: 0.0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.1,
                    duration: 0.7,
                    ease: "easeInOut",
                }} className=' flex justify-center items-center gap-x-2'>
                <Image src={'/assets/undraw_welcoming.svg'} alt='welcome image' height={55} width={55}></Image>
                <h1 className='text-center antialiased text-xl font-medium ' >Welcome, {session.user.username}</h1>
            </motion.div>
            <div className='my-8 mx-0 sm:mx-4  lg:mx-auto pt-10 p-6 lg:border-l-2  border-l-0 pl-6 rounded w-full max-w-5xl'>
                <motion.div initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.1,
                        duration: 0.7,
                        ease: "easeInOut",
                    }} className=' flex items-center '>
                    <LayoutDashboard className=' h-7 w-7 antialiased inline' />
                    <span className=" text-2xl sm:text-3xl pl-2 antialiased font-semibold ">User Dashboard</span>
                </motion.div>
                <motion.div initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.1,
                        duration: 0.7,
                        ease: "easeInOut",
                    }} className="mb-4 mt-10">
                    <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={profileUrl}
                            disabled
                            className="input input-bordered w-full p-2 mr-2"
                        />
                        <Button onClick={copyToClipboard}>Copy</Button>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.1,
                        duration: 0.7,
                        ease: "easeInOut",
                    }} className="mb-4">
                    <Switch
                        {...register('acceptMessages')}
                        checked={acceptMessages}
                        onCheckedChange={handleSwitchChange}
                        disabled={isSwitchLoading}
                    />
                    <span className="ml-2">
                        Accept Messages: {acceptMessages ? 'On' : 'Off'}
                    </span>
                </motion.div>
                <motion.div initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.1,
                        duration: 0.7,
                        ease: "easeInOut",
                    }}>
                    <Separator />
                </motion.div>
                <motion.div initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.1,
                        duration: 0.7,
                        ease: "easeInOut",
                    }}>
                    <Button
                        className="mt-10"
                        variant="outline"
                        onClick={(e) => {
                            e.preventDefault();
                            fetchMessages(true);
                        }}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCcw className="h-4 w-4" />
                        )}
                    </Button>
                </motion.div>
                <motion.div initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.1,
                        duration: 0.7,
                        ease: "easeInOut",
                    }} className="mt-4  grid grid-cols-1 md:grid-cols-2 gap-6">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <MessageCard
                                key={message._id}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                            />
                        ))
                    ) : (
                        <div>

                            <p className='mb-10'>No messages to display.</p>
                            <Image src={'/assets/undraw_void.svg'} alt='Nothing' height={150} width={150}></Image>
                        </div>
                    )}
                </motion.div>
            </div>

        </div >
    );
}

export default Page;
