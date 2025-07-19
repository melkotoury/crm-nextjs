'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_AI_MODELS = gql`
  query GetAIModels {
    aiModels {
      model_id
      model_name
      model_type
      description
    }
  }
`;

const ADD_AI_MODEL = gql`
  mutation AddAIModel(
    $model_name: String!
    $model_type: String
    $description: String
  ) {
    addAIModel(
      model_name: $model_name
      model_type: $model_type
      description: $description
    ) {
      model_id
    }
  }
`;

const GET_PREDICTIONS = gql`
  query GetPredictions {
    predictions {
      prediction_id
      model_id
      entity_type
      entity_id
      predicted_value
      prediction_date
    }
  }
`;

const ADD_PREDICTION = gql`
  mutation AddPrediction(
    $model_id: ID
    $entity_type: String!
    $entity_id: ID!
    $predicted_value: String
  ) {
    addPrediction(
      model_id: $model_id
      entity_type: $entity_type
      entity_id: $entity_id
      predicted_value: $predicted_value
    ) {
      prediction_id
    }
  }
`;

function AIModelForm() {
  const [addAIModel, { loading, error }] = useMutation(ADD_AI_MODEL, {
    refetchQueries: [{ query: GET_AI_MODELS }],
  });
  const [modelName, setModelName] = useState('');
  const [modelType, setModelType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAIModel({
      variables: {
        model_name: modelName,
        model_type: modelType,
        description: description,
      },
    });
    setModelName('');
    setModelType('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Model Name"
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Model Type"
        value={modelType}
        onChange={(e) => setModelType(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add AI Model'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function AIModelList() {
  const { loading, error, data } = useQuery(GET_AI_MODELS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.aiModels.map((model: any) => (
        <div key={model.model_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{model.model_name}</h3>
          <p>Type: {model.model_type}</p>
          <p>Description: {model.description}</p>
        </div>
      ))}
    </div>
  );
}

function PredictionForm() {
  const [addPrediction, { loading, error }] = useMutation(ADD_PREDICTION, {
    refetchQueries: [{ query: GET_PREDICTIONS }],
  });
  const [modelId, setModelId] = useState('');
  const [entityType, setEntityType] = useState('');
  const [entityId, setEntityId] = useState('');
  const [predictedValue, setPredictedValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPrediction({
      variables: {
        model_id: modelId,
        entity_type: entityType,
        entity_id: entityId,
        predicted_value: predictedValue,
      },
    });
    setModelId('');
    setEntityType('');
    setEntityId('');
    setPredictedValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Model ID"
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Entity Type"
        value={entityType}
        onChange={(e) => setEntityType(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Entity ID"
        value={entityId}
        onChange={(e) => setEntityId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Predicted Value"
        value={predictedValue}
        onChange={(e) => setPredictedValue(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Prediction'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function PredictionList() {
  const { loading, error, data } = useQuery(GET_PREDICTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.predictions.map((prediction: any) => (
        <div key={prediction.prediction_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">Prediction for {prediction.entity_type} (ID: {prediction.entity_id})</h3>
          <p>Model ID: {prediction.model_id}</p>
          <p>Predicted Value: {prediction.predicted_value}</p>
          <p>Date: {prediction.prediction_date}</p>
        </div>
      ))}
    </div>
  );
}

export default function AIandMLPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI & Machine Learning</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">AI Models</h2>
          <AIModelForm />
          <AIModelList />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Predictions</h2>
          <PredictionForm />
          <PredictionList />
        </div>
      </div>
    </div>
  );
}
