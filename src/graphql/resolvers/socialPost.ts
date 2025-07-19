import prisma from '@/lib/prisma';

export const socialPostResolvers = {
  Query: {
    socialPosts: async () => {
      return prisma.socialPost.findMany();
    },
    socialPost: async (_: any, { post_id }: { post_id: string }) => {
      return prisma.socialPost.findUnique({ where: { post_id: parseInt(post_id) } });
    },
  },
  Mutation: {
    addSocialPost: async (_: any, args: any) => {
      return prisma.socialPost.create({ data: args });
    },
    updateSocialPost: async (_: any, { post_id, ...args }: { post_id: string, [key: string]: any }) => {
      return prisma.socialPost.update({
        where: { post_id: parseInt(post_id) },
        data: args,
      });
    },
    deleteSocialPost: async (_: any, { post_id }: { post_id: string }) => {
      await prisma.socialPost.delete({ where: { post_id: parseInt(post_id) } });
      return true;
    },
  },
};