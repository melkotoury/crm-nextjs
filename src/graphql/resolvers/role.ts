import prisma from '@/lib/prisma';

export const roleResolvers = {
  Query: {
    roles: async () => {
      return prisma.role.findMany();
    },
    role: async (_: any, { role_id }: { role_id: string }) => {
      return prisma.role.findUnique({ where: { role_id: parseInt(role_id) } });
    },
  },
  Mutation: {
    addRole: async (_: any, args: any) => {
      return prisma.role.create({ data: args });
    },
    updateRole: async (_: any, { role_id, ...args }: { role_id: string, [key: string]: any }) => {
      return prisma.role.update({
        where: { role_id: parseInt(role_id) },
        data: args,
      });
    },
    deleteRole: async (_: any, { role_id }: { role_id: string }) => {
      await prisma.role.delete({ where: { role_id: parseInt(role_id) } });
      return true;
    },
  },
};