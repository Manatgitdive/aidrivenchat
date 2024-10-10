import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { User, Briefcase, Target, MessageCircle, ArrowLeft } from 'lucide-react';

const FounderProfile = () => {
  const { founderId } = useParams();
  const [founder, setFounder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFounder = async () => {
      if (!founderId) {
        console.error('No founderId provided');
        setError('Invalid founder ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Fetching founder with ID:', founderId);
        const { data, error } = await supabase
          .from('founders')
          .select('*')
          .eq('id', founderId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('No data returned from query');

        console.log('Founder data:', data);
        setFounder(data);
      } catch (error) {
        console.error('Error fetching founder:', error);
        setError(`Failed to load founder profile: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFounder();
  }, [founderId, supabase]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!founder) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Founder not found</h2>
          <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 h-screen w-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 sm:p-10">
          <div className="flex justify-between items-center mb-6">
            <Link to="/dashboard" className="text-white hover:text-gray-200 transition duration-300">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-white">{founder.name}'s Profile</h1>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
              <User size={64} className="text-gray-400" />
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Briefcase className="mr-2 text-blue-500" />
              Skills
            </h2>
            <p className="text-gray-700">{founder.skills || 'No skills listed'}</p>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Briefcase className="mr-2 text-blue-500" />
              Experience
            </h2>
            <p className="text-gray-700">{founder.experience || 'No experience listed'}</p>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Target className="mr-2 text-blue-500" />
              Goals
            </h2>
            <p className="text-gray-700">{founder.goals || 'No goals listed'}</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-10">
            <Link 
              to={`/chat/${founder.id}`}
              className="w-full sm:w-auto bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300 flex items-center justify-center mb-4 sm:mb-0"
            >
              <MessageCircle className="mr-2" />
              Chat with {founder.name}
            </Link>
            <Link 
              to="/dashboard"
              className="w-full sm:w-auto bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-300 flex items-center justify-center"
            >
              <ArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderProfile;