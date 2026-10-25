import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../lib/api';

const STATUS_LABELS = {
  pending: 'Na čekanju',
  active: 'Aktivno',
  cleaned: 'Očišćeno',
};

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800',
  active: 'bg-emerald-100 text-emerald-800',
  cleaned: 'bg-gray-200 text-gray-700',
};

function Admin() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);

  const loadReports = () => {
    setLoading(true);
    api
      .get('/reports/admin')
      .then((res) => setReports(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          setAuthToken(null);
          navigate('/login');
        } else {
          setError('Nije moguće učitati prijave.');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    setActingId(id);
    try {
      await api.patch(`/reports/${id}`, { status });
      setReports((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch {
      setError('Greška pri ažuriranju statusa.');
    } finally {
      setActingId(null);
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm('Obrisati ovu prijavu trajno? Ova radnja se ne može poništiti.')) {
      return;
    }
    setActingId(id);
    try {
      await api.delete(`/reports/${id}`);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch {
      setError('Greška pri brisanju prijave.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-950 mb-6">Upravljanje prijavama</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {loading && <p className="text-gray-500">Učitavanje...</p>}

        {!loading && reports.length === 0 && (
          <p className="text-gray-500">Nema prijava.</p>
        )}

        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white rounded-2xl shadow-sm p-5 flex gap-4">
              {report.images?.[0] && (
                <img
                  src={report.images[0]}
                  alt=""
                  className="w-28 h-28 object-cover rounded-xl shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[report.status]}`}
                  >
                    {STATUS_LABELS[report.status]}
                  </span>
                  {report.alreadyCleaned && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      Prijavljeno kao očišćeno
                    </span>
                  )}
                </div>

                <p className="text-emerald-950 font-medium">{report.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {report.location.lat.toFixed(5)}, {report.location.lng.toFixed(5)} ·{' '}
                  {new Date(report.createdAt).toLocaleDateString('sr-Latn-BA')}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {report.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(report._id, 'active')}
                      disabled={actingId === report._id}
                      className="text-sm font-medium bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Odobri
                    </button>
                  )}
                  {report.status === 'active' && (
                    <button
                      onClick={() => updateStatus(report._id, 'cleaned')}
                      disabled={actingId === report._id}
                      className="text-sm font-medium bg-emerald-100 hover:bg-emerald-200 disabled:opacity-60 text-emerald-800 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Označi očišćeno
                    </button>
                  )}
                  <button
                    onClick={() => deleteReport(report._id)}
                    disabled={actingId === report._id}
                    className="text-sm font-medium bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Obriši
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
