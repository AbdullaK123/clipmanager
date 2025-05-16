'use client'
import ClipCard from "./components/ClipCard";
import AddClipForm from "./components/AddClipForm";
import Header from "./components/Header";
import { KnowledgeClip } from "./lib/interfaces";
import { useState, useEffect } from "react";
import Modal from "./components/Modal";

export default function Home() {

  const [clips, setClips] = useState<KnowledgeClip[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedClip, setSelectedClip] = useState<KnowledgeClip | null>(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch('/api/clips')
        if (!response.ok) {
          console.error('Failed to fetch clips: ', response.status)
          return
        }
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2))
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

  }, [])

  const onAddClip = async (clip: Omit<KnowledgeClip,'id'> ) => {

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
      const responseData = await response.json()
      response.ok ? setClips((prevClips) => [...prevClips, responseData.clip]) : (() => {
        alert(`Failed to add clip: ${responseData.message || 'Unknown API error'}`);
      })()
      setIsModalVisible((prev) => !prev)
    } catch(err) {
      console.log('API call failed: \n\n', err)
      return
    }
  }

  const onRemoveClip = async (id: string) => {
    try {
      const response = await fetch(`/api/clips/${id}`, {
        'method': 'DELETE'
      })
      response.ok ? setClips((prevClips) => prevClips.filter((clip) => clip.id !== id)) : (async () => {
        try {
          const errMessage = await response.json();
          console.error(`Failed to delete clip: ${errMessage.message || 'Unknown API error'}`)
          alert(`Failed to delete clip: ${errMessage.message || 'Unknown API error'}`)
        } catch(err) {
          console.error('Failed to parse json response: \n\n', err)
          alert('Failed to parse json response')
        }
      })()
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

          // Log #1: The raw text of the response
          const responseText = await response.clone().text(); // Clone because .text() and .json() consume the body
          console.log("[onUpdateClip] Raw API response text:", responseText);
          
          // Log #2: Status and ok status
          console.log("[onUpdateClip] API response status:", response.status);
          console.log("[onUpdateClip] API response OK:", response.ok);

          // Now try to parse as JSON
          const responseData = await response.json(); 
          
          // Log #3: The fully parsed JSON object
          console.log("[onUpdateClip] Parsed API response data (responseData):", JSON.stringify(responseData, null, 2));
          
          // Log #4: Your original log for data.clip
          console.log("[onUpdateClip] Accessing responseData.clip directly (your 'Clip received:' log):", JSON.stringify(responseData.clip, null, 2));

          if (response.ok && responseData.clip) {
              console.log("[onUpdateClip] Response is OK and responseData.clip is truthy. Updating state.");
              setClips((prevClips) => {
                  const clipIndexToUpdate = prevClips.findIndex((c) => c.id === id);
                  if (clipIndexToUpdate === -1) {
                      console.error("[onUpdateClip] Clip to update not found in client state after successful API call. This indicates a sync issue or incorrect ID.");
                      // To prevent errors, you might want to refetch all clips or handle this more gracefully
                      // For now, we'll just return prevClips to avoid breaking the map function
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
    setIsModalVisible(true)
  }

  return (
    <>
      <Header 
        onShowAddForm={onShowAddForm}
      />
      <div className='flex flex-col items-center justify-center gap-4'>
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
        {(clips.length > 0) ? clips.map((clip) => {
          console.log(`Clip: \n ${JSON.stringify(clip, null, 2)}`)
          return (
            <ClipCard
              key={clip.id}
              clip={clip}
              onRemove={onRemoveClip}
              onShowUpdateForm={onShowAddFormIfUpdating}
            />
          )
        }) : <p>No clips yet...</p>}
      </div>
    </>
    
  );
}
