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
        <nav className='fixed w-svw'>
            <div className='flex justify-between px-5 lg:px-10 py-5 shadow-md backdrop-blur-sm'>
                <Link href="/" className='flex justify-center items-center'>Mystry message</Link>
                {
                    session ? (
                        <>

                            <span className=' flex justify-center items-center'>Welcome, {user?.username || user?.email}</span>
                            <div className='flex justify-center items-center space-x-1'>
                                <Button onClick={() => signOut()}>Logout</Button>
                                <ModeToggle />
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href={'/sign-in'}>Sign in</Link>
                        </>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar
