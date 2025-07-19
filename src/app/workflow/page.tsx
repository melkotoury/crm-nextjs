'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_WORKFLOWS = gql`
  query GetWorkflows {
    workflows {
      workflow_id
      workflow_name
      trigger_event
      is_active
    }
  }
`;

const ADD_WORKFLOW = gql`
  mutation AddWorkflow(
    $workflow_name: String!
    $trigger_event: String
    $is_active: Boolean
  ) {
    addWorkflow(
      workflow_name: $workflow_name
      trigger_event: $trigger_event
      is_active: $is_active
    ) {
      workflow_id
    }
  }
`;

const GET_WORKFLOW_STEPS = gql`
  query GetWorkflowSteps($workflow_id: ID!) {
    workflowSteps(workflow_id: $workflow_id) {
      step_id
      workflow_id
      step_order
      action_type
      action_details
    }
  }
`;

const ADD_WORKFLOW_STEP = gql`
  mutation AddWorkflowStep(
    $workflow_id: ID!
    $step_order: Int!
    $action_type: String!
    $action_details: String
  ) {
    addWorkflowStep(
      workflow_id: $workflow_id
      step_order: $step_order
      action_type: $action_type
      action_details: $action_details
    ) {
      step_id
    }
  }
`;

function WorkflowForm() {
  const [addWorkflow, { loading, error }] = useMutation(ADD_WORKFLOW, {
    refetchQueries: [{ query: GET_WORKFLOWS }],
  });
  const [workflowName, setWorkflowName] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkflow({
      variables: {
        workflow_name: workflowName,
        trigger_event: triggerEvent,
        is_active: isActive,
      },
    });
    setWorkflowName('');
    setTriggerEvent('');
    setIsActive(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Workflow Name"
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Trigger Event"
        value={triggerEvent}
        onChange={(e) => setTriggerEvent(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="mr-2"
        />
        Is Active
      </label>
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Workflow'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function WorkflowList() {
  const { loading, error, data } = useQuery(GET_WORKFLOWS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.workflows.map((workflow: any) => (
        <div key={workflow.workflow_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{workflow.workflow_name}</h3>
          <p>Trigger: {workflow.trigger_event}</p>
          <p>Active: {workflow.is_active ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
}

export default function WorkflowAutomationPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Workflow Automation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Add Workflow</h2>
          <WorkflowForm />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Workflow List</h2>
          <WorkflowList />
        </div>
      </div>
    </div>
  );
}
