'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2, X } from 'lucide-react'
import { Message } from '@/models/User'
import { useToast } from '../ui/use-toast'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const { toast } = useToast();
    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title: response.data.message
        })
        onMessageDelete(message._id)
    }
    return (
        <Card className='shadow-md dark:shadow-gray-900'>
            <CardContent className='pt-6'>
                {message.content}
            </CardContent>
            <div className='flex justify-between pr-1'>
                <div className='pl-5 pb-2 flex  items-end'>
                    <span className='text-sm text-gray-400'> Delivered on : {new Date(message.createdAt).toLocaleDateString()} &nbsp;{new Date(message.createdAt).toLocaleTimeString()}</span>
                </div>
                <AlertDialog >
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size={'delt'}><Trash2 className='h-4 w-4' /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                data and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>


    )
}

export default MessageCard
