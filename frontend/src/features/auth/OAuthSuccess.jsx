import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Loader2 } from 'lucide-react';
import { setAccessToken } from '../../utils/api';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token) {
      setAccessToken(token);
      if (userParam) {
        try {
          const decodedUser = JSON.parse(decodeURIComponent(userParam));
          localStorage.setItem('user', JSON.stringify(decodedUser));
        } catch (e) {
          console.error("Failed to parse user query param", e);
        }
      } else {
        localStorage.setItem('user', JSON.stringify({ email: 'oauth-user@google.com' }));
      }
      // Redirect to dashboard
      navigate('/');
    } else {
      // Redirect to login on failure
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#090b0e] text-white">
      <Loader2 className="w-12 h-12 text-violet-500 animate-spin mb-4" />
      <h2 className="text-xl font-medium font-outfit">Authenticating with Google...</h2>
      <p className="text-slate-400 text-sm mt-1">Please wait while we finalize your login.</p>
    </div>
  );
};

export default OAuthSuccess;
