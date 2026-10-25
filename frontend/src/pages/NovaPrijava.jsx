import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import LocationPicker from '../components/LocationPicker';

function NovaPrijava() {
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [alreadyCleaned, setAlreadyCleaned] = useState(false);
  const [images, setImages] = useState([]);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const remaining = 8 - images.length;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, remaining);
    setImages((prev) => [...prev, ...selected].slice(0, 8));
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLocationSelect = (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Opis je obavezan.');
      return;
    }
    if (images.length === 0) {
      setError('Dodajte bar jednu fotografiju.');
      return;
    }
    if (lat === null || lng === null) {
      setError('Označite lokaciju na karti.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('alreadyCleaned', alreadyCleaned);
    formData.append('location', JSON.stringify({ lat, lng }));
    images.forEach((file) => formData.append('images', file));

    try {
      setSubmitting(true);
      await api.post('/reports', formData);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri slanju prijave. Pokušajte ponovo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 text-2xl">
            ✓
          </div>
          <h1 className="text-xl font-bold text-emerald-950 mb-2">Prijava poslata!</h1>
          <p className="text-gray-500">
            Hvala što pomažete čišćenju. Prijava će biti pregledana prije nego se pojavi na
            javnoj karti. Preusmjeravamo te na početnu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <span className="inline-block bg-white text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          ● NOVA PRIJAVA
        </span>

        <h1 className="text-3xl font-bold text-emerald-950 mb-2">
          Prijavite nelegalnu deponiju precizno i za manje od minute
        </h1>
        <p className="text-gray-600 mb-8">
          Vaša prijava će biti pregledana prije objavljivanja na karti. Dodajte jasne
          fotografije, tačnu lokaciju i kratak opis.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fotografije */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <label className="block font-semibold text-emerald-950 mb-1">
              Fotografije deponije *
            </label>
            <p className="text-sm text-gray-400 mb-4">
              Možete poslati najviše 8 JPG ili PNG fotografija ukupno. Prva fotografija se
              koristi kao naslovna na mapi.
            </p>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-10 cursor-pointer hover:border-emerald-700 transition-colors">
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
                    d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                  />
                </svg>
              </div>
              <p className="font-medium text-emerald-950">
                Prevucite sliku ili kliknite za odabir
              </p>
              <p className="text-sm text-gray-400 mt-1">
                JPG ili PNG · maksimalno 15 MB po slici · Preostalo: {remaining}
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={remaining === 0}
              />
            </label>

            {images.length > 0 && (
              <ul className="mt-3 space-y-1">
                {images.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="text-red-500 hover:text-red-700 ml-3 shrink-0"
                    >
                      Ukloni
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Već očišćeno */}
          <div className="bg-emerald-50 rounded-2xl p-6 flex items-start gap-3">
            <input
              type="checkbox"
              checked={alreadyCleaned}
              onChange={(e) => setAlreadyCleaned(e.target.checked)}
              className="mt-1 w-5 h-5 accent-emerald-700"
            />
            <div>
              <p className="font-semibold text-emerald-950">
                Već smo očistili ovu deponiju
              </p>
              <p className="text-sm text-gray-500">
                Uključite ovu opciju ako želite poslati slike prije i poslije čišćenja. Admin
                će prijavu pregledati i može je objaviti kao završenu akciju.
              </p>
            </div>
          </div>

          {/* Lokacija */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <label className="block font-semibold text-emerald-950 mb-3">
              Lokacija na karti *
            </label>

            <LocationPicker lat={lat} lng={lng} onSelect={handleLocationSelect} />

            <p className="text-sm text-gray-400 mt-2">
              {lat && lng
                ? `Izabrane koordinate: ${lat.toFixed(5)}, ${lng.toFixed(5)}`
                : 'Kliknite na kartu da označite lokaciju.'}
            </p>
          </div>

          {/* Opis */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <label className="block font-semibold text-emerald-950 mb-3">Opis *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Npr. Podromanija, Vidrići, pristupni put, vrsta otpada i drugi detalji..."
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <p className="text-right text-sm text-gray-400 mt-1">
              {description.length}/500
            </p>
          </div>

          {/* Info box */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <p className="font-semibold text-emerald-900 mb-3">Kako označiti lokaciju</p>
            <ol className="list-decimal list-inside text-sm text-emerald-800 space-y-1">
              <li>Pronađite lokaciju deponije na karti</li>
              <li>Kliknite (ili dodirnite) tačno mjesto</li>
              <li>Koordinate se popunjavaju automatski</li>
              <li>Možete kliknuti ponovo da pomjerite oznaku</li>
            </ol>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
          >
            {submitting ? 'Slanje...' : '✓ Pošalji prijavu'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NovaPrijava;
