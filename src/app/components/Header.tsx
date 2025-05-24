'use client'
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HeaderProps } from "../lib/interfaces";
import SearchBar from "./SearchBar";
import styles from '@/app/styles/styles.json'
import { usePathname } from "next/navigation";
import { cx, getStyle } from "../lib/utils";

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
        <nav className={cx([
            getStyle('app-specific.page-header', styles),
            getStyle('components.toolbar', styles)
        ])}>
            <h1 className={getStyle('typography.headings.h4', styles)}>
                Clip Manager
            </h1>
            {(path === "/") && (onSearch) && <SearchBar onSearch={onSearch} />}
            <div className={cx([
                getStyle('layout.flex.row', styles),
                getStyle('spacing.gaps.sm', styles),
                'items-center'
            ])}>
                {status === 'authenticated' ? (
                    <>
                        <span className={cx([
                            getStyle('spacing.padding.xs', styles),
                            getStyle('colors.text.secondary', styles)
                        ])}>
                            Welcome, {session.user.name || session.user.email}
                        </span>
                        <button 
                            className={getStyle('buttons.variants.primary', styles)}
                            onClick={onShowAddForm}
                        >
                            Add Clip
                        </button>
                        <button 
                            className={getStyle('buttons.variants.danger', styles)}
                            onClick={handleLogoutClick}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            className={getStyle('buttons.variants.primary', styles)}
                            onClick={handleLoginClick}
                        >
                            Login
                        </button>
                        <button 
                            className={getStyle('buttons.variants.primary', styles)}
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