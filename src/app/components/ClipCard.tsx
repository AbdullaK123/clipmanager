import { ClipCardProps } from '@/app/lib/interfaces';
import ReactMarkdown from 'react-markdown'
import styles from '@/app/styles/styles.json'
import { cx, getStyle } from '../lib/utils';

export default function ClipCard({clip, onRemove, onShowUpdateForm}: ClipCardProps) {

    return (
        <div className={cx([
            getStyle('layout.flex.col', styles),
            getStyle('layout.flex.stretch', styles),
            getStyle('spacing.stacks.normal', styles),
            getStyle('cards.base', styles),
            getStyle('cards.variants.elevated', styles)
        ])}>
            <div className={cx([
                'flex justify-end'
            ])}>
                <div className={cx([
                    getStyle('layout.flex.row', styles),
                    getStyle('spacing.gaps.sm', styles),
                    'items-center'
                ])}>
                    <button 
                        className={getStyle('buttons.variants.secondary', styles)}
                        onClick={() => onShowUpdateForm(clip.id)}
                    >
                        Update
                    </button>
                    <button 
                        className={getStyle('buttons.variants.danger', styles)}
                        onClick={() => onRemove(clip.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
            <h1 className={cx([
                getStyle('typography.headings.h1', styles),
                'break-words'
            ])}>
                {clip.title}
            </h1>
            <div className={cx([
                getStyle('typography.body.large', styles),
                'text-left prose w-full overflow-hidden break-words'
            ])}>
                <ReactMarkdown>
                    {clip.content}
                </ReactMarkdown>
            </div>
            <div className={cx([
                'flex flex-wrap items-center justify-center',
                getStyle('spacing.gaps.sm', styles)
            ])}>
                {clip.tags.map((tag, index) => (
                    <span
                        className={getStyle('tags.variants.muted', styles)}
                        key={index}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    )
}