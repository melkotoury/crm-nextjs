import prisma from '@/lib/prisma';

export const ticketResolvers = {
  Query: {
    tickets: async () => {
      return prisma.ticket.findMany();
    },
    ticket: async (_: any, { ticket_id }: { ticket_id: string }) => {
      return prisma.ticket.findUnique({ where: { ticket_id: parseInt(ticket_id) } });
    },
  },
  Mutation: {
    addTicket: async (_: any, args: any) => {
      return prisma.ticket.create({ data: args });
    },
    updateTicket: async (_: any, { ticket_id, ...args }: { ticket_id: string, [key: string]: any }) => {
      return prisma.ticket.update({
        where: { ticket_id: parseInt(ticket_id) },
        data: args,
      });
    },
    deleteTicket: async (_: any, { ticket_id }: { ticket_id: string }) => {
      await prisma.ticket.delete({ where: { ticket_id: parseInt(ticket_id) } });
      return true;
    },
  },
};