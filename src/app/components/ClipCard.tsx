import { ClipCardProps } from '@/app/lib/interfaces';

export default function ClipCard({clip, onRemove}:ClipCardProps) {
    return (
        <div className='flex flex-col items-center p-6 gap-4 border border-gray-700 rounded-lg shadow-md min-w-[180px]'>
            <div className='flex w-full w-full justify-end'>
                <button 
                    className='w-6 h-6 rounded-full bg-red-500 text-white cursor-pointer hover:scale-120 transition-all duration-300 ease-in-out'
                    onClick={() => onRemove(clip.id)}
                >
                    X
                </button>
            </div>
            <h1 className='text-3xl font-bold'>
                {clip.title}
            </h1>
            <p className='text-xl'>
                {clip.content}
            </p>
            <div className='flex flex-wrap items-center justify-center gap-4'>
                {clip.tags.map((tag, index) => (
                    <span
                        className='bg-gray-700 text-white p-2 italic rounded-full' 
                        key={index}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    )
}