import prisma from '@/lib/prisma';

export const emailResolvers = {
  Query: {
    emails: async () => {
      return prisma.email.findMany();
    },
    email: async (_: any, { email_id }: { email_id: string }) => {
      return prisma.email.findUnique({ where: { email_id: parseInt(email_id) } });
    },
  },
  Mutation: {
    addEmail: async (_: any, args: any) => {
      return prisma.email.create({ data: args });
    },
    updateEmail: async (_: any, { email_id, ...args }: { email_id: string, [key: string]: any }) => {
      return prisma.email.update({
        where: { email_id: parseInt(email_id) },
        data: args,
      });
    },
    deleteEmail: async (_: any, { email_id }: { email_id: string }) => {
      await prisma.email.delete({ where: { email_id: parseInt(email_id) } });
      return true;
    },
  },
};