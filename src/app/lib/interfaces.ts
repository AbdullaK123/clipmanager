

export interface KnowledgeClip {
    id: string;
    title: string;
    content: string;
    tags: string[];
}

export interface ClipCardProps {
    clip: KnowledgeClip;
    onRemove: (id: string) => void;
    onShowUpdateForm: (id: string) => void;
}

export interface AddClipFormProps {
    handleSubmit: (clip: Omit<KnowledgeClip, 'id'>) => void;
    handleSubmitIfUpdating: (id: string, newClipInfo: Omit<KnowledgeClip, 'id'>) => void;
    isUpdating: boolean;
    selectedClip: KnowledgeClip | undefined | null;
}

export interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    isOpen: boolean;
}

export interface RegisterFormInput {
    name?: string
    email: string
    password: string
    confirmedPassword: string
}

export interface LoginFormInput {
    email: string
    password: string
}

export interface HeaderProps {
    onShowAddForm: () => void;
}