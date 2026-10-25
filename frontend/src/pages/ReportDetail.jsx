import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import ReportLocationMap from '../components/ReportLocationMap';

function ReportDetail() {
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const loadReport = () => {
    api
      .get(`/reports/${id}`)
      .then((res) => setReport(res.data))
      .catch(() => setError('Prijava nije pronađena ili još nije odobrena.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAfterPhotosClick = () => fileInputRef.current?.click();

  const handleAfterPhotosChange = async (e) => {
    const files = Array.from(e.target.files).slice(0, 8);
    e.target.value = '';
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    setUploading(true);
    setUploadError('');
    try {
      const res = await api.post(`/reports/${id}/after-images`, formData);
      setReport(res.data);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Greška pri slanju fotografija.');
    } finally {
      setUploading(false);
    }
  };

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
  const totalPhotos = report.images.length + report.afterImages.length;

  return (
    <div className="min-h-screen bg-[#f4f1ea] px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-emerald-700 font-medium hover:underline text-sm">
          ← Nazad na početnu
        </Link>

        {/* Header */}
        <div className="bg-emerald-950 rounded-2xl p-6 mt-4 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isCleaned ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-900'
              }`}
            >
              {isCleaned ? 'Očišćeno' : 'Aktivno'}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-emerald-100">
              {date}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-emerald-100">
              Broj slika: {totalPhotos}
            </span>
          </div>
          <h1 className="text-2xl font-bold leading-snug">{report.description}</h1>
        </div>

        {/* Prije / poslije */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="font-semibold text-emerald-950 mb-3">Fotografije prije čišćenja</p>
            <div className="grid grid-cols-2 gap-2">
              {report.images.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    alt={`Prije ${i + 1}`}
                    className="w-full h-28 object-cover rounded-lg"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    PRIJE ČIŠĆENJA
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="font-semibold text-emerald-950 mb-3">✓ Fotografije poslije čišćenja</p>

            {report.afterImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {report.afterImages.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url}
                      alt={`Poslije ${i + 1}`}
                      className="w-full h-28 object-cover rounded-lg"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      POSLIJE ČIŠĆENJA
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-emerald-100 bg-emerald-50 rounded-xl flex flex-col items-center justify-center text-center p-6">
                <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center mb-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <circle cx="12" cy="13" r="3" strokeWidth={2} />
                  </svg>
                </div>
                <p className="text-sm font-medium text-emerald-950">
                  Još nema fotografija poslije čišćenja.
                </p>
                <p className="text-xs text-gray-500 mt-1 mb-4">
                  Vi ste očistili ovo mjesto? Pošaljite fotografije kako sada izgleda.
                </p>

                {uploadError && (
                  <p className="text-xs text-red-600 mb-3">{uploadError}</p>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleAfterPhotosChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleAfterPhotosClick}
                  disabled={uploading}
                  className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  {uploading ? 'Slanje...' : '✓ Prijavi kao očišćeno'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lokacija */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mt-4">
          <p className="font-semibold text-emerald-950 mb-3">Lokacija</p>
          <ReportLocationMap lat={report.location.lat} lng={report.location.lng} />
          <p className="text-sm text-gray-400 mt-2">
            {report.location.lat.toFixed(5)}, {report.location.lng.toFixed(5)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReportDetail;
