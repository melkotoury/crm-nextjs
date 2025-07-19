import prisma from '@/lib/prisma';

export const dataExportResolvers = {
  Query: {
    dataExports: async () => {
      return prisma.dataExport.findMany();
    },
    dataExport: async (_: any, { export_id }: { export_id: string }) => {
      return prisma.dataExport.findUnique({ where: { export_id: parseInt(export_id) } });
    },
  },
  Mutation: {
    addDataExport: async (_: any, args: any) => {
      return prisma.dataExport.create({ data: args });
    },
    updateDataExport: async (_: any, { export_id, ...args }: { export_id: string, [key: string]: any }) => {
      return prisma.dataExport.update({
        where: { export_id: parseInt(export_id) },
        data: args,
      });
    },
    deleteDataExport: async (_: any, { export_id }: { export_id: string }) => {
      await prisma.dataExport.delete({ where: { export_id: parseInt(export_id) } });
      return true;
    },
  },
};