'use client'
import React, { useState, useEffect, useRef, useMemo } from "react";
import { KnowledgeClip, AddClipFormProps } from "../lib/interfaces";
import '@mdxeditor/editor/style.css'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  codeBlockPlugin,
  BlockTypeSelect, 
  markdownShortcutPlugin,
  BoldItalicUnderlineToggles, 
  codeMirrorPlugin,
  InsertCodeBlock,
  InsertImage,
  CreateLink, 
  ListsToggle,
  MDXEditor,
  MDXEditorMethods
} from '@mdxeditor/editor'


export default function AddClipForm({ handleSubmit, handleSubmitIfUpdating, isUpdating, selectedClip }: AddClipFormProps) {
    const [clipInfo, setClipInfo] = useState<Omit<KnowledgeClip, 'id'>>({
        title: "",
        content: "",
        tags: []
    })
    const [tagContext, setTagContext] = useState<string>("")
    const editorRef = useRef<MDXEditorMethods | null>(null);

    useEffect(() => {
        if (selectedClip && isUpdating) {
            setClipInfo({
                title: selectedClip.title,
                content: selectedClip.content,
                tags: selectedClip.tags
            })
        } else if (!isUpdating) {
            setClipInfo({
                title: "",
                content: "",
                tags: []
            })
        }
    }, [selectedClip, isUpdating])

    useEffect(() => {
        if (isUpdating && selectedClip && editorRef.current) {
            editorRef.current.setMarkdown(selectedClip.content || '')
        }
    }, [isUpdating, selectedClip])

    const editorPlugins = useMemo(() => {
        return [
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                codeBlockPlugin({
                    defaultCodeBlockLanguage: 'py'   
                }),
                codeMirrorPlugin({
                    codeBlockLanguages: {
                    js: 'JavaScript',
                    ts: 'TypeScript',
                    py: 'Python',
                    sql: 'SQL',
                    sh: 'Bash',
                    },
                    autoLoadLanguageSupport: true 
                }),
                toolbarPlugin({
                    toolbarContents: () => (
                            <>
                                <BlockTypeSelect/>
                                <BoldItalicUnderlineToggles/>
                                <ListsToggle/>
                                <CreateLink/>
                                <InsertCodeBlock/>
                                <InsertImage/>
                            </>
                        )
                })
            ]
    }, [])

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
        console.log(`Submitting in ${isUpdating ? 'UPDATE' : 'ADD'} mode. Data:`, JSON.stringify(clipInfo, null, 2));
        if (isUpdating && selectedClip) {
            handleSubmitIfUpdating(selectedClip.id, clipInfo)
        } else { 
            handleSubmit(clipInfo)
        }
        setTagContext("")
        setClipInfo({
            title: "",
            content: "",
            tags: []
        })
        editorRef.current?.setMarkdown('')
    }

    return (
        <div className='max-h-screen overflow-scroll bg-white flex flex-col items-center justify-center gap-4 p-4 border border-gray-500 rounded-lg shadow-md m-4 min-w-[320px] w-[640px] '>
            <h1 className="text-3xl font-bold">{isUpdating ? "Updating Clip!" : "Add a Clip!"}</h1>
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
                <MDXEditor
                    markdown={""}
                    ref={editorRef}
                    plugins={editorPlugins}
                    onChange={(newMarkdown) => {
                        setClipInfo((prev) => ({...prev, content: newMarkdown}))
                    }}
                    className="min-h-[200px] border rounded-lg p-2 shadow-sm border-gray-300 focus-within:border-blue-500 focus-within:ring-blue-500"
                    contentEditableClassName="prose"
                    placeholder="Enter your clip content in Markdown..."
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
                className={`w-full ${clipInfo.title.trim() ? 'cursor-pointer' : 'bg-gray-400 cursor-not-allowed'} p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300`}
                onClick={() => handleOnSubmit()}
            >
                {isUpdating ? "Update" : "Add"}
            </button>
        </div>
    )
}