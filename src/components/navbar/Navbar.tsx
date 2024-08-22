'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
useSession
import { User } from 'next-auth'
import { Button } from '../ui/button'
import { ModeToggle } from '../toggleTheme/ToggleTheme'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 90) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <motion.nav variants={{
            visible: { y: 0 },
            hidden: { y: "-100%" },
        }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }} className='fixed  w-svw z-50'>
            <div className='flex  justify-between px-5 lg:px-10 py-5 shadow-md dark:shadow-gray-800 dark:shadow backdrop-blur-sm'>
                <Link href="/" className='flex justify-center items-center antialiased font-bold text-lg sm:text-xl  '>MysticPulse</Link>
                {
                    session ? (
                        <>
                            <div className='flex justify-center items-center space-x-3'>
                                <Button size={'sm'} onClick={() => signOut()}>Logout</Button>
                                <ModeToggle />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='flex justify-center items-center space-x-3'>
                                <Link href={'/sign-in'} className=' flex justify-center items-center bg-primary text-primary-foreground hover:bg-primary/90  py-2 h-9 rounded-md px-3 '>Sign in</Link>
                                <ModeToggle />
                            </div>
                        </>
                    )
                }
            </div>
        </motion.nav>
    )
}

export default Navbar
