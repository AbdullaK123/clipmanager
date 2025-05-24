'use client'
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HeaderProps } from "../lib/interfaces";
import SearchBar from "./SearchBar";
import styles from '@/app/styles/styles.json'
import { usePathname } from "next/navigation";

export default function Header({ onShowAddForm, onSearch } : HeaderProps) {
    const path = usePathname();
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
            {(path === "/") && <SearchBar onSearch={onSearch} />}
            <div className="flex flex-row gap-4 items-center">
                {status === 'authenticated' ? (
                    <>
                        <span className="p-2">Welcome, {session.user.name || session.user.email}</span>
                        <button 
                            // className="cursor-pointer p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                            className={styles['btn-primary']}
                            onClick={onShowAddForm}
                        >
                            Add Clip
                        </button>
                        <button 
                            // className="cursor-pointer p-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
                            className={styles['btn-danger']}
                            onClick={handleLogoutClick}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            // className="cursor-pointer p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                            className={styles['btn-primary']}
                            onClick={handleLoginClick}
                        >
                            Login
                        </button>
                        <button 
                            // className="cursor-pointer p-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
                            className={styles['btn-primary']}
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