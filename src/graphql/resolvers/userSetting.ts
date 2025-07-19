import prisma from '@/lib/prisma';

export const userSettingResolvers = {
  Query: {
    userSettings: async () => {
      return prisma.userSetting.findMany();
    },
    userSetting: async (_: any, { user_id }: { user_id: string }) => {
      return prisma.userSetting.findUnique({ where: { user_id: parseInt(user_id) } });
    },
  },
  Mutation: {
    addUserSetting: async (_: any, args: any) => {
      const { user_id, settings } = args;
      return prisma.userSetting.upsert({
        where: { user_id: parseInt(user_id) },
        update: { settings: settings },
        create: { user_id: parseInt(user_id), settings: settings },
      });
    },
    updateUserSetting: async (_: any, { user_id, ...args }: { user_id: string, [key: string]: any }) => {
      return prisma.userSetting.update({
        where: { user_id: parseInt(user_id) },
        data: args,
      });
    },
    deleteUserSetting: async (_: any, { user_id }: { user_id: string }) => {
      await prisma.userSetting.delete({ where: { user_id: parseInt(user_id) } });
      return true;
    },
  },
};