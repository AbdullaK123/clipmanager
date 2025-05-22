'use client'
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HeaderProps } from "../lib/interfaces";
import SearchBar from "./SearchBar";

export default function Header({ onShowAddForm, onSearch } : HeaderProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const handleLoginClick = () => {
        router.push('/login');
    };
    
    const handleRegisterClick = () => {
        router.push('/register');
    };
    
    const handleLogoutClick = () => {
        signOut({ callbackUrl: '/login' });
    };
    
    return (
        <nav className="mb-8 p-4 bg-white flex flex-row justify-between items-center shadow-md sticky top-0">
            <h1 className="text-xl font-bold">
                Clip Manager
            </h1>
            <SearchBar onSearch={onSearch} />
            <div className="flex flex-row gap-4 items-center">
                {status === 'authenticated' ? (
                    <>
                        <span className="p-2">Welcome, {session.user.name || session.user.email}</span>
                        <button 
                            className="cursor-pointer p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                            onClick={onShowAddForm}
                        >
                            Add Clip
                        </button>
                        <button 
                            className="cursor-pointer p-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
                            onClick={handleLogoutClick}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            className="cursor-pointer p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                            onClick={handleLoginClick}
                        >
                            Login
                        </button>
                        <button 
                            className="cursor-pointer p-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
                            onClick={handleRegisterClick}
                        >
                            Register
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}