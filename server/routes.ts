import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function routes(fastify: FastifyInstance) {
  
  // --- PAGES ---

  // Get Workspace Pages (Sidebar Tree)
  fastify.get('/api/workspaces/:id/pages', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const pages = await prisma.page.findMany({
      where: { 
        workspaceId: req.params.id,
        parentId: null, // Root pages
        databaseId: null // Not rows
      },
      include: {
        children: {
          select: { id: true, title: true, icon: true }
        }
      }
    })
    return pages
  })

  // Get Single Page (with Blocks)
  fastify.get('/api/pages/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const page = await prisma.page.findUnique({
      where: { id: req.params.id },
      include: {
        blocks: {
          orderBy: { order: 'asc' }
        },
        properties: true
      }
    })
    return page
  })

  // Create Page
  fastify.post('/api/pages', async (req: FastifyRequest<{ Body: { title?: string, workspaceId: string, parentId?: string } }>, reply: FastifyReply) => {
    const { title, workspaceId, parentId } = req.body
    const page = await prisma.page.create({
      data: {
        title: title || 'Untitled',
        workspaceId,
        parentId
      }
    })
    return page
  })

  // --- BLOCKS (The Core Editor Logic) ---

  // Sync Blocks (Bulk Update for DnD / Editing)
  fastify.post('/api/pages/:id/blocks/sync', async (req: FastifyRequest<{ Params: { id: string }, Body: { blocks: any[] } }>, reply: FastifyReply) => {
    const { blocks } = req.body // Array of blocks with updated order/content
    const pageId = req.params.id

    // Transactional update
    await prisma.$transaction(
      blocks.map((block: any) => 
        prisma.block.upsert({
          where: { id: block.id },
          update: {
            content: block.content,
            order: block.order,
            type: block.type
          },
          create: {
            id: block.id,
            pageId,
            type: block.type,
            content: block.content,
            order: block.order
          }
        })
      )
    )
    
    return { success: true }
  })

  // Delete Block
  fastify.delete('/api/blocks/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    await prisma.block.delete({
      where: { id: req.params.id }
    })
    return { success: true }
  })

  // --- REALTIME (WebSockets Mock) ---
  // In a real app, use fastify-socket.io here to emit 'page:update' events
}
