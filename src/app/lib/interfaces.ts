
export interface KnowledgeClip {
    id: string;
    title: string;
    content: string;
    tags: string[];
}

export interface ClipCardProps {
    clip: KnowledgeClip;
    onRemove: (id: string) => void;
}

export interface AddClipFormProps {
    handleSubmit: (clip: KnowledgeClip) => void;
}