import prisma from '@/lib/prisma';

export const teamMemberResolvers = {
  Query: {
    teamMembers: async () => {
      return prisma.user.findMany(); // Assuming team members are users
    },
    teamMember: async (_: any, { user_id }: { user_id: string }) => {
      return prisma.user.findUnique({ where: { user_id: parseInt(user_id) } });
    },
  },
  Mutation: {
    addTeamMember: async (_: any, args: any) => {
      // This might involve updating a user's role or creating a new user
      // For simplicity, let's assume we are updating a user's role
      return prisma.user.update({
        where: { user_id: parseInt(args.user_id) },
        data: { role: args.team_role },
      });
    },
    updateTeamMember: async (_: any, { user_id, ...args }: { user_id: string, [key: string]: any }) => {
      return prisma.user.update({
        where: { user_id: parseInt(user_id) },
        data: { role: args.team_role },
      });
    },
    deleteTeamMember: async (_: any, { user_id }: { user_id: string }) => {
      // This might involve changing a user's role or deactivating them
      // For simplicity, let's assume we are changing their role to 'user'
      await prisma.user.update({
        where: { user_id: parseInt(user_id) },
        data: { role: 'user' },
      });
      return true;
    },
  },
};