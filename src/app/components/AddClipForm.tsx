'use client'
import React, { useState, useEffect, useRef, useMemo } from "react";
import { KnowledgeClip, AddClipFormProps } from "../lib/interfaces";
import '@mdxeditor/editor/style.css'
import styles from '@/app/styles/styles.json'
import { cx, getStyle } from "../lib/utils";
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
        <div className={cx([
            getStyle('layout.flex.col', styles),
            getStyle('spacing.gaps.sm', styles),
            'max-h-screen overflow-y-scroll min-w-[320px] w-[640px]',
            getStyle('cards.base', styles)
        ])}>
            <h1 className={getStyle('typography.headings.h1', styles)}>
                {isUpdating ? "Updating Clip!" : "Add a Clip!"}
            </h1>
            <div className={getStyle('forms.patterns.group', styles)}>
                <label htmlFor="title" className={getStyle('typography.utility.label', styles)}>
                    Title: 
                </label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    className={cx([
                        getStyle('inputs.base', styles),
                        getStyle('inputs.variants.default', styles)
                    ])}
                    value={clipInfo.title}
                    onChange={handleOnTitleOrContentChange}
                    placeholder="Title..."
                />
            </div>
            <div className={cx([
                getStyle('forms.patterns.group', styles),
                'w-full'
            ])}>
                <MDXEditor
                    markdown={""}
                    ref={editorRef}
                    plugins={editorPlugins}
                    onChange={(newMarkdown) => {
                        setClipInfo((prev) => ({...prev, content: newMarkdown}))
                    }}
                    className={cx([
                        'min-h-[200px] border rounded-lg p-2',
                        getStyle('effects.shadows.subtle', styles),
                        'border-gray-300 focus-within:border-blue-500 focus-within:ring-blue-500'
                    ])}
                    contentEditableClassName="prose"
                    placeholder="Enter your clip content in Markdown..."
                />
            </div>
            <div className={getStyle('forms.patterns.group', styles)}>
                <label htmlFor="tagInput" className={getStyle('typography.utility.label', styles)}>
                    Tags: 
                </label>
                <input
                    type="text"
                    id="tagInput"
                    className={cx([
                        getStyle('inputs.base', styles),
                        getStyle('inputs.variants.default', styles)
                    ])}
                    value={tagContext}
                    onChange={handleOnTagChange}
                    onKeyDown={handleOnKeyDown}
                    placeholder="Tags..."
                />
                <div className={cx([
                    'flex flex-wrap items-center justify-center',
                    getStyle('spacing.gaps.sm', styles)
                ])}>
                    {clipInfo.tags.map((tag, index) => (
                        <span
                            key={index}
                            className={getStyle('tags.variants.removable', styles)}
                        >
                            <button 
                                className={cx([
                                    'cursor-pointer font-bold mr-2'
                                ])}
                                onClick={() => {
                                setClipInfo({
                                    ...clipInfo,
                                    tags: clipInfo.tags.filter((t) => t !== tag)
                                })
                            }}>
                                {'×'}
                            </button>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <button 
                className={cx([
                    'w-full',
                    clipInfo.title.trim() ? 
                        getStyle('buttons.variants.primary', styles) : 
                        cx([
                            'bg-gray-400 cursor-not-allowed',
                            getStyle('spacing.padding.md', styles),
                            'rounded-lg font-semibold'
                        ])
                ])}
                onClick={() => handleOnSubmit()}
            >
                {isUpdating ? "Update" : "Add"}
            </button>
        </div>
    )
}