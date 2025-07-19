import prisma from '@/lib/prisma';

export const dataImportResolvers = {
  Query: {
    dataImports: async () => {
      return prisma.dataImport.findMany();
    },
    dataImport: async (_: any, { import_id }: { import_id: string }) => {
      return prisma.dataImport.findUnique({ where: { import_id: parseInt(import_id) } });
    },
  },
  Mutation: {
    addDataImport: async (_: any, args: any) => {
      return prisma.dataImport.create({ data: args });
    },
    updateDataImport: async (_: any, { import_id, ...args }: { import_id: string, [key: string]: any }) => {
      return prisma.dataImport.update({
        where: { import_id: parseInt(import_id) },
        data: args,
      });
    },
    deleteDataImport: async (_: any, { import_id }: { import_id: string }) => {
      await prisma.dataImport.delete({ where: { import_id: parseInt(import_id) } });
      return true;
    },
  },
};