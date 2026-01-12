import React from 'react'

interface DatabaseViewProps {
    documentId: string
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({ documentId }) => {
    return (
        <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center text-notion-muted">
                <p className="text-lg mb-2">Database View</p>
                <p className="text-sm">Property system ready. UI components coming next.</p>
                <p className="text-xs mt-4 opacity-50">Document ID: {documentId}</p>
            </div>
        </div>
    )
}