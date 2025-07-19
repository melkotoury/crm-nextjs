import { gql } from 'graphql-tag';
import { contactResolvers } from './resolvers/contact';
import { leadResolvers } from './resolvers/lead';
import { dealResolvers } from './resolvers/deal';
import { campaignResolvers } from './resolvers/campaign';
import { emailResolvers } from './resolvers/email';
import { socialPostResolvers } from './resolvers/socialPost';
import { ticketResolvers } from './resolvers/ticket';
import { knowledgeBaseArticleResolvers } from './resolvers/knowledgeBaseArticle';
import { reportResolvers } from './resolvers/report';
import { dashboardResolvers } from './resolvers/dashboard';
import { workflowResolvers } from './resolvers/workflow';
import { workflowStepResolvers } from './resolvers/workflowStep';
import { callResolvers } from './resolvers/call';
import { meetingResolvers } from './resolvers/meeting';
import { integrationResolvers } from './resolvers/integration';
import { roleResolvers } from './resolvers/role';
import { permissionResolvers } from './resolvers/permission';
import { sharedCalendarResolvers } from './resolvers/sharedCalendar';
import { documentResolvers } from './resolvers/document';
import { teamMemberResolvers } from './resolvers/teamMember';
import { aiModelResolvers } from './resolvers/aiModel';
import { predictionResolvers } from './resolvers/prediction';
import { userProfileResolvers } from './resolvers/userProfile';
import { userSettingResolvers } from './resolvers/userSetting';
import { auditLogResolvers } from './resolvers/auditLog';
import { quoteResolvers } from './resolvers/quote';
import { proposalResolvers } from './resolvers/proposal';
import { territoryResolvers } from './resolvers/territory';
import { teamPerformanceResolvers } from './resolvers/teamPerformance';
import { customerLifetimeValueResolvers } from './resolvers/customerLifetimeValue';
import { churnPredictionResolvers } from './resolvers/churnPrediction';
import { crossSellingOpportunityResolvers } from './resolvers/crossSellingOpportunity';
import { marketTrendResolvers } from './resolvers/marketTrend';
import { dataImportResolvers } from './resolvers/dataImport';
import { dataExportResolvers } from './resolvers/dataExport';
import { userResolvers } from './resolvers/user';


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

  type DataImport {
    import_id: ID!
    file_name: String!
    file_type: String
    status: String
    imported_by: ID
    imported_at: String
  }

  type DataExport {
    export_id: ID!
    file_name: String!
    file_type: String
    status: String
    exported_by: ID
    exported_at: String
  }

  type User {
    user_id: ID!
    username: String!
    email: String!
    full_name: String
    role: String
  }

  type Query {
    hello: String
    contacts: [Contact]
    contact(contact_id: ID!): Contact
    leads: [Lead]
    lead(lead_id: ID!): Lead
    deals: [Deal]
    deal(deal_id: ID!): Deal
    campaigns: [Campaign]
    campaign(campaign_id: ID!): Campaign
    emails: [Email]
    email(email_id: ID!): Email
    socialPosts: [SocialPost]
    socialPost(post_id: ID!): SocialPost
    tickets: [Ticket]
    ticket(ticket_id: ID!): Ticket
    knowledgeBaseArticles: [KnowledgeBaseArticle]
    knowledgeBaseArticle(article_id: ID!): KnowledgeBaseArticle
    reports: [Report]
    report(report_id: ID!): Report
    dashboards: [Dashboard]
    dashboard(dashboard_id: ID!): Dashboard
    workflows: [Workflow]
    workflow(workflow_id: ID!): Workflow
    workflowSteps: [WorkflowStep]
    workflowStep(step_id: ID!): WorkflowStep
    calls: [Call]
    call(call_id: ID!): Call
    meetings: [Meeting]
    meeting(meeting_id: ID!): Meeting
    integrations: [Integration]
    integration(integration_id: ID!): Integration
    roles: [Role]
    role(role_id: ID!): Role
    permissions: [Permission]
    permission(permission_id: ID!): Permission
    sharedCalendars: [SharedCalendar]
    sharedCalendar(calendar_id: ID!): SharedCalendar
    documents: [Document]
    document(document_id: ID!): Document
    teamMembers: [TeamMember]
    teamMember(user_id: ID!): TeamMember
    aiModels: [AIModel]
    aiModel(model_id: ID!): AIModel
    predictions: [Prediction]
    prediction(prediction_id: ID!): Prediction
    userProfiles: [UserProfile]
    userProfile(profile_id: ID!): UserProfile
    userSettings: [UserSetting]
    userSetting(user_id: ID!): UserSetting
    auditLogs: [AuditLog]
    auditLog(log_id: ID!): AuditLog
    quotes: [Quote]
    quote(quote_id: ID!): Quote
    proposals: [Proposal]
    proposal(proposal_id: ID!): Proposal
    territories: [Territory]
    territory(territory_id: ID!): Territory
    teamPerformance: [TeamPerformance]
    teamPerformanceRecord(performance_id: ID!): TeamPerformance
    customerLifetimeValues: [CustomerLifetimeValue]
    customerLifetimeValue(clv_id: ID!): CustomerLifetimeValue
    churnPredictions: [ChurnPrediction]
    churnPrediction(churn_id: ID!): ChurnPrediction
    crossSellingOpportunities: [CrossSellingOpportunity]
    crossSellingOpportunity(opportunity_id: ID!): CrossSellingOpportunity
    marketTrends: [MarketTrend]
    marketTrend(trend_id: ID!): MarketTrend
    dataImports: [DataImport]
    dataImport(import_id: ID!): DataImport
    dataExports: [DataExport]
    dataExport(export_id: ID!): DataExport
    users: [User]
    user(user_id: ID!): User
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
    updateContact(
      contact_id: ID!
      first_name: String
      last_name: String
      email: String
      phone_number: String
      company: String
      job_title: String
    ): Contact
    deleteContact(contact_id: ID!): Boolean

    addLead(
      first_name: String!
      last_name: String!
      email: String!
      company: String
      status: String!
      source: String
    ): Lead
    updateLead(
      lead_id: ID!
      first_name: String
      last_name: String
      email: String
      company: String
      status: String
      source: String
    ): Lead
    deleteLead(lead_id: ID!): Boolean

    addDeal(
      deal_name: String!
      stage: String!
      amount: Float
      close_date: String
      contact_id: ID
      user_id: ID
    ): Deal
    updateDeal(
      deal_id: ID!
      deal_name: String
      stage: String
      amount: Float
      close_date: String
      contact_id: ID
      user_id: ID
    ): Deal
    deleteDeal(deal_id: ID!): Boolean

    addCampaign(
      campaign_name: String!
      start_date: String
      end_date: String
      budget: Float
      status: String
    ): Campaign
    updateCampaign(
      campaign_id: ID!
      campaign_name: String
      start_date: String
      end_date: String
      budget: Float
      status: String
    ): Campaign
    deleteCampaign(campaign_id: ID!): Boolean

    addEmail(
      campaign_id: ID
      subject: String!
      body: String
      sent_date: String
      recipient_count: Int
      open_rate: Float
      click_through_rate: Float
    ): Email
    updateEmail(
      email_id: ID!
      campaign_id: ID
      subject: String
      body: String
      sent_date: String
      recipient_count: Int
      open_rate: Float
      click_through_rate: Float
    ): Email
    deleteEmail(email_id: ID!): Boolean

    addSocialPost(
      campaign_id: ID
      platform: String!
      content: String!
      post_date: String
      likes: Int
      shares: Int
      comments: Int
    ): SocialPost
    updateSocialPost(
      post_id: ID!
      campaign_id: ID
      platform: String
      content: String
      post_date: String
      likes: Int
      shares: Int
      comments: Int
    ): SocialPost
    deleteSocialPost(post_id: ID!): Boolean

    addTicket(
      subject: String!
      description: String
      status: String
      priority: String
      contact_id: ID
      user_id: ID
    ): Ticket
    updateTicket(
      ticket_id: ID!
      subject: String
      description: String
      status: String
      priority: String
      contact_id: ID
      user_id: ID
    ): Ticket
    deleteTicket(ticket_id: ID!): Boolean

    addKnowledgeBaseArticle(
      title: String!
      content: String
      category: String
    ): KnowledgeBaseArticle
    updateKnowledgeBaseArticle(
      article_id: ID!
      title: String
      content: String
      category: String
    ): KnowledgeBaseArticle
    deleteKnowledgeBaseArticle(article_id: ID!): Boolean

    addReport(
      report_name: String!
      report_type: String
      generated_date: String
      data: String
    ): Report
    updateReport(
      report_id: ID!
      report_name: String
      report_type: String
      generated_date: String
      data: String
    ): Report
    deleteReport(report_id: ID!): Boolean

    addDashboard(
      dashboard_name: String!
      layout: String
    ): Dashboard
    updateDashboard(
      dashboard_id: ID!
      dashboard_name: String
      layout: String
    ): Dashboard
    deleteDashboard(dashboard_id: ID!): Boolean

    addWorkflow(
      workflow_name: String!
      trigger_event: String
      is_active: Boolean
    ): Workflow
    updateWorkflow(
      workflow_id: ID!
      workflow_name: String
      trigger_event: String
      is_active: Boolean
    ): Workflow
    deleteWorkflow(workflow_id: ID!): Boolean

    addWorkflowStep(
      workflow_id: ID!
      step_order: Int!
      action_type: String!
      action_details: String
    ): WorkflowStep
    updateWorkflowStep(
      step_id: ID!
      workflow_id: ID
      step_order: Int
      action_type: String
      action_details: String
    ): WorkflowStep
    deleteWorkflowStep(step_id: ID!): Boolean

    addCall(
      contact_id: ID
      user_id: ID
      call_date: String!
      duration_minutes: Int
      notes: String
    ): Call
    updateCall(
      call_id: ID!
      contact_id: ID
      user_id: ID
      call_date: String
      duration_minutes: Int
      notes: String
    ): Call
    deleteCall(call_id: ID!): Boolean

    addMeeting(
      title: String!
      description: String
      meeting_date: String!
      location: String
      contact_id: ID
      user_id: ID
    ): Meeting
    updateMeeting(
      meeting_id: ID!
      title: String
      description: String
      meeting_date: String
      location: String
      contact_id: ID
      user_id: ID
    ): Meeting
    deleteMeeting(meeting_id: ID!): Boolean

    addIntegration(
      integration_name: String!
      api_key: String
      status: String
    ): Integration
    updateIntegration(
      integration_id: ID!
      integration_name: String
      api_key: String
      status: String
    ): Integration
    deleteIntegration(integration_id: ID!): Boolean

    addRole(
      role_name: String!
    ): Role
    updateRole(
      role_id: ID!
      role_name: String
    ): Role
    deleteRole(role_id: ID!): Boolean

    addPermission(
      permission_name: String!
    ): Permission
    updatePermission(
      permission_id: ID!
      permission_name: String
    ): Permission
    deletePermission(permission_id: ID!): Boolean

    addRolePermission(
      role_id: ID!
      permission_id: ID!
    ): Boolean
    deleteRolePermission(
      role_id: ID!
      permission_id: ID!
    ): Boolean

    addSharedCalendar(
      calendar_name: String!
      owner_user_id: ID
    ): SharedCalendar
    updateSharedCalendar(
      calendar_id: ID!
      calendar_name: String
      owner_user_id: ID
    ): SharedCalendar
    deleteSharedCalendar(calendar_id: ID!): Boolean

    addDocument(
      document_name: String!
      document_url: String!
      owner_user_id: ID
    ): Document
    updateDocument(
      document_id: ID!
      document_name: String
      document_url: String
      owner_user_id: ID
    ): Document
    deleteDocument(document_id: ID!): Boolean

    addTeamMember(
      user_id: ID!
      team_role: String
    ): TeamMember
    updateTeamMember(
      user_id: ID!
      team_role: String
    ): TeamMember
    deleteTeamMember(user_id: ID!): Boolean

    addAIModel(
      model_name: String!
      model_type: String
      description: String
    ): AIModel
    updateAIModel(
      model_id: ID!
      model_name: String
      model_type: String
      description: String
    ): AIModel
    deleteAIModel(model_id: ID!): Boolean

    addPrediction(
      model_id: ID
      entity_type: String!
      entity_id: ID!
      predicted_value: String
    ): Prediction
    updatePrediction(
      prediction_id: ID!
      model_id: ID
      entity_type: String
      entity_id: ID
      predicted_value: String
    ): Prediction
    deletePrediction(prediction_id: ID!): Boolean

    addUserProfile(
      user_id: ID!
      bio: String
      profile_picture_url: String
      social_media_links: String
    ): UserProfile
    updateUserProfile(
      profile_id: ID!
      user_id: ID
      bio: String
      profile_picture_url: String
      social_media_links: String
    ): UserProfile
    deleteUserProfile(profile_id: ID!): Boolean

    addUserSetting(
      user_id: ID!
      settings: String
    ): UserSetting
    updateUserSetting(
      user_id: ID!
      settings: String
    ): UserSetting
    deleteUserSetting(user_id: ID!): Boolean

    addAuditLog(
      user_id: ID
      action_type: String!
      entity_type: String
      entity_id: ID
      old_value: String
      new_value: String
    ): AuditLog

    addQuote(
      deal_id: ID
      quote_date: String
      total_amount: Float
      status: String
    ): Quote
    updateQuote(
      quote_id: ID!
      deal_id: ID
      quote_date: String
      total_amount: Float
      status: String
    ): Quote
    deleteQuote(quote_id: ID!): Boolean

    addProposal(
      deal_id: ID
      proposal_date: String
      content: String
      status: String
    ): Proposal
    updateProposal(
      proposal_id: ID!
      deal_id: ID
      proposal_date: String
      content: String
      status: String
    ): Proposal
    deleteProposal(proposal_id: ID!): Boolean

    addTerritory(
      territory_name: String!
      region: String
      manager_user_id: ID
    ): Territory
    updateTerritory(
      territory_id: ID!
      territory_name: String
      region: String
      manager_user_id: ID
    ): Territory
    deleteTerritory(territory_id: ID!): Boolean

    addTeamPerformance(
      user_id: ID
      metric_name: String!
      metric_value: Float
      record_date: String
    ): TeamPerformance
    updateTeamPerformance(
      performance_id: ID!
      user_id: ID
      metric_name: String
      metric_value: Float
      record_date: String
    ): TeamPerformance
    deleteTeamPerformance(performance_id: ID!): Boolean

    addCustomerLifetimeValue(
      contact_id: ID
      lifetime_value: Float
    ): CustomerLifetimeValue
    updateCustomerLifetimeValue(
      clv_id: ID!
      contact_id: ID
      lifetime_value: Float
    ): CustomerLifetimeValue
    deleteCustomerLifetimeValue(clv_id: ID!): Boolean

    addChurnPrediction(
      contact_id: ID
      churn_probability: Float
    ): ChurnPrediction
    updateChurnPrediction(
      churn_id: ID!
      contact_id: ID
      churn_probability: Float
    ): ChurnPrediction
    deleteChurnPrediction(churn_id: ID!): Boolean

    addCrossSellingOpportunity(
      contact_id: ID
      product_service: String
      likelihood: Float
    ): CrossSellingOpportunity
    updateCrossSellingOpportunity(
      opportunity_id: ID!
      contact_id: ID
      product_service: String
      likelihood: Float
    ): CrossSellingOpportunity
    deleteCrossSellingOpportunity(opportunity_id: ID!): Boolean

    addMarketTrend(
      trend_name: String!
      description: String
      trend_date: String
      impact_score: Int
    ): MarketTrend
    updateMarketTrend(
      trend_id: ID!
      trend_name: String
      description: String
      trend_date: String
      impact_score: Int
    ): MarketTrend
    deleteMarketTrend(trend_id: ID!): Boolean

    addDataImport(
      file_name: String!
      file_type: String
      status: String
      imported_by: ID
    ): DataImport
    updateDataImport(
      import_id: ID!
      file_name: String
      file_type: String
      status: String
      imported_by: ID
    ): DataImport
    deleteDataImport(import_id: ID!): Boolean

    addDataExport(
      file_name: String!
      file_type: String
      status: String
      exported_by: ID
    ): DataExport
    updateDataExport(
      export_id: ID!
      file_name: String
      file_type: String
      status: String
      exported_by: ID
    ): DataExport
    deleteDataExport(export_id: ID!): Boolean

    addUser(
      username: String!
      password_hash: String!
      email: String!
      full_name: String
      role: String
    ): User
    updateUser(
      user_id: ID!
      username: String
      password_hash: String
      email: String
      full_name: String
      role: String
    ): User
    deleteUser(user_id: ID!): Boolean
  }
`;

export const resolvers = {
  Query: {
    ...contactResolvers.Query,
    ...leadResolvers.Query,
    ...dealResolvers.Query,
    ...campaignResolvers.Query,
    ...emailResolvers.Query,
    ...socialPostResolvers.Query,
    ...ticketResolvers.Query,
    ...knowledgeBaseArticleResolvers.Query,
    ...reportResolvers.Query,
    ...dashboardResolvers.Query,
    ...workflowResolvers.Query,
    ...workflowStepResolvers.Query,
    ...callResolvers.Query,
    ...meetingResolvers.Query,
    ...integrationResolvers.Query,
    ...roleResolvers.Query,
    ...permissionResolvers.Query,
    ...sharedCalendarResolvers.Query,
    ...documentResolvers.Query,
    ...teamMemberResolvers.Query,
    ...aiModelResolvers.Query,
    ...predictionResolvers.Query,
    ...userProfileResolvers.Query,
    ...userSettingResolvers.Query,
    ...auditLogResolvers.Query,
    ...quoteResolvers.Query,
    ...proposalResolvers.Query,
    ...territoryResolvers.Query,
    ...teamPerformanceResolvers.Query,
    ...customerLifetimeValueResolvers.Query,
    ...churnPredictionResolvers.Query,
    ...crossSellingOpportunityResolvers.Query,
    ...marketTrendResolvers.Query,
    ...dataImportResolvers.Query,
    ...dataExportResolvers.Query,
    ...userResolvers.Query,
    hello: () => 'Hello, world!',
  },
  Mutation: {
    ...contactResolvers.Mutation,
    ...leadResolvers.Mutation,
    ...dealResolvers.Mutation,
    ...campaignResolvers.Mutation,
    ...emailResolvers.Mutation,
    ...socialPostResolvers.Mutation,
    ...ticketResolvers.Mutation,
    ...knowledgeBaseArticleResolvers.Mutation,
    ...reportResolvers.Mutation,
    ...dashboardResolvers.Mutation,
    ...workflowResolvers.Mutation,
    ...workflowStepResolvers.Mutation,
    ...callResolvers.Mutation,
    ...meetingResolvers.Mutation,
    ...integrationResolvers.Mutation,
    ...roleResolvers.Mutation,
    ...permissionResolvers.Mutation,
    ...sharedCalendarResolvers.Mutation,
    ...documentResolvers.Mutation,
    ...teamMemberResolvers.Mutation,
    ...aiModelResolvers.Mutation,
    ...predictionResolvers.Mutation,
    ...userProfileResolvers.Mutation,
    ...userSettingResolvers.Mutation,
    ...auditLogResolvers.Mutation,
    ...quoteResolvers.Mutation,
    ...proposalResolvers.Mutation,
    ...territoryResolvers.Mutation,
    ...teamPerformanceResolvers.Mutation,
    ...customerLifetimeValueResolvers.Mutation,
    ...churnPredictionResolvers.Mutation,
    ...crossSellingOpportunityResolvers.Mutation,
    ...marketTrendResolvers.Mutation,
    ...dataImportResolvers.Mutation,
    ...dataExportResolvers.Mutation,
    ...userResolvers.Mutation,
  },
};