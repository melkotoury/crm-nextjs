import prisma from '@/lib/prisma';

export const documentResolvers = {
  Query: {
    documents: async () => {
      return prisma.document.findMany();
    },
    document: async (_: any, { document_id }: { document_id: string }) => {
      return prisma.document.findUnique({ where: { document_id: parseInt(document_id) } });
    },
  },
  Mutation: {
    addDocument: async (_: any, args: any) => {
      return prisma.document.create({ data: args });
    },
    updateDocument: async (_: any, { document_id, ...args }: { document_id: string, [key: string]: any }) => {
      return prisma.document.update({
        where: { document_id: parseInt(document_id) },
        data: args,
      });
    },
    deleteDocument: async (_: any, { document_id }: { document_id: string }) => {
      await prisma.document.delete({ where: { document_id: parseInt(document_id) } });
      return true;
    },
  },
};