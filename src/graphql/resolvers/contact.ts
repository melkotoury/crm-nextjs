import prisma from '@/lib/prisma';

export const contactResolvers = {
  Query: {
    contacts: async () => {
      return prisma.contact.findMany();
    },
    contact: async (_: any, { contact_id }: { contact_id: string }) => {
      return prisma.contact.findUnique({ where: { contact_id: parseInt(contact_id) } });
    },
  },
  Mutation: {
    addContact: async (_: any, args: any) => {
      return prisma.contact.create({ data: args });
    },
    updateContact: async (_: any, { contact_id, ...args }: { contact_id: string, [key: string]: any }) => {
      return prisma.contact.update({
        where: { contact_id: parseInt(contact_id) },
        data: args,
      });
    },
    deleteContact: async (_: any, { contact_id }: { contact_id: string }) => {
      await prisma.contact.delete({ where: { contact_id: parseInt(contact_id) } });
      return true;
    },
  },
};