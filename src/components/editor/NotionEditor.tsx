import React, { useMemo } from 'react'
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { usePageStore } from '../../stores/usePageStore';

interface NotionEditorProps {
    pageId: string
}

export const NotionEditor: React.FC<NotionEditorProps> = ({ pageId }) => {
    const { pages, updatePageContent } = usePageStore()
    const page = pages[pageId]

    // Create the editor instance
    // We use useMemo to ensure we don't recreate the editor unnecessarily,
    // but useCreateBlockNote handles most of this internal logic.
    // The key prop on BlockNoteView is crucial for resetting when pageId changes.
    const editor = useCreateBlockNote({
        initialContent: page?.blocks && page.blocks.length > 0 ? page.blocks : undefined,
    });
 
    // Handle content changes
    const onChange = async () => {
        if (!editor) return;
        
        // Get blocks as JSON
        const blocks = editor.document;
        
        // Update store
        // In a real app, you might want to debounce this call
        updatePageContent(pageId, blocks);
    };
 
    if (!page) return <div>Sayfa yükleniyor...</div>

    return (
        <div className="editor-container -ml-12 w-full"> 
            <BlockNoteView 
                editor={editor} 
                theme="dark" // Force dark theme to match app style
                onChange={onChange}
                className="min-h-[500px]"
            />
        </div>
    );
}
