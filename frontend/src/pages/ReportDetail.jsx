import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';

function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/reports/${id}`)
      .then((res) => setReport(res.data))
      .catch(() => setError('Prijava nije pronađena ili još nije odobrena.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center">
        <p className="text-gray-500">Učitavanje...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md">
          <p className="text-emerald-950 font-semibold mb-2">{error}</p>
          <Link to="/" className="text-emerald-700 font-medium hover:underline">
            Nazad na početnu
          </Link>
        </div>
      </div>
    );
  }

  const isCleaned = report.status === 'cleaned';
  const date = new Date(report.createdAt).toLocaleDateString('sr-Latn-BA');

  return (
    <div className="min-h-screen bg-[#f4f1ea] px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-emerald-700 font-medium hover:underline text-sm">
          ← Nazad na početnu
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-6 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                isCleaned ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isCleaned ? 'Očišćeno' : 'Aktivno'}
            </span>
            {report.alreadyCleaned && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                Prijavljeno kao očišćeno
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-emerald-950 mb-2">{report.description}</h1>
          <p className="text-sm text-gray-400 mb-6">
            {date} · {report.location.lat.toFixed(5)}, {report.location.lng.toFixed(5)}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {report.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Slika ${i + 1}`}
                className="w-full h-40 object-cover rounded-xl"
              />
            ))}
          </div>

          <div
            className={`rounded-2xl p-6 border ${
              isCleaned
                ? 'bg-emerald-50 border-emerald-100'
                : 'bg-amber-50 border-amber-100'
            }`}
          >
            {isCleaned ? (
              <p className="font-semibold text-emerald-900">
                ✓ Nakon čišćenja — ova deponija je očišćena i akcija je završena.
              </p>
            ) : (
              <p className="font-semibold text-amber-900">
                Ova deponija je još uvijek aktivna. Ako ste je u međuvremenu očistili,
                prijavite novu akciju kroz formu za prijavu i označite "Već smo očistili ovu
                deponiju".
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportDetail;
