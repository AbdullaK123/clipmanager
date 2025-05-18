'use client'
import { HeaderProps } from "../lib/interfaces"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Header({ onShowAddForm } : HeaderProps) {

    const { data: session, status} = useSession();

    const handleLogout = () => {
        signOut({
            'callbackUrl': '/login'
        })
    }


    return (
        <nav className="mb-8 p-4 bg-white flex flex-row justify-between items-center shadow-md sticky top-0">
            <h1 className="text-xl font-bold">
                Clip Manager
            </h1>
            <div className="flex flex-row gap-4">
                {(status === 'authenticated') ? (
                    <>
                        <span className="p-4"> Welcome, {session?.user?.name}!</span>
                        <button 
                            className="cursor-pointer p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300" 
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                        <button 
                            className="cursor-pointer p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                            onClick={onShowAddForm}
                        >
                            Add Clip
                        </button>
                    </>

                ) : (
                    <>
                        <Link 
                            href='/login' 
                            className="p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                        >
                            Login
                        </Link>
                        <Link 
                            href='/register' 
                            className="p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}