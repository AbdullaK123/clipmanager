'use client'
import { HeaderProps } from "../lib/interfaces"

export default function Header({ onShowAddForm } : HeaderProps) {
    return (
        <nav className="mb-8 p-4 bg-white flex flex-row justify-between items-center shadow-md sticky top-0">
            <h1 className="text-xl font-bold">
                Clip Manager
            </h1>
            <div className="flex flex-row gap-4">
                <button 
                    className="cursor-pointer p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                    onClick={onShowAddForm}
                >
                    Add Clip
                </button>
            </div>
        </nav>
    )
}