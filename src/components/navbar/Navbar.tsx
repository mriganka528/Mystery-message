'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
useSession
import { User } from 'next-auth'
import { Button } from '../ui/button'
import { ModeToggle } from '../toggleTheme/ToggleTheme'
const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User
    return (
        <nav className='fixed w-svw z-50'>
            <div className='flex  justify-between px-5 lg:px-10 py-5 shadow-md dark:shadow-gray-800 dark:shadow backdrop-blur-sm'>
                <Link href="/" className='flex justify-center items-center antialiased font-bold text-xl  '>MysticPulse</Link>
                {
                    session ? (
                        <>
                            <div className='flex justify-center items-center space-x-3'>
                                <Button onClick={() => signOut()}>Logout</Button>
                                <ModeToggle />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='flex justify-center items-center space-x-3'>
                                <Link href={'/sign-in'} className=' flex justify-center items-center bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-3 py-2 rounded'>Sign in</Link>
                                <ModeToggle />
                            </div>
                        </>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar
