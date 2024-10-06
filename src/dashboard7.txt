import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';

const Dashboard = () => {
  const [founders, setFounders] = useState([]);
  const [recommendedFounders, setRecommendedFounders] = useState([]);
  const [currentFounder, setCurrentFounder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentFounder();
  }, []);

  const fetchCurrentFounder = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('founders')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setCurrentFounder(data);
      fetchFounders(data);
    } catch (error) {
      console.error('Error fetching current founder:', error);
      setError('Failed to load user data');
    }
  };

  const fetchFounders = async (currentFounder) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('founders').select('*');
      if (error) throw error;

      const otherFounders = data.filter(f => f.id !== currentFounder.id);
      setFounders(otherFounders);

      const recommended = otherFounders.map(founder => ({
        ...founder,
        matchPercentage: calculateMatch(currentFounder, founder)
      }))
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);  // Top 5 recommendations

      setRecommendedFounders(recommended);
    } catch (error) {
      console.error('Error fetching founders:', error);
      setError('Failed to load founders');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMatch = (founder1, founder2) => {
    const skills1 = founder1.skills.toLowerCase().split(',').map(s => s.trim());
    const skills2 = founder2.skills.toLowerCase().split(',').map(s => s.trim());
    const matchingSkills = skills1.filter(skill => skills2.includes(skill));
    return Math.round((matchingSkills.length / Math.max(skills1.length, skills2.length)) * 100);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Failed to log out');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Founders Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </div>

      <h2>Recommended Founders</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
        {recommendedFounders.map((founder) => (
          <div key={founder.id} style={{ width: 'calc(33% - 20px)', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>{founder.name}</h3>
            <p>Match: <strong>{founder.matchPercentage}%</strong></p>
            <p>Skills: {founder.skills}</p>
            <div style={{ marginTop: '10px' }}>
              <Link to={`/profile/${founder.id}`} style={{ marginRight: '10px', textDecoration: 'none', color: '#007bff' }}>View Profile</Link>
              <Link to={`/chat/${founder.id}`} style={{ textDecoration: 'none', color: '#28a745' }}>Chat</Link>
            </div>
          </div>
        ))}
      </div>

      <h2>All Founders</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {founders.map((founder) => (
          <div key={founder.id} style={{ width: 'calc(33% - 20px)', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>{founder.name}</h3>
            <p>Skills: {founder.skills}</p>
            <div style={{ marginTop: '10px' }}>
              <Link to={`/profile/${founder.id}`} style={{ marginRight: '10px', textDecoration: 'none', color: '#007bff' }}>View Profile</Link>
              <Link to={`/chat/${founder.id}`} style={{ textDecoration: 'none', color: '#28a745' }}>Chat</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;