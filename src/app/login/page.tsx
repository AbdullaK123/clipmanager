'use client'
import React, { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LoginFormInput } from '@/app/lib/interfaces'
import Header from '../components/Header'
import styles from '@/app/styles/styles.json'
import { cx } from '../lib/utils'

export default function LoginPage() {
    const [loginData, setLoginData] = useState<LoginFormInput>({
        email: '',
        password: ''
    })
    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [successMessage, setSuccessMessage] = useState<string>('')
    const router = useRouter()

    const handleOnChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const getSuccessSpan = (message: string) => {
        return (
            <span className="text-green-500">{message}</span>
        )
    }

    const getErrorSpan = (message: string) => {
        return (
            <span className="text-red-500">{message}</span>
        )
    }

    const handleFormSubmit = async (event: FormEvent) => { 
        event.preventDefault();
        setIsError(false); 
        setErrorMessage('');
        setSuccessMessage('');

        if (loginData.email.trim() === '' || loginData.password.trim() === '') {
            setIsError(true);
            setErrorMessage('Email and password are required.');
            return;
        }

        console.log('Logging in with data:', JSON.stringify(loginData, null, 2));
        try {
            const result = await signIn('credentials', {
                redirect: false, // Correct for manual handling
                email: loginData.email,
                password: loginData.password
            });

            if (result?.error) {
                setIsError(true);
                if (result.error === "CredentialsSignin") {
                    setErrorMessage("Invalid email or password. Please try again.");
                } else {
                    setErrorMessage(result.error); 
                }
                return; 
            }

            if (result?.ok) { 
                setSuccessMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    router.push('/'); 
                }, 1000); 
            } else {
                setIsError(true);
                setErrorMessage("Login failed. Please check your credentials or try again later.");
            }
        } catch (err) {
            console.error(`Login handleSubmit exception: ${err instanceof Error ? err.message : String(err)}`);
            setIsError(true);
            setErrorMessage('An unexpected error occurred during login. Please try again.');
        }
    };

    return (
        <>
            <Header onShowAddForm={() => {}}/>
            <div className="border border-gray-500 rounded-lg shadow-md mt-10 p-6 flex flex-col items-center justify-center mx-auto w-min-[320px] w-1/4 h-3/5">
                <h1 className='text-3xl font-bold'>Login</h1>
                <div className='flex flex-col gap-4 p-4 w-full'>
                    <label htmlFor="email">Email: </label>
                    <input 
                        type='email'
                        id='email'
                        name='email'
                        className='p-4 border rounded-lg shadow-md border-blue-500'
                        value={loginData.email}
                        onChange={handleOnChange}
                        placeholder='Email...'
                    />
                </div>
                <div className='flex flex-col gap-4 p-4 w-full'>
                    <label htmlFor="password">Password: </label>
                    <input 
                        type='password'
                        id='password'
                        name='password'
                        className='p-4 border rounded-lg shadow-md border-blue-500'
                        value={loginData.password}
                        onChange={handleOnChange}
                        placeholder='Password...'
                    />
                </div>
                <button
                    // 
                    className={cx([
                        'w-full',
                        styles['btn-primary']
                    ])}
                    onClick={handleFormSubmit}
                >
                    Login
                </button>
                <div className="mt-4 text-center h-6"> {/* Fixed height for message area to prevent layout shift */}
                    {successMessage && getSuccessSpan(successMessage)}
                    {isError && getErrorSpan(errorMessage)}
                </div>
            </div>
        </>
    )

}