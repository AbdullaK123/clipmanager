import React, { useState, useEffect } from "react";
import { SearchBarProps } from "../lib/interfaces";

export default function SearchBar({ onSearch } : SearchBarProps) {

    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query)
        }, 300)

        return () => clearTimeout(timer)
    }, [query, onSearch])

    return (
        <div className="flex items-center gap-2">
             <input 
                id="search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="p-2 border rounded-lg shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                placeholder="Full text search..."
            />
            {query && <button
                 className="text-gray-500 hover:text-gray-700 text-xl bg-gray-300 rounded-lg"
                 onClick={() => setQuery('')}
            >
                X
            </button>}
        </div>
    )

}