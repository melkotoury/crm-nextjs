import prisma from '@/lib/prisma';

export const userResolvers = {
  Query: {
    users: async () => {
      return prisma.user.findMany();
    },
    user: async (_: any, { user_id }: { user_id: string }) => {
      return prisma.user.findUnique({ where: { user_id: parseInt(user_id) } });
    },
  },
  Mutation: {
    addUser: async (_: any, args: any) => {
      return prisma.user.create({ data: args });
    },
    updateUser: async (_: any, { user_id, ...args }: { user_id: string, [key: string]: any }) => {
      return prisma.user.update({
        where: { user_id: parseInt(user_id) },
        data: args,
      });
    },
    deleteUser: async (_: any, { user_id }: { user_id: string }) => {
      await prisma.user.delete({ where: { user_id: parseInt(user_id) } });
      return true;
    },
  },
};