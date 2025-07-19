# API Design Documentation

This document outlines the design and structure of the CRM's GraphQL API. The API is built to provide a flexible and efficient way to interact with the CRM data.

## Base URL

The GraphQL API is accessible at:

`http://localhost:3000/api/graphql` (for local development)

## Authentication

Authentication is handled via a login mechanism. Once authenticated, a session is established (e.g., via cookies or tokens) to authorize subsequent API requests. Specific authentication details will be provided here.

## Common API Patterns

*   **Queries:** Used for fetching data. Most queries support filtering, sorting, and pagination (though not all implemented in the initial phase).
*   **Mutations:** Used for creating, updating, and deleting data. Each mutation typically returns the affected entity or a boolean indicating success.

## API Endpoints (Modules)

Below is a high-level overview of the API capabilities, organized by CRM module. For detailed input types, output types, and specific fields, please refer to the [GraphQL Schema](#graphql-schema) in the GraphQL Playground.

### Contact Management

*   **Queries:** `contacts`, `contact(contact_id: ID!)`
*   **Mutations:** `addContact`, `updateContact`, `deleteContact`

### Sales Force Automation (Leads & Deals)

*   **Queries:** `leads`, `lead(lead_id: ID!)`, `deals`, `deal(deal_id: ID!)`
*   **Mutations:** `addLead`, `updateLead`, `deleteLead`, `addDeal`, `updateDeal`, `deleteDeal`

### Marketing Automation

*   **Queries:** `campaigns`, `campaign(campaign_id: ID!)`, `emails`, `email(email_id: ID!)`, `socialPosts`, `socialPost(post_id: ID!)`
*   **Mutations:** `addCampaign`, `updateCampaign`, `deleteCampaign`, `addEmail`, `updateEmail`, `deleteEmail`, `addSocialPost`, `updateSocialPost`, `deleteSocialPost`

### Customer Service and Support

*   **Queries:** `tickets`, `ticket(ticket_id: ID!)`, `knowledgeBaseArticles`, `knowledgeBaseArticle(article_id: ID!)`
*   **Mutations:** `addTicket`, `updateTicket`, `deleteTicket`, `addKnowledgeBaseArticle`, `updateKnowledgeBaseArticle`, `deleteKnowledgeBaseArticle`

### Workflow Automation

*   **Queries:** `workflows`, `workflow(workflow_id: ID!)`, `workflowSteps`, `workflowStep(step_id: ID!)`
*   **Mutations:** `addWorkflow`, `updateWorkflow`, `deleteWorkflow`, `addWorkflowStep`, `updateWorkflowStep`, `deleteWorkflowStep`

### Communication Tracking

*   **Queries:** `calls`, `call(call_id: ID!)`, `meetings`, `meeting(meeting_id: ID!)`
*   **Mutations:** `addCall`, `updateCall`, `deleteCall`, `addMeeting`, `updateMeeting`, `deleteMeeting`

### Customization (Roles & Permissions)

*   **Queries:** `roles`, `role(role_id: ID!)`, `permissions`, `permission(permission_id: ID!)`
*   **Mutations:** `addRole`, `updateRole`, `deleteRole`, `addPermission`, `updatePermission`, `deletePermission`, `addRolePermission`, `deleteRolePermission`

### AI and Machine Learning

*   **Queries:** `aiModels`, `aiModel(model_id: ID!)`, `predictions`, `prediction(prediction_id: ID!)`
*   **Mutations:** `addAIModel`, `updateAIModel`, `deleteAIModel`, `addPrediction`, `updatePrediction`, `deletePrediction`

### Quote and Proposal Management

*   **Queries:** `quotes`, `quote(quote_id: ID!)`, `proposals`, `proposal(proposal_id: ID!)`
*   **Mutations:** `addQuote`, `updateQuote`, `deleteQuote`, `addProposal`, `updateProposal`, `deleteProposal`

### Territory and Team Management

*   **Queries:** `territories`, `territory(territory_id: ID!)`, `teamPerformance`, `teamPerformanceRecord(performance_id: ID!)`
*   **Mutations:** `addTerritory`, `updateTerritory`, `deleteTerritory`, `addTeamPerformance`, `updateTeamPerformance`, `deleteTeamPerformance`

### Data Management

*   **Queries:** `dataImports`, `dataImport(import_id: ID!)`, `dataExports`, `dataExport(export_id: ID!)`
*   **Mutations:** `addDataImport`, `updateDataImport`, `deleteDataImport`, `addDataExport`, `updateDataExport`, `deleteDataExport`

### Analytics and Reporting

*   **Queries:** `reports`, `report(report_id: ID!)`, `dashboards`, `dashboard(dashboard_id: ID!)`
*   **Mutations:** `addReport`, `updateReport`, `deleteReport`, `addDashboard`, `updateDashboard`, `deleteDashboard`

### User Management

*   **Queries:** `users`, `user(user_id: ID!)`
*   **Mutations:** `addUser`, `updateUser`, `deleteUser`

## GraphQL Schema

The complete GraphQL schema, including all types, queries, and mutations with their arguments and return types, can be inspected directly in the GraphQL Playground at `http://localhost:3000/api/graphql`.
