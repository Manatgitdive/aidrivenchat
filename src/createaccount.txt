import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
    experience: '',
    goals: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const supabase = useSupabase();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;

      // Create the founder profile
      const { error: profileError } = await supabase.from('founders').insert([
        {
          user_id: data.user.id,
          name: formData.name,
          skills: formData.skills,
          experience: formData.experience,
          goals: formData.goals,
        },
      ]);

      if (profileError) throw profileError;

      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
      console.error('Error creating account:', error);
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Skills (comma-separated)"
          required
        />
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Experience"
          required
        ></textarea>
        <textarea
          name="goals"
          value={formData.goals}
          onChange={handleChange}
          placeholder="Goals"
          required
        ></textarea>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default CreateAccount;