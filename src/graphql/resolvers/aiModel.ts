import prisma from '@/lib/prisma';

export const aiModelResolvers = {
  Query: {
    aiModels: async () => {
      return prisma.aIModel.findMany();
    },
    aiModel: async (_: any, { model_id }: { model_id: string }) => {
      return prisma.aIModel.findUnique({ where: { model_id: parseInt(model_id) } });
    },
  },
  Mutation: {
    addAIModel: async (_: any, args: any) => {
      return prisma.aIModel.create({ data: args });
    },
    updateAIModel: async (_: any, { model_id, ...args }: { model_id: string, [key: string]: any }) => {
      return prisma.aIModel.update({
        where: { model_id: parseInt(model_id) },
        data: args,
      });
    },
    deleteAIModel: async (_: any, { model_id }: { model_id: string }) => {
      await prisma.aIModel.delete({ where: { model_id: parseInt(model_id) } });
      return true;
    },
  },
};