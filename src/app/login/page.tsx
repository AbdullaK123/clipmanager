'use client'
import React, { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LoginFormInput } from '@/app/lib/interfaces'
import Header from '../components/Header'
import styles from '@/app/styles/styles.json'
import { cx, getStyle } from '../lib/utils'

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
            <span className={getStyle('colors.text.success', styles)}>{message}</span>
        )
    }

    const getErrorSpan = (message: string) => {
        return (
            <span className={getStyle('colors.text.error', styles)}>{message}</span>
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
            <Header />
            <div className={cx([
                getStyle('app-specific.auth-form', styles),
                'mt-10'
            ])}>
                <h1 className={getStyle('typography.headings.h1', styles)}>Login</h1>
                <div className={getStyle('forms.patterns.group', styles)}>
                    <label htmlFor="email" className={getStyle('typography.utility.label', styles)}>
                        Email: 
                    </label>
                    <input 
                        type='email'
                        id='email'
                        name='email'
                        className={cx([
                            getStyle('inputs.base', styles),
                            getStyle('inputs.variants.default', styles),
                            getStyle('effects.shadows.default', styles)
                        ])}
                        value={loginData.email}
                        onChange={handleOnChange}
                        placeholder='Email...'
                    />
                </div>
                <div className={getStyle('forms.patterns.group', styles)}>
                    <label htmlFor="password" className={getStyle('typography.utility.label', styles)}>
                        Password: 
                    </label>
                    <input 
                        type='password'
                        id='password'
                        name='password'
                        className={cx([
                            getStyle('inputs.base', styles),
                            getStyle('inputs.variants.default', styles),
                            getStyle('effects.shadows.default', styles)
                        ])}
                        value={loginData.password}
                        onChange={handleOnChange}
                        placeholder='Password...'
                    />
                </div>
                <button
                    className={cx([
                        'w-full',
                        getStyle('buttons.variants.primary', styles)
                    ])}
                    onClick={handleFormSubmit}
                >
                    Login
                </button>
                <div className={cx([
                    'mt-4 text-center h-6'
                ])}>
                    {successMessage && getSuccessSpan(successMessage)}
                    {isError && getErrorSpan(errorMessage)}
                </div>
            </div>
        </>
    )

}