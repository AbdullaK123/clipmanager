import React, { useState, useEffect } from "react";
import { SearchBarProps } from "../lib/interfaces";
import styles from '@/app/styles/styles.json'
import { cx, getStyle } from "../lib/utils";

export default function SearchBar({ onSearch } : SearchBarProps) {

    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query)
        }, 300)

        return () => clearTimeout(timer)
    }, [query, onSearch])

    return (
        <div className={cx([
            'flex items-center',
            getStyle('spacing.gaps.xs', styles)
        ])}>
             <input 
                id="search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={cx([
                    getStyle('spacing.padding.xs', styles),
                    getStyle('colors.border.default', styles),
                    'rounded-lg',
                    getStyle('effects.shadows.subtle', styles),
                    'focus:border-blue-500 focus:ring-blue-500',
                    getStyle('effects.focus.ring', styles)
                ])}
                placeholder="Full text search..."
            />
            {query && <button
                 className={cx([
                    getStyle('colors.text.muted', styles),
                    'hover:text-gray-700 text-xl bg-gray-300 rounded-lg'
                 ])}
                 onClick={() => setQuery('')}
            >
                X
            </button>}
        </div>
    )

}