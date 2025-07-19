import { gql } from 'graphql-tag';
import pool from '@/db';

export const typeDefs = gql`
  type Contact {
    contact_id: ID!
    first_name: String!
    last_name: String!
    email: String!
    phone_number: String
    company: String
    job_title: String
  }

  type Lead {
    lead_id: ID!
    first_name: String!
    last_name: String!
    email: String!
    company: String
    status: String!
    source: String
  }

  type Deal {
    deal_id: ID!
    deal_name: String!
    stage: String!
    amount: Float
    close_date: String
    contact_id: ID
    user_id: ID
  }

  type Campaign {
    campaign_id: ID!
    campaign_name: String!
    start_date: String
    end_date: String
    budget: Float
    status: String
  }

  type Email {
    email_id: ID!
    campaign_id: ID
    subject: String!
    body: String
    sent_date: String
    recipient_count: Int
    open_rate: Float
    click_through_rate: Float
  }

  type SocialPost {
    post_id: ID!
    campaign_id: ID
    platform: String!
    content: String!
    post_date: String
    likes: Int
    shares: Int
    comments: Int
  }

  type Ticket {
    ticket_id: ID!
    subject: String!
    description: String
    status: String
    priority: String
    contact_id: ID
    user_id: ID
  }

  type KnowledgeBaseArticle {
    article_id: ID!
    title: String!
    content: String
    category: String
  }

  type Report {
    report_id: ID!
    report_name: String!
    report_type: String
    generated_date: String
    data: String
  }

  type Dashboard {
    dashboard_id: ID!
    dashboard_name: String!
    layout: String
  }

  type Workflow {
    workflow_id: ID!
    workflow_name: String!
    trigger_event: String
    is_active: Boolean
  }

  type WorkflowStep {
    step_id: ID!
    workflow_id: ID!
    step_order: Int!
    action_type: String!
    action_details: String
  }

  type Call {
    call_id: ID!
    contact_id: ID
    user_id: ID
    call_date: String!
    duration_minutes: Int
    notes: String
  }

  type Meeting {
    meeting_id: ID!
    title: String!
    description: String
    meeting_date: String!
    location: String
    contact_id: ID
    user_id: ID
  }

  type Integration {
    integration_id: ID!
    integration_name: String!
    api_key: String
    status: String
  }

  type Role {
    role_id: ID!
    role_name: String!
  }

  type Permission {
    permission_id: ID!
    permission_name: String!
  }

  type SharedCalendar {
    calendar_id: ID!
    calendar_name: String!
    owner_user_id: ID
  }

  type Document {
    document_id: ID!
    document_name: String!
    document_url: String!
    owner_user_id: ID
  }

  type TeamMember {
    team_member_id: ID!
    user_id: ID!
    team_role: String
  }

  type AIModel {
    model_id: ID!
    model_name: String!
    model_type: String
    description: String
  }

  type Prediction {
    prediction_id: ID!
    model_id: ID
    entity_type: String!
    entity_id: ID!
    predicted_value: String
    prediction_date: String
  }

  type UserProfile {
    profile_id: ID!
    user_id: ID!
    bio: String
    profile_picture_url: String
    social_media_links: String
  }

  type UserSetting {
    user_id: ID!
    settings: String
  }

  type AuditLog {
    log_id: ID!
    user_id: ID
    action_type: String!
    entity_type: String
    entity_id: ID
    old_value: String
    new_value: String
    timestamp: String
  }

  type Quote {
    quote_id: ID!
    deal_id: ID
    quote_date: String
    total_amount: Float
    status: String
  }

  type Proposal {
    proposal_id: ID!
    deal_id: ID
    proposal_date: String
    content: String
    status: String
  }

  type Territory {
    territory_id: ID!
    territory_name: String!
    region: String
    manager_user_id: ID
  }

  type TeamPerformance {
    performance_id: ID!
    user_id: ID
    metric_name: String!
    metric_value: Float
    record_date: String
  }

  type CustomerLifetimeValue {
    clv_id: ID!
    contact_id: ID
    lifetime_value: Float
    calculation_date: String
  }

  type ChurnPrediction {
    churn_id: ID!
    contact_id: ID
    churn_probability: Float
    prediction_date: String
  }

  type CrossSellingOpportunity {
    opportunity_id: ID!
    contact_id: ID
    product_service: String
    likelihood: Float
  }

  type MarketTrend {
    trend_id: ID!
    trend_name: String!
    description: String
    trend_date: String
    impact_score: Int
  }

  type Query {
    hello: String
    contacts: [Contact]
    leads: [Lead]
    deals: [Deal]
    campaigns: [Campaign]
    emails: [Email]
    socialPosts: [SocialPost]
    tickets: [Ticket]
    knowledgeBaseArticles: [KnowledgeBaseArticle]
    reports: [Report]
    dashboards: [Dashboard]
    workflows: [Workflow]
    workflowSteps: [WorkflowStep]
    calls: [Call]
    meetings: [Meeting]
    integrations: [Integration]
    roles: [Role]
    permissions: [Permission]
    sharedCalendars: [SharedCalendar]
    documents: [Document]
    teamMembers: [TeamMember]
    aiModels: [AIModel]
    predictions: [Prediction]
    userProfiles: [UserProfile]
    userSettings: [UserSetting]
    auditLogs: [AuditLog]
    quotes: [Quote]
    proposals: [Proposal]
    territories: [Territory]
    teamPerformance: [TeamPerformance]
    customerLifetimeValues: [CustomerLifetimeValue]
    churnPredictions: [ChurnPrediction]
    crossSellingOpportunities: [CrossSellingOpportunity]
    marketTrends: [MarketTrend]
  }

  type Mutation {
    addContact(
      first_name: String!
      last_name: String!
      email: String!
      phone_number: String
      company: String
      job_title: String
    ): Contact
    addLead(
      first_name: String!
      last_name: String!
      email: String!
      company: String
      status: String!
      source: String
    ): Lead
    addDeal(
      deal_name: String!
      stage: String!
      amount: Float
      close_date: String
      contact_id: ID
      user_id: ID
    ): Deal
    addCampaign(
      campaign_name: String!
      start_date: String
      end_date: String
      budget: Float
      status: String
    ): Campaign
    addEmail(
      campaign_id: ID
      subject: String!
      body: String
      sent_date: String
      recipient_count: Int
      open_rate: Float
      click_through_rate: Float
    ): Email
    addSocialPost(
      campaign_id: ID
      platform: String!
      content: String!
      post_date: String
      likes: Int
      shares: Int
      comments: Int
    ): SocialPost
    addTicket(
      subject: String!
      description: String
      status: String
      priority: String
      contact_id: ID
      user_id: ID
    ): Ticket
    addKnowledgeBaseArticle(
      title: String!
      content: String
      category: String
    ): KnowledgeBaseArticle
    addReport(
      report_name: String!
      report_type: String
      generated_date: String
      data: String
    ): Report
    addDashboard(
      dashboard_name: String!
      layout: String
    ): Dashboard
    addWorkflow(
      workflow_name: String!
      trigger_event: String
      is_active: Boolean
    ): Workflow
    addWorkflowStep(
      workflow_id: ID!
      step_order: Int!
      action_type: String!
      action_details: String
    ): WorkflowStep
    addCall(
      contact_id: ID
      user_id: ID
      call_date: String!
      duration_minutes: Int
      notes: String
    ): Call
    addMeeting(
      title: String!
      description: String
      meeting_date: String!
      location: String
      contact_id: ID
      user_id: ID
    ): Meeting
    addIntegration(
      integration_name: String!
      api_key: String
      status: String
    ): Integration
    addRole(
      role_name: String!
    ): Role
    addPermission(
      permission_name: String!
    ): Permission
    addRolePermission(
      role_id: ID!
      permission_id: ID!
    ): Boolean
    addSharedCalendar(
      calendar_name: String!
      owner_user_id: ID
    ): SharedCalendar
    addDocument(
      document_name: String!
      document_url: String!
      owner_user_id: ID
    ): Document
    addTeamMember(
      user_id: ID!
      team_role: String
    ): TeamMember
    addAIModel(
      model_name: String!
      model_type: String
      description: String
    ): AIModel
    addPrediction(
      model_id: ID
      entity_type: String!
      entity_id: ID!
      predicted_value: String
    ): Prediction
    addUserProfile(
      user_id: ID!
      bio: String
      profile_picture_url: String
      social_media_links: String
    ): UserProfile
    addUserSetting(
      user_id: ID!
      settings: String
    ): UserSetting
    addAuditLog(
      user_id: ID
      action_type: String!
      entity_type: String
      entity_id: ID
      old_value: String
      new_value: String
    ): AuditLog
  }
`;

export const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    contacts: async () => {
      const { rows } = await pool.query('SELECT * FROM contacts');
      return rows;
    },
    leads: async () => {
      const { rows } = await pool.query('SELECT * FROM leads');
      return rows;
    },
    deals: async () => {
      const { rows } = await pool.query('SELECT * FROM deals');
      return rows;
    },
    campaigns: async () => {
      const { rows } = await pool.query('SELECT * FROM campaigns');
      return rows;
    },
    emails: async () => {
      const { rows } = await pool.query('SELECT * FROM emails');
      return rows;
    },
    socialPosts: async () => {
      const { rows } = await pool.query('SELECT * FROM social_posts');
      return rows;
    },
    tickets: async () => {
      const { rows } = await pool.query('SELECT * FROM tickets');
      return rows;
    },
    knowledgeBaseArticles: async () => {
      const { rows } = await pool.query('SELECT * FROM knowledge_base_articles');
      return rows;
    },
    reports: async () => {
      const { rows } = await pool.query('SELECT * FROM reports');
      return rows;
    },
    dashboards: async () => {
      const { rows } = await pool.query('SELECT * FROM dashboards');
      return rows;
    },
    workflows: async () => {
      const { rows } = await pool.query('SELECT * FROM workflows');
      return rows;
    },
    workflowSteps: async () => {
      const { rows } = await pool.query('SELECT * FROM workflow_steps');
      return rows;
    },
    calls: async () => {
      const { rows } = await pool.query('SELECT * FROM calls');
      return rows;
    },
    meetings: async () => {
      const { rows } = await pool.query('SELECT * FROM meetings');
      return rows;
    },
    integrations: async () => {
      const { rows } = await pool.query('SELECT * FROM integrations');
      return rows;
    },
    roles: async () => {
      const { rows } = await pool.query('SELECT * FROM roles');
      return rows;
    },
    permissions: async () => {
      const { rows } = await pool.query('SELECT * FROM permissions');
      return rows;
    },
    sharedCalendars: async () => {
      const { rows } = await pool.query('SELECT * FROM shared_calendars');
      return rows;
    },
    documents: async () => {
      const { rows } = await pool.query('SELECT * FROM documents');
      return rows;
    },
    teamMembers: async () => {
      const { rows } = await pool.query('SELECT * FROM team_members');
      return rows;
    },
    aiModels: async () => {
      const { rows } = await pool.query('SELECT * FROM ai_models');
      return rows;
    },
    predictions: async () => {
      const { rows } = await pool.query('SELECT * FROM predictions');
      return rows;
    },
    userProfiles: async () => {
      const { rows } = await pool.query('SELECT * FROM user_profiles');
      return rows;
    },
    userSettings: async () => {
      const { rows } = await pool.query('SELECT * FROM user_settings');
      return rows;
    },
    auditLogs: async () => {
      const { rows } = await pool.query('SELECT * FROM audit_logs');
      return rows;
    },
  },
  Mutation: {
    addContact: async (_: any, args: any) => {
      const { first_name, last_name, email, phone_number, company, job_title } = args;
      const { rows } = await pool.query(
        'INSERT INTO contacts (first_name, last_name, email, phone_number, company, job_title) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [first_name, last_name, email, phone_number, company, job_title]
      );
      return rows[0];
    },
    addLead: async (_: any, args: any) => {
      const { first_name, last_name, email, company, status, source } = args;
      const { rows } = await pool.query(
        'INSERT INTO leads (first_name, last_name, email, company, status, source) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [first_name, last_name, email, company, status, source]
      );
      return rows[0];
    },
    addDeal: async (_: any, args: any) => {
      const { deal_name, stage, amount, close_date, contact_id, user_id } = args;
      const { rows } = await pool.query(
        'INSERT INTO deals (deal_name, stage, amount, close_date, contact_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [deal_name, stage, amount, close_date, contact_id, user_id]
      );
      return rows[0];
    },
    addCampaign: async (_: any, args: any) => {
      const { campaign_name, start_date, end_date, budget, status } = args;
      const { rows } = await pool.query(
        'INSERT INTO campaigns (campaign_name, start_date, end_date, budget, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [campaign_name, start_date, end_date, budget, status]
      );
      return rows[0];
    },
    addEmail: async (_: any, args: any) => {
      const { campaign_id, subject, body, sent_date, recipient_count, open_rate, click_through_rate } = args;
      const { rows } = await pool.query(
        'INSERT INTO emails (campaign_id, subject, body, sent_date, recipient_count, open_rate, click_through_rate) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [campaign_id, subject, body, sent_date, recipient_count, open_rate, click_through_rate]
      );
      return rows[0];
    },
    addSocialPost: async (_: any, args: any) => {
      const { campaign_id, platform, content, post_date, likes, shares, comments } = args;
      const { rows } = await pool.query(
        'INSERT INTO social_posts (campaign_id, platform, content, post_date, likes, shares, comments) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [campaign_id, platform, content, post_date, likes, shares, comments]
      );
      return rows[0];
    },
    addTicket: async (_: any, args: any) => {
      const { subject, description, status, priority, contact_id, user_id } = args;
      const { rows } = await pool.query(
        'INSERT INTO tickets (subject, description, status, priority, contact_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [subject, description, status, priority, contact_id, user_id]
      );
      return rows[0];
    },
    addKnowledgeBaseArticle: async (_: any, args: any) => {
      const { title, content, category } = args;
      const { rows } = await pool.query(
        'INSERT INTO knowledge_base_articles (title, content, category) VALUES ($1, $2, $3) RETURNING *',
        [title, content, category]
      );
      return rows[0];
    },
    addReport: async (_: any, args: any) => {
      const { report_name, report_type, generated_date, data } = args;
      const { rows } = await pool.query(
        'INSERT INTO reports (report_name, report_type, generated_date, data) VALUES ($1, $2, $3, $4) RETURNING *',
        [report_name, report_type, generated_date, data]
      );
      return rows[0];
    },
    addDashboard: async (_: any, args: any) => {
      const { dashboard_name, layout } = args;
      const { rows } = await pool.query(
        'INSERT INTO dashboards (dashboard_name, layout) VALUES ($1, $2) RETURNING *',
        [dashboard_name, layout]
      );
      return rows[0];
    },
    addWorkflow: async (_: any, args: any) => {
      const { workflow_name, trigger_event, is_active } = args;
      const { rows } = await pool.query(
        'INSERT INTO workflows (workflow_name, trigger_event, is_active) VALUES ($1, $2, $3) RETURNING *',
        [workflow_name, trigger_event, is_active]
      );
      return rows[0];
    },
    addWorkflowStep: async (_: any, args: any) => {
      const { workflow_id, step_order, action_type, action_details } = args;
      const { rows } = await pool.query(
        'INSERT INTO workflow_steps (workflow_id, step_order, action_type, action_details) VALUES ($1, $2, $3, $4) RETURNING *',
        [workflow_id, step_order, action_type, action_details]
      );
      return rows[0];
    },
    addCall: async (_: any, args: any) => {
      const { contact_id, user_id, call_date, duration_minutes, notes } = args;
      const { rows } = await pool.query(
        'INSERT INTO calls (contact_id, user_id, call_date, duration_minutes, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [contact_id, user_id, call_date, duration_minutes, notes]
      );
      return rows[0];
    },
    addMeeting: async (_: any, args: any) => {
      const { title, description, meeting_date, location, contact_id, user_id } = args;
      const { rows } = await pool.query(
        'INSERT INTO meetings (title, description, meeting_date, location, contact_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description, meeting_date, location, contact_id, user_id]
      );
      return rows[0];
    },
    addIntegration: async (_: any, args: any) => {
      const { integration_name, api_key, status } = args;
      const { rows } = await pool.query(
        'INSERT INTO integrations (integration_name, api_key, status) VALUES ($1, $2, $3) RETURNING *',
        [integration_name, api_key, status]
      );
      return rows[0];
    },
    addRole: async (_: any, args: any) => {
      const { role_name } = args;
      const { rows } = await pool.query(
        'INSERT INTO roles (role_name) VALUES ($1) RETURNING *',
        [role_name]
      );
      return rows[0];
    },
    addPermission: async (_: any, args: any) => {
      const { permission_name } = args;
      const { rows } = await pool.query(
        'INSERT INTO permissions (permission_name) VALUES ($1) RETURNING *',
        [permission_name]
      );
      return rows[0];
    },
    addRolePermission: async (_: any, args: any) => {
      const { role_id, permission_id } = args;
      await pool.query(
        'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
        [role_id, permission_id]
      );
      return true;
    },
    addSharedCalendar: async (_: any, args: any) => {
      const { calendar_name, owner_user_id } = args;
      const { rows } = await pool.query(
        'INSERT INTO shared_calendars (calendar_name, owner_user_id) VALUES ($1, $2) RETURNING *',
        [calendar_name, owner_user_id]
      );
      return rows[0];
    },
    addDocument: async (_: any, args: any) => {
      const { document_name, document_url, owner_user_id } = args;
      const { rows } = await pool.query(
        'INSERT INTO documents (document_name, document_url, owner_user_id) VALUES ($1, $2, $3) RETURNING *',
        [document_name, document_url, owner_user_id]
      );
      return rows[0];
    },
    addTeamMember: async (_: any, args: any) => {
      const { user_id, team_role } = args;
      const { rows } = await pool.query(
        'INSERT INTO team_members (user_id, team_role) VALUES ($1, $2) RETURNING *',
        [user_id, team_role]
      );
      return rows[0];
    },
    addAIModel: async (_: any, args: any) => {
      const { model_name, model_type, description } = args;
      const { rows } = await pool.query(
        'INSERT INTO ai_models (model_name, model_type, description) VALUES ($1, $2, $3) RETURNING *',
        [model_name, model_type, description]
      );
      return rows[0];
    },
    addPrediction: async (_: any, args: any) => {
      const { model_id, entity_type, entity_id, predicted_value } = args;
      const { rows } = await pool.query(
        'INSERT INTO predictions (model_id, entity_type, entity_id, predicted_value) VALUES ($1, $2, $3, $4) RETURNING *',
        [model_id, entity_type, entity_id, predicted_value]
      );
      return rows[0];
    },
    addUserProfile: async (_: any, args: any) => {
      const { user_id, bio, profile_picture_url, social_media_links } = args;
      const { rows } = await pool.query(
        'INSERT INTO user_profiles (user_id, bio, profile_picture_url, social_media_links) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, bio, profile_picture_url, social_media_links]
      );
      return rows[0];
    },
    addUserSetting: async (_: any, args: any) => {
      const { user_id, settings } = args;
      const { rows } = await pool.query(
        'INSERT INTO user_settings (user_id, settings) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET settings = EXCLUDED.settings RETURNING *',
        [user_id, settings]
      );
      return rows[0];
    },
    addAuditLog: async (_: any, args: any) => {
      const { user_id, action_type, entity_type, entity_id, old_value, new_value } = args;
      const { rows } = await pool.query(
        'INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, old_value, new_value) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [user_id, action_type, entity_type, entity_id, old_value, new_value]
      );
      return rows[0];
    },
  },
};
`;

export const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    contacts: async () => {
      const { rows } = await pool.query('SELECT * FROM contacts');
      return rows;
    },
    leads: async () => {
      const { rows } = await pool.query('SELECT * FROM leads');
      return rows;
    },
    deals: async () => {
      const { rows } = await pool.query('SELECT * FROM deals');
      return rows;
    },
    campaigns: async () => {
      const { rows } = await pool.query('SELECT * FROM campaigns');
      return rows;
    },
    emails: async () => {
      const { rows } = await pool.query('SELECT * FROM emails');
      return rows;
    },
    socialPosts: async () => {
      const { rows } = await pool.query('SELECT * FROM social_posts');
      return rows;
    },
    tickets: async () => {
      const { rows } = await pool.query('SELECT * FROM tickets');
      return rows;
    },
    knowledgeBaseArticles: async () => {
      const { rows } = await pool.query('SELECT * FROM knowledge_base_articles');
      return rows;
    },
    reports: async () => {
      const { rows } = await pool.query('SELECT * FROM reports');
      return rows;
    },
    dashboards: async () => {
      const { rows } = await pool.query('SELECT * FROM dashboards');
      return rows;
    },
    workflows: async () => {
      const { rows } = await pool.query('SELECT * FROM workflows');
      return rows;
    },
    workflowSteps: async () => {
      const { rows } = await pool.query('SELECT * FROM workflow_steps');
      return rows;
    },
    calls: async () => {
      const { rows } = await pool.query('SELECT * FROM calls');
      return rows;
    },
    meetings: async () => {
      const { rows } = await pool.query('SELECT * FROM meetings');
      return rows;
    },
    integrations: async () => {
      const { rows } = await pool.query('SELECT * FROM integrations');
      return rows;
    },
    roles: async () => {
      const { rows } = await pool.query('SELECT * FROM roles');
      return rows;
    },
    permissions: async () => {
      const { rows } = await pool.query('SELECT * FROM permissions');
      return rows;
    },
    sharedCalendars: async () => {
      const { rows } = await pool.query('SELECT * FROM shared_calendars');
      return rows;
    },
    documents: async () => {
      const { rows } = await pool.query('SELECT * FROM documents');
      return rows;
    },
    teamMembers: async () => {
      const { rows } = await pool.query('SELECT * FROM team_members');
      return rows;
    },
    aiModels: async () => {
      const { rows } = await pool.query('SELECT * FROM ai_models');
      return rows;
    },
    predictions: async () => {
      const { rows } = await pool.query('SELECT * FROM predictions');
      return rows;
    },
    userProfiles: async () => {
      const { rows } = await pool.query('SELECT * FROM user_profiles');
      return rows;
    },
    userSettings: async () => {
      const { rows } = await pool.query('SELECT * FROM user_settings');
      return rows;
    },
    auditLogs: async () => {
      const { rows } = await pool.query('SELECT * FROM audit_logs');
      return rows;
    },
  },
  Mutation: {
    addContact: async (_: any, args: any) => {
      const { first_name, last_name, email, phone_number, company, job_title } = args;
      const { rows } = await pool.query(
        'INSERT INTO contacts (first_name, last_name, email, phone_number, company, job_title) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [first_name, last_name, email, phone_number, company, job_title]
      );
      return rows[0];
    },
    addLead: async (_: any, args: any) => {
      const { first_name, last_name, email, company, status, source } = args;
      const { rows } = await pool.query(
        'INSERT INTO leads (first_name, last_name, email, company, status, source) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [first_name, last_name, email, company, status, source]
      );
      return rows[0];
    },
    addDeal: async (_: any, args: any) => {
      const { deal_name, stage, amount, close_date, contact_id, user_id } = args;
      const { rows } = await pool.query(
        'INSERT INTO deals (deal_name, stage, amount, close_date, contact_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [deal_name, stage, amount, close_date, contact_id, user_id]
      );
      return rows[0];
    },
    addCampaign: async (_: any, args: any) => {
      const { campaign_name, start_date, end_date, budget, status } = args;
      const { rows } = await pool.query(
        'INSERT INTO campaigns (campaign_name, start_date, end_date, budget, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [campaign_name, start_date, end_date, budget, status]
      );
      return rows[0];
    },
    addEmail: async (_: any, args: any) => {
      const { campaign_id, subject, body, sent_date, recipient_count, open_rate, click_through_rate } = args;
      const { rows } = await pool.query(
        'INSERT INTO emails (campaign_id, subject, body, sent_date, recipient_count, open_rate, click_through_rate) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [campaign_id, subject, body, sent_date, recipient_count, open_rate, click_through_rate]
      );
      return rows[0];
    },
    addSocialPost: async (_: any, args: any) => {
      const { campaign_id, platform, content, post_date, likes, shares, comments } = args;
      const { rows } = await pool.query(
        'INSERT INTO social_posts (campaign_id, platform, content, post_date, likes, shares, comments) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [campaign_id, platform, content, post_date, likes, shares, comments]
      );
      return rows[0];
    },
    addTicket: async (_: any, args: any) => {
      const { subject, description, status, priority, contact_id, user_id } = args;
      const { rows } = await pool.query(
        'INSERT INTO tickets (subject, description, status, priority, contact_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [subject, description, status, priority, contact_id, user_id]
      );
      return rows[0];
    },
    addKnowledgeBaseArticle: async (_: any, args: any) => {
      const { title, content, category } = args;
      const { rows } = await pool.query(
        'INSERT INTO knowledge_base_articles (title, content, category) VALUES ($1, $2, $3) RETURNING *',
        [title, content, category]
      );
      return rows[0];
    },
    addReport: async (_: any, args: any) => {
      const { report_name, report_type, generated_date, data } = args;
      const { rows } = await pool.query(
        'INSERT INTO reports (report_name, report_type, generated_date, data) VALUES ($1, $2, $3, $4) RETURNING *',
        [report_name, report_type, generated_date, data]
      );
      return rows[0];
    },
    addDashboard: async (_: any, args: any) => {
      const { dashboard_name, layout } = args;
      const { rows } = await pool.query(
        'INSERT INTO dashboards (dashboard_name, layout) VALUES ($1, $2) RETURNING *',
        [dashboard_name, layout]
      );
      return rows[0];
    },
    addWorkflow: async (_: any, args: any) => {
      const { workflow_name, trigger_event, is_active } = args;
      const { rows } = await pool.query(
        'INSERT INTO workflows (workflow_name, trigger_event, is_active) VALUES ($1, $2, $3) RETURNING *',
        [workflow_name, trigger_event, is_active]
      );
      return rows[0];
    },
    addWorkflowStep: async (_: any, args: any) => {
      const { workflow_id, step_order, action_type, action_details } = args;
      const { rows } = await pool.query(
        'INSERT INTO workflow_steps (workflow_id, step_order, action_type, action_details) VALUES ($1, $2, $3, $4) RETURNING *',
        [workflow_id, step_order, action_type, action_details]
      );
      return rows[0];
    },
    addCall: async (_: any, args: any) => {
      const { contact_id, user_id, call_date, duration_minutes, notes } = args;
      const { rows } = await pool.query(
        'INSERT INTO calls (contact_id, user_id, call_date, duration_minutes, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [contact_id, user_id, call_date, duration_minutes, notes]
      );
      return rows[0];
    },
    addMeeting: async (_: any, args: any) => {
      const { title, description, meeting_date, location, contact_id, user_id } = args;
      const { rows } = await pool.query(
        'INSERT INTO meetings (title, description, meeting_date, location, contact_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description, meeting_date, location, contact_id, user_id]
      );
      return rows[0];
    },
    addIntegration: async (_: any, args: any) => {
      const { integration_name, api_key, status } = args;
      const { rows } = await pool.query(
        'INSERT INTO integrations (integration_name, api_key, status) VALUES ($1, $2, $3) RETURNING *',
        [integration_name, api_key, status]
      );
      return rows[0];
    },
    addRole: async (_: any, args: any) => {
      const { role_name } = args;
      const { rows } = await pool.query(
        'INSERT INTO roles (role_name) VALUES ($1) RETURNING *',
        [role_name]
      );
      return rows[0];
    },
    addPermission: async (_: any, args: any) => {
      const { permission_name } = args;
      const { rows } = await pool.query(
        'INSERT INTO permissions (permission_name) VALUES ($1) RETURNING *',
        [permission_name]
      );
      return rows[0];
    },
    addRolePermission: async (_: any, args: any) => {
      const { role_id, permission_id } = args;
      await pool.query(
        'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
        [role_id, permission_id]
      );
      return true;
    },
    addSharedCalendar: async (_: any, args: any) => {
      const { calendar_name, owner_user_id } = args;
      const { rows } = await pool.query(
        'INSERT INTO shared_calendars (calendar_name, owner_user_id) VALUES ($1, $2) RETURNING *',
        [calendar_name, owner_user_id]
      );
      return rows[0];
    },
    addDocument: async (_: any, args: any) => {
      const { document_name, document_url, owner_user_id } = args;
      const { rows } = await pool.query(
        'INSERT INTO documents (document_name, document_url, owner_user_id) VALUES ($1, $2, $3) RETURNING *',
        [document_name, document_url, owner_user_id]
      );
      return rows[0];
    },
    addTeamMember: async (_: any, args: any) => {
      const { user_id, team_role } = args;
      const { rows } = await pool.query(
        'INSERT INTO team_members (user_id, team_role) VALUES ($1, $2) RETURNING *',
        [user_id, team_role]
      );
      return rows[0];
    },
    addAIModel: async (_: any, args: any) => {
      const { model_name, model_type, description } = args;
      const { rows } = await pool.query(
        'INSERT INTO ai_models (model_name, model_type, description) VALUES ($1, $2, $3) RETURNING *',
        [model_name, model_type, description]
      );
      return rows[0];
    },
    addPrediction: async (_: any, args: any) => {
      const { model_id, entity_type, entity_id, predicted_value } = args;
      const { rows } = await pool.query(
        'INSERT INTO predictions (model_id, entity_type, entity_id, predicted_value) VALUES ($1, $2, $3, $4) RETURNING *',
        [model_id, entity_type, entity_id, predicted_value]
      );
      return rows[0];
    },
    addUser: async (_: any, args: any) => {
      const { username, password_hash, email, full_name, role, role_id } = args;
      const { rows } = await pool.query(
        'INSERT INTO users (username, password_hash, email, full_name, role, role_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [username, password_hash, email, full_name, role, role_id]
      );
      return rows[0];
    },
    updateUserRole: async (_: any, args: any) => {
      const { user_id, role_id } = args;
      const { rows } = await pool.query(
        'UPDATE users SET role_id = $1 WHERE user_id = $2 RETURNING *',
        [role_id, user_id]
      );
      return rows[0];
    },
    addUserSetting: async (_: any, args: any) => {
      const { user_id, settings } = args;
      const { rows } = await pool.query(
        'INSERT INTO user_settings (user_id, settings) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET settings = EXCLUDED.settings RETURNING *',
        [user_id, settings]
      );
      return rows[0];
    },
    addAuditLog: async (_: any, args: any) => {
      const { user_id, action_type, entity_type, entity_id, old_value, new_value } = args;
      const { rows } = await pool.query(
        'INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, old_value, new_value) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [user_id, action_type, entity_type, entity_id, old_value, new_value]
      );
      return rows[0];
    },
  },
};