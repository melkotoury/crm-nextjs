import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const userRole = await prisma.role.upsert({
    where: { role_name: 'user' },
    update: {},
    create: { role_name: 'user' },
  });

  const adminRole = await prisma.role.upsert({
    where: { role_name: 'admin' },
    update: {},
    create: { role_name: 'admin' },
  });

  const ownerRole = await prisma.role.upsert({
    where: { role_name: 'owner' },
    update: {},
    create: { role_name: 'owner' },
  });

  // Create permissions
  const readPermission = await prisma.permission.upsert({
    where: { permission_name: 'read' },
    update: {},
    create: { permission_name: 'read' },
  });

  const writePermission = await prisma.permission.upsert({
    where: { permission_name: 'write' },
    update: {},
    create: { permission_name: 'write' },
  });

  const deletePermission = await prisma.permission.upsert({
    where: { permission_name: 'delete' },
    update: {},
    create: { permission_name: 'delete' },
  });

  // Assign permissions to roles
  await prisma.rolePermission.upsert({
    where: { role_id_permission_id: { role_id: userRole.role_id, permission_id: readPermission.permission_id } },
    update: {},
    create: { role_id: userRole.role_id, permission_id: readPermission.permission_id },
  });

  await prisma.rolePermission.upsert({
    where: { role_id_permission_id: { role_id: adminRole.role_id, permission_id: readPermission.permission_id } },
    update: {},
    create: { role_id: adminRole.role_id, permission_id: readPermission.permission_id },
  });
  await prisma.rolePermission.upsert({
    where: { role_id_permission_id: { role_id: adminRole.role_id, permission_id: writePermission.permission_id } },
    update: {},
    create: { role_id: adminRole.role_id, permission_id: writePermission.permission_id },
  });
  await prisma.rolePermission.upsert({
    where: { role_id_permission_id: { role_id: adminRole.role_id, permission_id: deletePermission.permission_id } },
    update: {},
    create: { role_id: adminRole.role_id, permission_id: deletePermission.permission_id },
  });

  await prisma.rolePermission.upsert({
    where: { role_id_permission_id: { role_id: ownerRole.role_id, permission_id: readPermission.permission_id } },
    update: {},
    create: { role_id: ownerRole.role_id, permission_id: readPermission.permission_id },
  });
  await prisma.rolePermission.upsert({
    where: { role_id_permission_id: { role_id: ownerRole.role_id, permission_id: writePermission.permission_id } },
    update: {},
    create: { role_id: ownerRole.role_id, permission_id: writePermission.permission_id },
  });

  // Create users
  const hashedPassword = await hash('password', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'user@example.com',
      password_hash: hashedPassword,
      full_name: 'Test User',
      role_id: userRole.role_id,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password_hash: hashedPassword,
      full_name: 'Admin User',
      role_id: adminRole.role_id,
    },
  });

  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      username: 'owner',
      email: 'owner@example.com',
      password_hash: hashedPassword,
      full_name: 'Owner User',
      role_id: ownerRole.role_id,
    },
  });

  // Seed contacts
  const contact1 = await prisma.contact.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone_number: '123-456-7890',
      company: 'ABC Corp',
      job_title: 'Software Engineer',
    },
  });

  const contact2 = await prisma.contact.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      phone_number: '098-765-4321',
      company: 'XYZ Inc',
      job_title: 'Project Manager',
    },
  });

  // Seed leads
  const lead1 = await prisma.lead.upsert({
    where: { email: 'lead1@example.com' },
    update: {},
    create: {
      first_name: 'Lead',
      last_name: 'One',
      email: 'lead1@example.com',
      company: 'LeadCo',
      status: 'New',
      source: 'Website',
    },
  });

  const lead2 = await prisma.lead.upsert({
    where: { email: 'lead2@example.com' },
    update: {},
    create: {
      first_name: 'Lead',
      last_name: 'Two',
      email: 'lead2@example.com',
      company: 'LeadCorp',
      status: 'Contacted',
      source: 'Referral',
    },
  });

  // Seed deals
  const deal1 = await prisma.deal.upsert({
    where: { deal_id: 1 }, // Assuming deal_id is auto-incremented, this might need adjustment if not
    update: {},
    create: {
      deal_name: 'Big Project Alpha',
      stage: 'Proposal',
      amount: 15000.00,
      close_date: new Date('2025-12-31'),
      contact_id: contact1.contact_id,
      user_id: testUser.user_id,
    },
  });

  const deal2 = await prisma.deal.upsert({
    where: { deal_id: 2 },
    update: {},
    create: {
      deal_name: 'Small Contract Beta',
      stage: 'Negotiation',
      amount: 5000.00,
      close_date: new Date('2025-11-15'),
      contact_id: contact2.contact_id,
      user_id: adminUser.user_id,
    },
  });

  // Seed campaigns
  const campaign1 = await prisma.campaign.upsert({
    where: { campaign_id: 1 },
    update: {},
    create: {
      campaign_name: 'Summer Sale 2025',
      start_date: new Date('2025-07-01'),
      end_date: new Date('2025-08-31'),
      budget: 10000.00,
      status: 'Active',
    },
  });

  // Seed emails
  await prisma.email.upsert({
    where: { email_id: 1 },
    update: {},
    create: {
      campaign_id: campaign1.campaign_id,
      subject: 'Your exclusive summer discount!',
      body: 'Hello, check out our amazing summer deals.',
      sent_date: new Date(),
      recipient_count: 1000,
      open_rate: 0.25,
      click_through_rate: 0.05,
    },
  });

  // Seed social posts
  await prisma.socialPost.upsert({
    where: { post_id: 1 },
    update: {},
    create: {
      campaign_id: campaign1.campaign_id,
      platform: 'Facebook',
      content: 'Summer Sale is live! #summersale',
      post_date: new Date(),
      likes: 150,
      shares: 20,
      comments: 10,
    },
  });

  // Seed tickets
  await prisma.ticket.upsert({
    where: { ticket_id: 1 },
    update: {},
    create: {
      subject: 'Issue with product delivery',
      description: 'Product X was not delivered on time.',
      status: 'Open',
      priority: 'High',
      contact_id: contact1.contact_id,
      user_id: testUser.user_id,
    },
  });

  // Seed knowledge base articles
  await prisma.knowledgeBaseArticle.upsert({
    where: { article_id: 1 },
    update: {},
    create: {
      title: 'How to reset your password',
      content: 'Step-by-step guide to resetting your password.',
      category: 'Account Management',
    },
  });

  // Seed reports
  await prisma.report.upsert({
    where: { report_id: 1 },
    update: {},
    create: {
      report_name: 'Monthly Sales Report',
      report_type: 'Sales',
      generated_date: new Date(),
      data: { sales: 100000, month: 'July' },
    },
  });

  // Seed dashboards
  await prisma.dashboard.upsert({
    where: { dashboard_id: 1 },
    update: {},
    create: {
      dashboard_name: 'Main Sales Dashboard',
      layout: { widgets: ['sales_chart', 'lead_funnel'] },
    },
  });

  // Seed workflows
  const workflow1 = await prisma.workflow.upsert({
    where: { workflow_id: 1 },
    update: {},
    create: {
      workflow_name: 'New Lead Nurturing',
      trigger_event: 'New Lead Created',
      is_active: true,
    },
  });

  // Seed workflow steps
  await prisma.workflowStep.upsert({
    where: { step_id: 1 },
    update: {},
    create: {
      workflow_id: workflow1.workflow_id,
      step_order: 1,
      action_type: 'Send Email',
      action_details: { template: 'Welcome Email' },
    },
  });

  // Seed calls
  await prisma.call.upsert({
    where: { call_id: 1 },
    update: {},
    create: {
      contact_id: contact1.contact_id,
      user_id: testUser.user_id,
      call_date: new Date(),
      duration_minutes: 15,
      notes: 'Discussed project requirements.',
    },
  });

  // Seed meetings
  await prisma.meeting.upsert({
    where: { meeting_id: 1 },
    update: {},
    create: {
      title: 'Project Kick-off',
      description: 'Initial meeting to discuss project scope.',
      meeting_date: new Date(),
      location: 'Online',
      contact_id: contact1.contact_id,
      user_id: adminUser.user_id,
    },
  });

  // Seed integrations
  await prisma.integration.upsert({
    where: { integration_id: 1 },
    update: {},
    create: {
      integration_name: 'Mailchimp Integration',
      api_key: 'some_api_key_here',
      status: 'active',
    },
  });

  // Seed user settings
  await prisma.userSetting.upsert({
    where: { user_id: testUser.user_id },
    update: {},
    create: {
      user_id: testUser.user_id,
      settings: { theme: 'dark', notifications: true },
    },
  });

  // Seed audit logs
  await prisma.auditLog.upsert({
    where: { log_id: 1 },
    update: {},
    create: {
      user_id: adminUser.user_id,
      action_type: 'User Login',
      entity_type: 'User',
      entity_id: adminUser.user_id,
      old_value: { status: 'logged_out' },
      new_value: { status: 'logged_in' },
    },
  });

  // Seed quotes
  await prisma.quote.upsert({
    where: { quote_id: 1 },
    update: {},
    create: {
      deal_id: deal1.deal_id,
      quote_date: new Date(),
      total_amount: 14500.00,
      status: 'Sent',
    },
  });

  // Seed proposals
  await prisma.proposal.upsert({
    where: { proposal_id: 1 },
    update: {},
    create: {
      deal_id: deal1.deal_id,
      proposal_date: new Date(),
      content: 'Detailed proposal for Project Alpha.',
      status: 'Pending',
    },
  });

  // Seed territories
  const territory1 = await prisma.territory.upsert({
    where: { territory_name: 'North East Sales' },
    update: {},
    create: {
      territory_name: 'North East Sales',
      region: 'North East',
      manager_user_id: ownerUser.user_id,
    },
  });

  // Seed team performance
  await prisma.teamPerformance.upsert({
    where: { performance_id: 1 },
    update: {},
    create: {
      user_id: testUser.user_id,
      metric_name: 'Sales Closed',
      metric_value: 5.00,
      record_date: new Date('2025-06-30'),
    },
  });

  // Seed customer lifetime value
  await prisma.customerLifetimeValue.upsert({
    where: { contact_id: contact1.contact_id },
    update: {},
    create: {
      contact_id: contact1.contact_id,
      lifetime_value: 2500.00,
      calculation_date: new Date(),
    },
  });

  // Seed churn prediction
  await prisma.churnPrediction.upsert({
    where: { contact_id: contact2.contact_id },
    update: {},
    create: {
      contact_id: contact2.contact_id,
      churn_probability: 0.15,
      prediction_date: new Date(),
    },
  });

  // Seed cross-selling opportunities
  await prisma.crossSellingOpportunity.upsert({
    where: { opportunity_id: 1 },
    update: {},
    create: {
      contact_id: contact1.contact_id,
      product_service: 'CRM Add-on',
      likelihood: 0.75,
    },
  });

  // Seed market trends
  await prisma.marketTrend.upsert({
    where: { trend_id: 1 },
    update: {},
    create: {
      trend_name: 'AI in CRM',
      description: 'Growing adoption of AI features in CRM platforms.',
      trend_date: new Date('2025-01-01'),
      impact_score: 8,
    },
  });

  // Seed user profiles
  await prisma.userProfile.upsert({
    where: { user_id: testUser.user_id },
    update: {},
    create: {
      user_id: testUser.user_id,
      bio: 'Enthusiastic CRM user.',
      profile_picture_url: 'http://example.com/user.jpg',
      social_media_links: { linkedin: 'testuser_linkedin' },
    },
  });

  // Seed data imports
  await prisma.dataImport.upsert({
    where: { import_id: 1 },
    update: {},
    create: {
      file_name: 'old_contacts.csv',
      file_type: 'CSV',
      status: 'Completed',
      imported_by: adminUser.user_id,
      imported_at: new Date(),
    },
  });

  // Seed data exports
  await prisma.dataExport.upsert({
    where: { export_id: 1 },
    update: {},
    create: {
      file_name: 'monthly_report.pdf',
      file_type: 'PDF',
      status: 'Completed',
      exported_by: adminUser.user_id,
      exported_at: new Date(),
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });