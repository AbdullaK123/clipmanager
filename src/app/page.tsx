'use client'
import ClipCard from "./components/ClipCard";
import AddClipForm from "./components/AddClipForm";
import Header from "./components/Header";
import { KnowledgeClip } from "./lib/interfaces";
import { useState, useEffect } from "react";
import Modal from "./components/Modal";
import { useRequireAuth } from './lib/auth-utils';
import { Document } from "flexsearch"
import styles from '@/app/styles/styles.json'
import { cx, getStyle } from "./lib/utils";

export default function Home() {
  // This will redirect to login if not authenticated
  const { session, status } = useRequireAuth();
  const [clips, setClips] = useState<KnowledgeClip[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [index, setIndex] = useState<Document | null>(null);
  const [selectedClip, setSelectedClip] = useState<KnowledgeClip | null>(null);
  const [filteredClips, setFilteredClips] = useState<KnowledgeClip[]>([]);

  // Fetch clips when session is available
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/clips')
          if (!response.ok) {
            console.error('Failed to fetch clips: ', response.status)
            return
          }
          const data = await response.json();
          if (data && data.clips) {
            setClips(data.clips)
          } else {
            console.error('Clips are not in the expected format', data)
            return
          }
        } catch (err) {
          alert(`Failed to fetch clips ${err instanceof Error ? err.message : String(err)}`)
          return
        }
      }

      fetchData()
    }
  }, [status])

  useEffect(() => {
    if (clips.length > 0) {
      const searchIndex = new Document({
        document: {
          id: "id",
          index: ["title", "content", "tags"]
        }
      })

      clips.forEach((clip) => {
        searchIndex.add({
          id: clip.id,
          title: clip.title,
          content: clip.content,
          tags: clip.tags.join(' ')
        })
      })

      setIndex(searchIndex)
    }
  }, [clips])

  useEffect(() => {
    setFilteredClips(clips)
  }, [clips])

  const onSearch = (query:string) => {
    if (!query.trim() || !index) {
      setFilteredClips(clips)
      return
    }

    try {
      const results = index.search(query);
      const matchingIds = new Set();

      if (Array.isArray(results)) {
          results.map((result : any) => {
            if (result && result.result) {
              result.result.forEach((id : string) => matchingIds.add(id))
            }
        })
      }

      const matchingClips = Array.from(matchingIds).map(id => clips.find((clip) => clip.id === id)).filter(Boolean) as KnowledgeClip[]
      setFilteredClips(matchingClips)
    } catch (err) {
      console.warn(`Failed to search: ${err instanceof Error ? err.message : err}`)
      setFilteredClips(clips)
    }
  }

  const onAddClip = async (clip: Omit<KnowledgeClip,'id'> ) => {
    if (status !== 'authenticated') {
      alert("You must be logged in to add clips");
      return;
    }

    if (clip.title.trim() === "") {
      alert("Clip title can not be empty!")
      return
    }
    if (clip.content.trim() === "") {
      alert("Clip content can not be empty!")
      return
    }
    if (clip.tags.length === 0) { 
      alert("You must have at least one tag!")
      return
    }

    try {
      const response = await fetch('/api/clips', {
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clip)
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to add clip: ${errorData.message || 'Unknown error'}`);
        return;
      }
      
      const responseData = await response.json();
      setClips((prevClips) => [...prevClips, responseData.clip]);
      setIsModalVisible(false);
    } catch(err) {
      console.error('API call failed: ', err);
      alert(`Failed to add clip: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const onRemoveClip = async (id: string) => {
    try {
      const response = await fetch(`/api/clips/${id}`, {
        'method': 'DELETE'
      })
      if (response.ok) {
        setClips((prevClips) => prevClips.filter((clip) => clip.id !== id));
      } else {
        try {
          const errMessage = await response.json();
          console.error(`Failed to delete clip: ${errMessage.message || 'Unknown API error'}`);
          alert(`Failed to delete clip: ${errMessage.message || 'Unknown API error'}`);
        } catch(err) {
          console.error('Failed to parse json response: \n\n', err);
          alert('Failed to parse json response');
        }
      }
    } catch(err) {
      console.log('API call failed: \n\n', err)
      return
    }
  }

  const onUpdateClip = async (id: string, newClipInfo: Omit<KnowledgeClip, 'id'>) => {
      try {
          console.log(`[onUpdateClip] Sending PUT for ID: ${id} with data:`, JSON.stringify(newClipInfo, null, 2));
          const response = await fetch(`/api/clips/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newClipInfo)
          });

          const responseData = await response.json(); 
          
          if (response.ok && responseData.clip) {
              console.log("[onUpdateClip] Response is OK and responseData.clip is truthy. Updating state.");
              setClips((prevClips) => {
                  const clipIndexToUpdate = prevClips.findIndex((c) => c.id === id);
                  if (clipIndexToUpdate === -1) {
                      console.error("[onUpdateClip] Clip to update not found in client state after successful API call. This indicates a sync issue or incorrect ID.");
                      return prevClips; 
                  }
                  const updatedClips = [...prevClips];
                  updatedClips[clipIndexToUpdate] = responseData.clip;
                  return updatedClips;
              });
              setIsUpdating(false);
              setIsModalVisible(false);
              setSelectedClip(null);
          } else {
              console.error("[onUpdateClip] Response NOT OK or responseData.clip is falsy.");
              alert(`Failed to update clip: ${responseData?.message || response.statusText || 'Unknown API error or malformed response from server'}`);
          }
      } catch (err) {
          alert(`CLIENT EXCEPTION during update API call: ${err instanceof Error ? err.message : String(err)}`);
          console.error('API call failed (onUpdateClip) due to exception:', err);
      }
  };

  const onShowAddFormIfUpdating = async (id: string) => {
    setIsUpdating(true)
    const clipToUpdate = clips.find((clip) => clip.id === id)
    if (!clipToUpdate) {
      alert('Clip not found')
      return
    }
    setSelectedClip(clipToUpdate)
    setIsModalVisible(true)
  }

  const onShowAddForm = () => {
    setSelectedClip(null)
    setIsUpdating(false)
    setIsModalVisible(true)
  }

  // Show loading state when checking authentication
  if (status === 'loading') {
    return (
      <div className={cx([
        'flex items-center justify-center min-h-screen',
        getStyle('typography.body.default', styles)
      ])}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header 
        onShowAddForm={onShowAddForm}
        onSearch={onSearch}
      />
      <div className={cx([
        getStyle('layout.grids.cards', styles),
        'items-center justify-center',
        getStyle('spacing.padding.md', styles)
      ])}>
        <Modal
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
          >
            <AddClipForm 
              isUpdating={isUpdating}
              handleSubmitIfUpdating={onUpdateClip}
              selectedClip={selectedClip}
              handleSubmit={onAddClip}
            />
          </div>
        </Modal>
        {(filteredClips.length > 0) ? filteredClips.map((clip) => {
          return (
            <ClipCard
              key={clip.id}
              clip={clip}
              onRemove={onRemoveClip}
              onShowUpdateForm={onShowAddFormIfUpdating}
            />
          )
        }) : (
          <p className={getStyle('typography.body.default', styles)}>
            {clips.length === 0 ? 'No clips yet' : 'No clips match your search'}
          </p>
        )}
      </div>
    </>
  );
}