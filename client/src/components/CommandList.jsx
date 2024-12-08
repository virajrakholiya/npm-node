import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function CommandList() {
  const [commands, setCommands] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState('Backend');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchCommands();
  }, [navigate]);

  const fetchCommands = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/commands', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommands(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch commands');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optional: Add a temporary success message
      alert('Command copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/commands/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommands(commands.filter(cmd => cmd._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete command');
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Group commands by category
  const commandsByCategory = commands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {});

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Commands</h1>
        <Link
          to="/commands/add"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Add Command
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {Object.entries(commandsByCategory).map(([category, categoryCommands]) => (
          <div key={category} className="rounded-lg overflow-hidden border border-gray-200">
            <button
              onClick={() => toggleCategory(category)}
              className={`w-full p-4 text-left flex justify-between items-center transition-colors ${
                expandedCategory === category 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">{category}</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  expandedCategory === category ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {expandedCategory === category && (
              <div className="border-t border-gray-200">
                {categoryCommands.map((command) => (
                  <div
                    key={command._id}
                    className="p-4 hover:bg-gray-50 flex items-center justify-between border-b last:border-b-0"
                  >
                    <div className="flex-1 mr-4">
                      <div className="font-medium">{command.title}</div>
                      <code className="text-sm text-gray-600">{command.command}</code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopy(command.command)}
                        className="p-2 text-gray-500 hover:text-black transition-colors"
                        title="Copy to clipboard"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(command._id)}
                        className="p-2 text-gray-500 hover:text-black transition-colors"
                        title="Delete"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 