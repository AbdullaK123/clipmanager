import { ClipCardProps } from '@/app/lib/interfaces';
import ReactMarkdown from 'react-markdown'
import styles from '@/app/styles/styles.json'
import { cx } from '../lib/utils';

export default function ClipCard({clip, onRemove, onShowUpdateForm}: ClipCardProps) {

    return (
        <div className={cx([
            'flex flex-col items-stretch',
            styles['space-md'],
            styles['card-base'],
            styles['card-elevated']
        ])}>
            <div className='flex justify-end'>
                <div className='flex flex-row gap-4 items-center'>
                    <button 
                        className={styles['btn-secondary']}
                        onClick={() => onShowUpdateForm(clip.id)}
                    >
                        Update
                    </button>
                    <button 
                        className={styles['btn-danger']}
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
                        // className='bg-gray-700 text-white p-2.5 italic rounded-full' 
                        className={styles['tag-muted']}
                        key={index}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    )
}