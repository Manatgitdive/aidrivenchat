import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { User, Briefcase, Target, MessageCircle, ArrowLeft, MapPin, Users, FileText, Linkedin, Code } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try refreshing the page.</h1>;
    }

    return this.props.children;
  }
}

const FounderProfile = () => {
  const { founderId } = useParams();
  const [founder, setFounder] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
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

        if (data.profile_image) {
          const { data: imageData, error: imageError } = await supabase
            .storage
            .from('userimage')
            .getPublicUrl(data.profile_image);

          if (imageError) {
            console.error('Error fetching image URL:', imageError);
          } else {
            setProfileImageUrl(imageData.publicUrl);
          }
        }
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
    <ErrorBoundary>
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
              {profileImageUrl ? (
                <img 
                  src={profileImageUrl} 
                  alt={`${founder.name}'s profile`} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                  onError={(e) => {
                    console.error('Error loading profile image');
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
              ) : (
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <User size={64} className="text-gray-400" />
                </div>
              )}
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
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <MapPin className="mr-2 text-blue-500" />
                City
              </h2>
              <p className="text-gray-700">{founder.city || 'No city listed'}</p>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <Code className="mr-2 text-blue-500" />
                Current Project
              </h2>
              <p className="text-gray-700">{founder.current_project || 'No current project listed'}</p>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <Users className="mr-2 text-blue-500" />
                Looking For
              </h2>
              <p className="text-gray-700">{founder.looking_for || 'Not specified'}</p>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <FileText className="mr-2 text-blue-500" />
                Bio
              </h2>
              <p className="text-gray-700">{founder.bio || 'No bio provided'}</p>
            </div>
            {founder.linkedin_profile && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 flex items-center">
                  <Linkedin className="mr-2 text-blue-500" />
                  LinkedIn Profile
                </h2>
                <a href={founder.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View LinkedIn Profile
                </a>
              </div>
            )}
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
    </ErrorBoundary>
  );
};

export default FounderProfile;