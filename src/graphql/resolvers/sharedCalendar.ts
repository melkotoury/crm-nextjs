import prisma from '@/lib/prisma';

export const sharedCalendarResolvers = {
  Query: {
    sharedCalendars: async () => {
      return prisma.sharedCalendar.findMany();
    },
    sharedCalendar: async (_: any, { calendar_id }: { calendar_id: string }) => {
      return prisma.sharedCalendar.findUnique({ where: { calendar_id: parseInt(calendar_id) } });
    },
  },
  Mutation: {
    addSharedCalendar: async (_: any, args: any) => {
      return prisma.sharedCalendar.create({ data: args });
    },
    updateSharedCalendar: async (_: any, { calendar_id, ...args }: { calendar_id: string, [key: string]: any }) => {
      return prisma.sharedCalendar.update({
        where: { calendar_id: parseInt(calendar_id) },
        data: args,
      });
    },
    deleteSharedCalendar: async (_: any, { calendar_id }: { calendar_id: string }) => {
      await prisma.sharedCalendar.delete({ where: { calendar_id: parseInt(calendar_id) } });
      return true;
    },
  },
};