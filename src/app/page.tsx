'use client'

import { useState, useEffect } from 'react';
import axiosInstance from '@/app/services/axiosInstance';
import { setTokens, clearTokens, isLoggedIn } from '@/app/utils/auth';

export default function Home() {
    const [message, setMessage] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn());

    useEffect(() => {
        setLoggedIn(isLoggedIn());
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axiosInstance.post('/token', {
                username: 'user',
                password: 'password',
            });
            setTokens(response.data.accessToken, response.data.refreshToken);
            setLoggedIn(true);
            setMessage('Logged in successfully');
        } catch {
            setMessage('Login failed');
        }
    };

    const handleLogout = () => {
        clearTokens();
        setLoggedIn(false);
        setMessage('Logged out');
    };

    const fetchProtectedData = async () => {
        try {
            const response = await axiosInstance.get('/protected');
            setMessage(response.data.data);
        } catch (error) {
            console.error('Error fetching protected data:', error);
            setMessage('Failed to fetch protected data');
        }
    };

    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                    <li className="mb-2">Please log in to the project.</li>
                    <li>Then call the protected API.</li>
                </ol>

                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <button
                        onClick={fetchProtectedData}
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    >
                        Call Protected API
                    </button>
                    {!loggedIn ? <button
                            onClick={handleLogin}
                            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                        >
                            Login
                        </button> :
                        <button
                            onClick={handleLogout}
                            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                        >
                            Logout
                        </button>}
                </div>
                <p>{message}</p>
            </main>
        </div>
    );
}
