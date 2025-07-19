'use client';

import { useState, useEffect } from 'react';

interface AIModel {
  model_id: string;
  model_name: string;
  model_type?: string;
  description?: string;
}

interface Prediction {
  prediction_id: string;
  model_id?: string;
  entity_type: string;
  entity_id: string;
  predicted_value?: string;
  prediction_date?: string;
}

export default function AIMLPage() {
  const [aiModels, setAiModels] = useState<AIModel[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const [modelFormData, setModelFormData] = useState({
    model_name: '',
    model_type: '',
    description: '',
  });

  const [predictionFormData, setPredictionFormData] = useState({
    model_id: '',
    entity_type: '',
    entity_id: '',
    predicted_value: '',
  });

  useEffect(() => {
    fetchAIModels();
    fetchPredictions();
  }, []);

  const fetchAIModels = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            aiModels {
              model_id
              model_name
              model_type
              description
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.aiModels) {
      setAiModels(result.data.aiModels);
    }
  };

  const fetchPredictions = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            predictions {
              prediction_id
              model_id
              entity_type
              entity_id
              predicted_value
              prediction_date
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.predictions) {
      setPredictions(result.data.predictions);
    }
  };

  const handleModelInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModelFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePredictionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPredictionFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddAIModel($model_name: String!, $model_type: String, $description: String) {
            addAIModel(model_name: $model_name, model_type: $model_type, description: $description) {
              model_id
              model_name
              model_type
            }
          }
        `,
        variables: modelFormData,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addAIModel) {
      setAiModels((prevModels) => [...prevModels, result.data.addAIModel]);
      setModelFormData({
        model_name: '',
        model_type: '',
        description: '',
      });
    }
  };

  const handleAddPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddPrediction($model_id: ID, $entity_type: String!, $entity_id: ID!, $predicted_value: String) {
            addPrediction(model_id: $model_id, entity_type: $entity_type, entity_id: $entity_id, predicted_value: $predicted_value) {
              prediction_id
              entity_type
              entity_id
            }
          }
        `,
        variables: predictionFormData,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addPrediction) {
      setPredictions((prevPredictions) => [...prevPredictions, result.data.addPrediction]);
      setPredictionFormData({
        model_id: '',
        entity_type: '',
        entity_id: '',
        predicted_value: '',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI & Machine Learning</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New AI Model</h2>
        <form onSubmit={handleAddModel} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="model_name"
            placeholder="Model Name"
            value={modelFormData.model_name}
            onChange={handleModelInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="model_type"
            placeholder="Model Type"
            value={modelFormData.model_type}
            onChange={handleModelInputChange}
            className="p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={modelFormData.description}
            onChange={handleModelInputChange}
            rows={3}
            className="p-2 border rounded col-span-full"
          ></textarea>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Model
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Existing AI Models</h2>
        {aiModels.length === 0 ? (
          <p>No AI models found.</p>
        ) : (
          <ul className="space-y-2">
            {aiModels.map((model) => (
              <li key={model.model_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{model.model_name} ({model.model_type})</p>
                {model.description && <p className="text-sm text-gray-600">{model.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Prediction</h2>
        <form onSubmit={handleAddPrediction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="model_id"
            value={predictionFormData.model_id}
            onChange={handlePredictionInputChange}
            className="p-2 border rounded"
          >
            <option value="">Select Model (Optional)</option>
            {aiModels.map((model) => (
              <option key={model.model_id} value={model.model_id}>
                {model.model_name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="entity_type"
            placeholder="Entity Type (e.g., Lead, Contact)"
            value={predictionFormData.entity_type}
            onChange={handlePredictionInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="entity_id"
            placeholder="Entity ID"
            value={predictionFormData.entity_id}
            onChange={handlePredictionInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="predicted_value"
            placeholder="Predicted Value"
            value={predictionFormData.predicted_value}
            onChange={handlePredictionInputChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Prediction
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Predictions</h2>
        {predictions.length === 0 ? (
          <p>No predictions found.</p>
        ) : (
          <ul className="space-y-2">
            {predictions.map((prediction) => (
              <li key={prediction.prediction_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{prediction.entity_type} {prediction.entity_id}: {prediction.predicted_value}</p>
                {prediction.model_id && <p className="text-sm text-gray-600">Model ID: {prediction.model_id}</p>}
                {prediction.prediction_date && <p className="text-sm text-gray-600">Date: {prediction.prediction_date}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}