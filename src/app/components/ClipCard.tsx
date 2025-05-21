import { ClipCardProps } from '@/app/lib/interfaces';
import ReactMarkdown from 'react-markdown'

export default function ClipCard({clip, onRemove, onShowUpdateForm}:ClipCardProps) {

    return (
        <div className='flex flex-col items-stretch p-6 gap-4 border border-gray-700 rounded-lg shadow-md w-full'>
            <div className='flex justify-end'>
                <div className='flex flex-row gap-4 items-center'>
                    <button 
                        className='cursor-pointer p-1.5 font-bold bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300'
                        onClick={() => onShowUpdateForm(clip.id)}
                    >
                        Update
                    </button>
                    <button 
                        className='cursor-pointer p-1.5 font-bold bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300'
                        onClick={() => onRemove(clip.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
            <h1 className='text-3xl font-bold break-words'>
                {clip.title}
            </h1>
            <p className='text-xl text-left prose w-full overflow-hidden break-words'>
                <ReactMarkdown>
                    {clip.content}
                </ReactMarkdown>
            </p>
            <div className='flex flex-wrap items-center justify-center gap-4'>
                {clip.tags.map((tag, index) => (
                    <span
                        className='bg-gray-700 text-white p-2.5 italic rounded-full' 
                        key={index}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    )
}