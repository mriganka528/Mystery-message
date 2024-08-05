'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
useSession
import { User } from 'next-auth'
import { Button } from '../ui/button'
const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User
    return (
        <nav>
            <div>
                <a href="/">Mystry message</a>
                {
                    session ? (
                        <>

                            <span>Welcome, {user?.username || user?.email}</span>
                            <Button onClick={() => signOut()}>Logout</Button>
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
