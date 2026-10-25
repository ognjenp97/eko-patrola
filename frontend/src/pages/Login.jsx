import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../lib/api';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      setAuthToken(res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri prijavi. Pokušajte ponovo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-emerald-950 mb-6">Prijava administratora</h1>

        <label className="block text-sm font-medium text-emerald-950 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-700"
        />

        <label className="block text-sm font-medium text-emerald-950 mb-1">Lozinka</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-700"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {submitting ? 'Prijavljivanje...' : 'Prijavi se'}
        </button>
      </form>
    </div>
  );
}

export default Login;
