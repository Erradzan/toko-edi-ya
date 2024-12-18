import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <button
        className="mt-4 bg-blue-500 text-white p-2 rounded"
        onClick={() => navigate('/')}
      >
        Go Home
      </button>
    </div>
  );
};

export default UnauthorizedPage;