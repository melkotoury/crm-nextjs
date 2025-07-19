import prisma from '@/lib/prisma';

export const meetingResolvers = {
  Query: {
    meetings: async () => {
      return prisma.meeting.findMany();
    },
    meeting: async (_: any, { meeting_id }: { meeting_id: string }) => {
      return prisma.meeting.findUnique({ where: { meeting_id: parseInt(meeting_id) } });
    },
  },
  Mutation: {
    addMeeting: async (_: any, args: any) => {
      return prisma.meeting.create({ data: args });
    },
    updateMeeting: async (_: any, { meeting_id, ...args }: { meeting_id: string, [key: string]: any }) => {
      return prisma.meeting.update({
        where: { meeting_id: parseInt(meeting_id) },
        data: args,
      });
    },
    deleteMeeting: async (_: any, { meeting_id }: { meeting_id: string }) => {
      await prisma.meeting.delete({ where: { meeting_id: parseInt(meeting_id) } });
      return true;
    },
  },
};