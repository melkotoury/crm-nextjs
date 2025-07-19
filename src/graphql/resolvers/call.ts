import prisma from '@/lib/prisma';

export const callResolvers = {
  Query: {
    calls: async () => {
      return prisma.call.findMany();
    },
    call: async (_: any, { call_id }: { call_id: string }) => {
      return prisma.call.findUnique({ where: { call_id: parseInt(call_id) } });
    },
  },
  Mutation: {
    addCall: async (_: any, args: any) => {
      return prisma.call.create({ data: args });
    },
    updateCall: async (_: any, { call_id, ...args }: { call_id: string, [key: string]: any }) => {
      return prisma.call.update({
        where: { call_id: parseInt(call_id) },
        data: args,
      });
    },
    deleteCall: async (_: any, { call_id }: { call_id: string }) => {
      await prisma.call.delete({ where: { call_id: parseInt(call_id) } });
      return true;
    },
  },
};