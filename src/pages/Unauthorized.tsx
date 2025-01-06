import React from 'react';
import { useNavigate } from 'react-router-dom';
import withTheme from '../hocs/withTheme';
import Dark from '../support/Dark.png';
import Light from '../support/Light.png';

interface UnauthorizedPageProps {
  isDarkMode: boolean;
}

const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center ${
      isDarkMode ? 'text-white' : 'text-gray-900'
    }`}
    style={{
      backgroundImage: `url(${isDarkMode ? Dark : Light})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <h1 className="text-2xl font-bold">Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <button
        className="mt-4 bg-[#40b446] text-white p-2 rounded"
        onClick={() => navigate('/')}
      >
        Go Home
      </button>
    </div>
  );
};

export default withTheme(UnauthorizedPage);