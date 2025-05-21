'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterFormInput } from '@/app/lib/interfaces'
import Header from '../components/Header'


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
            <span className="text-red-500">{message}</span>
        )
    }

    const getSuccessSpan = (message: string) => {
        return (
            <span className="text-green-500">{message}</span>
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
            <Header onShowAddForm={() => {}}/>
            <div className="border border-gray-500 rounded-lg shadow-md mt-10 p-4 flex flex-col items-center justify-center mx-auto w-1/4 h-3/5">
                <h1 className='text-3xl font-bold'>Register</h1>
                <div className='flex flex-col gap-4 p-4 w-full'>
                    <label htmlFor='name'>Name: </label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        className='p-4 border rounded-lg shadow-md border-blue-500'
                        value={formData.name}
                        onChange={handleOnChange}
                        placeholder='Name...'
                    />
                </div>
                <div className='flex flex-col gap-4 p-4 w-full'>
                    <label htmlFor="email">Email: </label>
                    <input 
                        type='email'
                        id='email'
                        name='email'
                        className='p-4 border rounded-lg shadow-md border-blue-500'
                        value={formData.email}
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
                        value={formData.password}
                        onChange={handleOnChange}
                        placeholder='Password...'
                    />
                </div>
                <div className='flex flex-col gap-4 p-4 w-full'>
                    <label htmlFor="confirmedPassword">Confirm Password: </label>
                    <input 
                        type='password'
                        id='confirmedPassword'
                        name='confirmedPassword'
                        className='p-4 border rounded-lg shadow-md border-blue-500'
                        value={formData.confirmedPassword}
                        onChange={handleOnChange}
                        placeholder='Confirm Password...'
                    />
                </div>
                <button
                    className="w-full cursor-pointer p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                    onClick={handleSubmit}
                >
                    Register
                </button>
                {successMessage && getSuccessSpan(successMessage)}
                {isError && getErrorSpan(errorMessage)}
            </div>
        </>
    )

}