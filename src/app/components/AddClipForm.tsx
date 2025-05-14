'use client'
import React, { useState } from "react";
import { KnowledgeClip, AddClipFormProps } from "../lib/interfaces";
import { v4 } from 'uuid'

export default function AddClipForm({handleSubmit}: AddClipFormProps) {
    const [clipInfo, setClipInfo] = useState<Omit<KnowledgeClip, 'id'>>({
        title: "",
        content: "",
        tags: []
    })
    const [tagContext, setTagContext] = useState<string>("")

    const handleOnTitleOrContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setClipInfo({
            ...clipInfo,
            [e.target.name]: e.target.value
        })
    }

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();

            // make sure we have clean inputs 
            const sanitizedTagContext = tagContext.trim()
            if (sanitizedTagContext === "") return

            // check if the sanitized Tag Context is already in state
            if (clipInfo.tags.includes(sanitizedTagContext)) {
                setTagContext("")
                alert(`Tag "${sanitizedTagContext}" already exists`)
                return
            }

            setClipInfo((prevClipInfo) => {
                return {
                    ...prevClipInfo,
                    tags: [...prevClipInfo.tags, sanitizedTagContext]
                }
            })
            setTagContext("")
        }
    }

    const handleOnTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagContext(e.target.value)
    }

    const handleOnSubmit = () => {
        handleSubmit({...clipInfo, id: v4()})
        setTagContext("")
        setClipInfo({
            title: "",
            content: "",
            tags: []
        })
    }

    return (
        <div className='flex flex-col items-center justify-center gap-4 p-4 border border-gray-500 rounded-lg shadow-md m-4 min-w-[320px]'>
            <h1 className="text-3xl font-bold">Add a Clip!</h1>
            <div className="flex flex-col gap-4 p-4 w-full">
                <label htmlFor="title" >Title: </label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    className='p-4 border rounded-lg shadow-md border-blue-500'
                    value={clipInfo.title}
                    onChange={handleOnTitleOrContentChange}
                    placeholder="Title..."
                />
            </div>
            <div className="flex flex-col gap-4 p-4 w-full">
                <label htmlFor="content" >Content: </label>
                <textarea
                    id="content"
                    name="content"
                    value={clipInfo.content}
                    className='pt-2 pb-4 p-4 border rounded-lg shadow-md border-blue-500'
                    onChange={handleOnTitleOrContentChange}
                    placeholder="Content..."
                />
            </div>
            <div className="flex flex-col gap-4 p-4 w-full">
                <label htmlFor="tagInput" >Tags: </label>
                <input
                    type="text"
                    id="tagInput"
                    className="p-4 border rounded-lg shadow-md border-blue-500"
                    value={tagContext}
                    onChange={handleOnTagChange}
                    onKeyDown={handleOnKeyDown}
                    placeholder="Tags..."
                />
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {clipInfo.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="p-2 bg-red-500 text-white rounded-lg shadow-md transition-colors duration-300"
                        >
                            <button 
                                className="cursor-pointer font-bold p-2 bg-red-500 text-white"
                                onClick={() => {
                                setClipInfo({
                                    ...clipInfo,
                                    tags: clipInfo.tags.filter((t) => t !== tag)
                                })
                            }}>
                                {'X'}
                            </button>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <button 
                className="w-full cursor-pointer p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                onClick={() => handleOnSubmit()}
            >
                Add Clip
            </button>
        </div>
    )
}