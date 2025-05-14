'use client'
import ClipCard from "./components/ClipCard";
import AddClipForm from "./components/AddClipForm";
import { KnowledgeClip } from "./lib/interfaces";
import { useState } from "react";

export default function Home() {

  const [clips, setClips] = useState<KnowledgeClip[]>([]);

  const onAddClip = (clip: KnowledgeClip) => {
    setClips((prevClips) => [...prevClips, clip]);
  }

  const onRemoveClip = (id: string) => {
    setClips((prevClips) => prevClips.filter((clip) => clip.id !== id));
  }

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <AddClipForm handleSubmit={onAddClip} />
      {clips.map((clip) => <ClipCard key={clip.id} onRemove={onRemoveClip} clip={clip} />)}
    </div>
  );
}
