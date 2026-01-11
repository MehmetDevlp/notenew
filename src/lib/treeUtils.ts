import { Document } from '../types'

export const buildTree = (documents: Document[]): Document[] => {
  const map = new Map<string, Document>()
  const roots: Document[] = []

  // First pass: map all documents and initialize children array
  documents.forEach(doc => {
    map.set(doc.id, { ...doc, children: [] })
  })

  // Second pass: link children to parents
  documents.forEach(doc => {
    const node = map.get(doc.id)
    if (!node) return

    if (doc.parent_id && map.has(doc.parent_id)) {
      const parent = map.get(doc.parent_id)
      parent?.children?.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}
