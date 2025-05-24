'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterFormInput } from '@/app/lib/interfaces'
import Header from '../components/Header'
import styles from '@/app/styles/styles.json'
import { cx, getStyle } from '../lib/utils'


export default function RegisterPage() {

    const [formData, setFormData] = useState<RegisterFormInput>({
        name: '',
        email: '',
        password: '',
        confirmedPassword: ''
    })
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const getErrorSpan = (message: string) => {
        return (
            <span className={getStyle('colors.text.error', styles)}>{message}</span>
        )
    }

    const getSuccessSpan = (message: string) => {
        return (
            <span className={getStyle('colors.text.success', styles)}>{message}</span>
        )
    }

    const handleOnChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const router = useRouter()

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            e.preventDefault();
            if (formData.password !== formData.confirmedPassword) {
                setIsError(true)
                setErrorMessage('Passwords do not match')
                return
            }
            if (isError) {
                setIsError(false)
                setErrorMessage('')
            }
            console.log('Registering with data:', JSON.stringify(formData, null, 2))
            const response = await fetch('/api/auth/register', {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            })

            const data = await response.json()

            if (!response.ok) {
                setIsError(true)
                setErrorMessage(`Registration failed. Status code: ${response.status}. Message: ${data.message}`)
                return
            } 

            setSuccessMessage('Registration successful! Taking you to home page...')

            // TODO: log the user in 

            // go to home
            router.push('/')

        } catch (err) {
            console.error(`Registration failed: ${err instanceof Error ? err.message : err}`)
            setIsError(true)
            setErrorMessage('Registration failed. The server might be experiencing issues.')
        }
    }

    return (
        <>
            <Header />
            <div className={cx([
                getStyle('app-specific.auth-form', styles),
                'mt-10'
            ])}>
                <h1 className={getStyle('typography.headings.h1', styles)}>Register</h1>
                <div className={getStyle('forms.patterns.group', styles)}>
                    <label htmlFor='name' className={getStyle('typography.utility.label', styles)}>
                        Name: 
                    </label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        className={cx([
                            getStyle('inputs.base', styles),
                            getStyle('inputs.variants.default', styles),
                            getStyle('effects.shadows.default', styles)
                        ])}
                        value={formData.name}
                        onChange={handleOnChange}
                        placeholder='Name...'
                    />
                </div>
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
                        value={formData.email}
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
                        value={formData.password}
                        onChange={handleOnChange}
                        placeholder='Password...'
                    />
                </div>
                <div className={getStyle('forms.patterns.group', styles)}>
                    <label htmlFor="confirmedPassword" className={getStyle('typography.utility.label', styles)}>
                        Confirm Password: 
                    </label>
                    <input 
                        type='password'
                        id='confirmedPassword'
                        name='confirmedPassword'
                        className={cx([
                            getStyle('inputs.base', styles),
                            getStyle('inputs.variants.default', styles),
                            getStyle('effects.shadows.default', styles)
                        ])}
                        value={formData.confirmedPassword}
                        onChange={handleOnChange}
                        placeholder='Confirm Password...'
                    />
                </div>
                <button
                    className={cx([
                        'w-full',
                        getStyle('buttons.variants.primary', styles)
                    ])}
                    onClick={handleSubmit}
                >
                    Register
                </button>
                <div className="mt-4 text-center h-6">
                    {successMessage && getSuccessSpan(successMessage)}
                    {isError && getErrorSpan(errorMessage)}
                </div>
            </div>
        </>
    )

}