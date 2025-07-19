import prisma from '@/lib/prisma';

export const userProfileResolvers = {
  Query: {
    userProfiles: async () => {
      return prisma.userProfile.findMany();
    },
    userProfile: async (_: any, { profile_id }: { profile_id: string }) => {
      return prisma.userProfile.findUnique({ where: { profile_id: parseInt(profile_id) } });
    },
  },
  Mutation: {
    addUserProfile: async (_: any, args: any) => {
      return prisma.userProfile.create({ data: args });
    },
    updateUserProfile: async (_: any, { profile_id, ...args }: { profile_id: string, [key: string]: any }) => {
      return prisma.userProfile.update({
        where: { profile_id: parseInt(profile_id) },
        data: args,
      });
    },
    deleteUserProfile: async (_: any, { profile_id }: { profile_id: string }) => {
      await prisma.userProfile.delete({ where: { profile_id: parseInt(profile_id) } });
      return true;
    },
  },
};