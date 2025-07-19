import prisma from '@/lib/prisma';

export const permissionResolvers = {
  Query: {
    permissions: async () => {
      return prisma.permission.findMany();
    },
    permission: async (_: any, { permission_id }: { permission_id: string }) => {
      return prisma.permission.findUnique({ where: { permission_id: parseInt(permission_id) } });
    },
  },
  Mutation: {
    addPermission: async (_: any, args: any) => {
      return prisma.permission.create({ data: args });
    },
    updatePermission: async (_: any, { permission_id, ...args }: { permission_id: string, [key: string]: any }) => {
      return prisma.permission.update({
        where: { permission_id: parseInt(permission_id) },
        data: args,
      });
    },
    deletePermission: async (_: any, { permission_id }: { permission_id: string }) => {
      await prisma.permission.delete({ where: { permission_id: parseInt(permission_id) } });
      return true;
    },
  },
};