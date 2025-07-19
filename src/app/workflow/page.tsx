'use client';

import { useState, useEffect } from 'react';

interface Workflow {
  workflow_id: string;
  workflow_name: string;
  trigger_event?: string;
  is_active?: boolean;
}

interface WorkflowStep {
  step_id: string;
  workflow_id: string;
  step_order: number;
  action_type: string;
  action_details?: string;
}

export default function WorkflowPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);

  const [workflowFormData, setWorkflowFormData] = useState({
    workflow_name: '',
    trigger_event: '',
    is_active: true,
  });

  const [workflowStepFormData, setWorkflowStepFormData] = useState({
    workflow_id: '',
    step_order: '',
    action_type: '',
    action_details: '',
  });

  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [editingWorkflowStep, setEditingWorkflowStep] = useState<WorkflowStep | null>(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  useEffect(() => {
    if (selectedWorkflowId) {
      fetchWorkflowSteps(selectedWorkflowId);
    } else {
      setWorkflowSteps([]);
    }
  }, [selectedWorkflowId]);

  const fetchWorkflows = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            workflows {
              workflow_id
              workflow_name
              trigger_event
              is_active
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.workflows) {
      setWorkflows(result.data.workflows);
    }
  };

  const fetchWorkflowSteps = async (workflowId: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            workflowSteps {
              step_id
              workflow_id
              step_order
              action_type
              action_details
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.workflowSteps) {
      setWorkflowSteps(result.data.workflowSteps.filter((step: WorkflowStep) => step.workflow_id === workflowId));
    }
  };

  const handleWorkflowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setWorkflowFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleWorkflowStepInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setWorkflowStepFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleWorkflowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWorkflow) {
      // Update workflow
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateWorkflow($workflow_id: ID!, $workflow_name: String, $trigger_event: String, $is_active: Boolean) {
              updateWorkflow(workflow_id: $workflow_id, workflow_name: $workflow_name, trigger_event: $trigger_event, is_active: $is_active) {
                workflow_id
                workflow_name
                trigger_event
                is_active
              }
            }
          `,
          variables: { workflow_id: editingWorkflow.workflow_id, ...workflowFormData },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateWorkflow) {
        setWorkflows((prevWorkflows) =>
          prevWorkflows.map((workflow) =>
            workflow.workflow_id === result.data.updateWorkflow.workflow_id
              ? result.data.updateWorkflow
              : workflow
          )
        );
        setEditingWorkflow(null);
        setWorkflowFormData({
          workflow_name: '',
          trigger_event: '',
          is_active: true,
        });
      }
    } else {
      // Add new workflow
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation AddWorkflow($workflow_name: String!, $trigger_event: String, $is_active: Boolean) {
              addWorkflow(workflow_name: $workflow_name, trigger_event: $trigger_event, is_active: $is_active) {
                workflow_id
                workflow_name
                trigger_event
                is_active
              }
            }
          `,
          variables: workflowFormData,
        }),
      });
      const result = await response.json();
      if (result.data && result.data.addWorkflow) {
        setWorkflows((prevWorkflows) => [...prevWorkflows, result.data.addWorkflow]);
        setWorkflowFormData({
          workflow_name: '',
          trigger_event: '',
          is_active: true,
        });
      }
    }
  };

  const handleWorkflowStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkflowId) {
      alert('Please select a workflow first.');
      return;
    }
    if (editingWorkflowStep) {
      // Update workflow step
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateWorkflowStep($step_id: ID!, $workflow_id: ID, $step_order: Int, $action_type: String, $action_details: String) {
              updateWorkflowStep(step_id: $step_id, workflow_id: $workflow_id, step_order: $step_order, action_type: $action_type, action_details: $action_details) {
                step_id
                workflow_id
                step_order
                action_type
                action_details
              }
            }
          `,
          variables: {
            step_id: editingWorkflowStep.step_id,
            ...workflowStepFormData,
            workflow_id: selectedWorkflowId,
            step_order: parseInt(workflowStepFormData.step_order),
          },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateWorkflowStep) {
        setWorkflowSteps((prevSteps) =>
          prevSteps.map((step) =>
            step.step_id === result.data.updateWorkflowStep.step_id
              ? result.data.updateWorkflowStep
              : step
          )
        );
        setEditingWorkflowStep(null);
        setWorkflowStepFormData({
          workflow_id: '',
          step_order: '',
          action_type: '',
          action_details: '',
        });
      }
    } else {
      // Add new workflow step
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation AddWorkflowStep($workflow_id: ID!, $step_order: Int!, $action_type: String!, $action_details: String) {
              addWorkflowStep(workflow_id: $workflow_id, step_order: $step_order, action_type: $action_type, action_details: $action_details) {
                step_id
                workflow_id
                step_order
                action_type
                action_details
              }
            }
          `,
          variables: {
            ...workflowStepFormData,
            workflow_id: selectedWorkflowId,
            step_order: parseInt(workflowStepFormData.step_order),
          },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.addWorkflowStep) {
        setWorkflowSteps((prevSteps) => [...prevSteps, result.data.addWorkflowStep]);
        setWorkflowStepFormData({
          workflow_id: '',
          step_order: '',
          action_type: '',
          action_details: '',
        });
      }
    }
  };

  const handleEditWorkflowClick = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setWorkflowFormData({
      workflow_name: workflow.workflow_name,
      trigger_event: workflow.trigger_event || '',
      is_active: workflow.is_active || false,
    });
  };

  const handleDeleteWorkflow = async (workflow_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteWorkflow($workflow_id: ID!) {
            deleteWorkflow(workflow_id: $workflow_id)
          }
        `,
        variables: { workflow_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteWorkflow) {
      setWorkflows((prevWorkflows) =>
        prevWorkflows.filter((workflow) => workflow.workflow_id !== workflow_id)
      );
      setSelectedWorkflowId(null); // Deselect if the deleted workflow was selected
    }
  };

  const handleEditWorkflowStepClick = (step: WorkflowStep) => {
    setEditingWorkflowStep(step);
    setWorkflowStepFormData({
      workflow_id: step.workflow_id,
      step_order: String(step.step_order),
      action_type: step.action_type,
      action_details: step.action_details || '',
    });
  };

  const handleDeleteWorkflowStep = async (step_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteWorkflowStep($step_id: ID!) {
            deleteWorkflowStep(step_id: $step_id)
          }
        `,
        variables: { step_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteWorkflowStep) {
      setWorkflowSteps((prevSteps) =>
        prevSteps.filter((step) => step.step_id !== step_id)
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Workflow Automation</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{editingWorkflow ? 'Edit Workflow' : 'Add New Workflow'}</h2>
        <form onSubmit={handleWorkflowSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="workflow_name"
            placeholder="Workflow Name"
            value={workflowFormData.workflow_name}
            onChange={handleWorkflowInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="trigger_event"
            placeholder="Trigger Event"
            value={workflowFormData.trigger_event}
            onChange={handleWorkflowInputChange}
            className="p-2 border rounded"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={workflowFormData.is_active}
              onChange={handleWorkflowInputChange}
              className="p-2 border rounded"
            />
            <label htmlFor="is_active">Is Active</label>
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            {editingWorkflow ? 'Update Workflow' : 'Add Workflow'}
          </button>
          {editingWorkflow && (
            <button
              type="button"
              onClick={() => {
                setEditingWorkflow(null);
                setWorkflowFormData({
                  workflow_name: '',
                  trigger_event: '',
                  is_active: true,
                });
              }}
              className="bg-gray-500 text-white p-2 rounded col-span-full mt-2"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Existing Workflows</h2>
        {workflows.length === 0 ? (
          <p>No workflows found.</p>
        ) : (
          <ul className="space-y-2">
            {workflows.map((workflow) => (
              <li
                key={workflow.workflow_id}
                className={`p-3 border rounded shadow-sm cursor-pointer ${selectedWorkflowId === workflow.workflow_id ? 'bg-blue-100' : ''}`}
                onClick={() => setSelectedWorkflowId(workflow.workflow_id)}
              >
                <div>
                  <p className="font-medium">{workflow.workflow_name} ({workflow.is_active ? 'Active' : 'Inactive'})</p>
                  {workflow.trigger_event && <p className="text-sm text-gray-600">Trigger: {workflow.trigger_event}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditWorkflowClick(workflow)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteWorkflow(workflow.workflow_id)}
                    className="bg-red-500 text-white p-2 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedWorkflowId && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{editingWorkflowStep ? 'Edit Workflow Step' : 'Add New Workflow Step'}</h2>
          <div className="mb-4">
            <form onSubmit={handleWorkflowStepSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                name="step_order"
                placeholder="Step Order"
                value={workflowStepFormData.step_order}
                onChange={handleWorkflowStepInputChange}
                required
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="action_type"
                placeholder="Action Type"
                value={workflowStepFormData.action_type}
                onChange={handleWorkflowStepInputChange}
                required
                className="p-2 border rounded"
              />
              <textarea
                name="action_details"
                placeholder="Action Details"
                value={workflowStepFormData.action_details}
                onChange={handleWorkflowStepInputChange}
                rows={3}
                className="p-2 border rounded col-span-full"
              ></textarea>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
                {editingWorkflowStep ? 'Update Workflow Step' : 'Add Workflow Step'}
              </button>
              {editingWorkflowStep && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingWorkflowStep(null);
                    setWorkflowStepFormData({
                      workflow_id: '',
                      step_order: '',
                      action_type: '',
                      action_details: '',
                    });
                  }}
                  className="bg-gray-500 text-white p-2 rounded col-span-full mt-2"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
          {workflowSteps.length === 0 ? (
            <p>No steps found for this workflow.</p>
          ) : (
            <ul className="space-y-2">
              {workflowSteps.map((step) => (
                <li key={step.step_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-medium">Step {step.step_order}: {step.action_type}</p>
                    {step.action_details && <p className="text-sm text-gray-600">Details: {step.action_details}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditWorkflowStepClick(step)}
                      className="bg-yellow-500 text-white p-2 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteWorkflowStep(step.step_id)}
                      className="bg-red-500 text-white p-2 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}