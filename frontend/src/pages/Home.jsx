import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import ReportsMap from '../components/ReportsMap';
import ReportCard from '../components/ReportCard';

const STEPS = [
  {
    title: 'Fotografišite',
    text: 'Dodajte jednu ili više fotografija koje jasno pokazuju deponiju.',
  },
  {
    title: 'Označite lokaciju',
    text: 'Pronađite i precizno označite lokaciju deponije na mapi.',
  },
  {
    title: 'Dodajte opis',
    text: 'Napišite kratak opis — vrstu otpada, orijentire, pristupni put.',
  },
  {
    title: 'Pošaljite',
    text: 'Prijava se šalje na pregled i uskoro postaje vidljiva na javnoj karti.',
  },
];

function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/reports')
      .then((res) => setReports(res.data))
      .catch(() => setError('Nije moguće učitati prijave trenutno.'))
      .finally(() => setLoading(false));
  }, []);

  const recentReports = [...reports]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="bg-[#f4f1ea]">
      {/* Hero */}
      <section className="bg-emerald-950 text-white px-4 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <span className="inline-block bg-white/10 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              EKO PATROLA
            </span>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Za čistiju zajednicu
            </h1>
            <p className="text-emerald-100 mb-6 max-w-md">
              Fotografišite nelegalnu deponiju, označite lokaciju i pošaljite prijavu
              službama koje mogu reagovati. Ako ste deponiju već očistili, podijelite i
              akciju čišćenja da bude vidljiva svima.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/prijava"
                className="bg-white text-emerald-900 font-semibold px-5 py-3 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                Prijavi deponiju
              </Link>
              <a
                href="#mapa"
                className="bg-emerald-800 text-white font-semibold px-5 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Pogledaj prijave
              </a>
            </div>
          </div>

          <div className="bg-emerald-900/60 border border-emerald-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-emerald-300 mb-2">GRAĐANSKA AKCIJA</p>
            <p className="text-emerald-100 text-sm mb-6">
              Svaka prijava postaje vidljiva tačka na mapi. Pratite status svake deponije od
              prijave do čišćenja i pomozite da akcija bude vidljiva svima.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-xs text-emerald-300">Dostupnost prijava</p>
              </div>
              <div>
                <p className="text-2xl font-bold">GPS</p>
                <p className="text-xs text-emerald-300">Tačna lokacija</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-semibold text-emerald-700">JEDNOSTAVAN PROCES</span>
          <h2 className="text-3xl font-bold text-emerald-950 mt-2 mb-10">
            Od problema do akcije u četiri koraka
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {STEPS.map((step, i) => (
              <div key={step.title} className="bg-white rounded-2xl shadow-sm p-5 text-left">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full w-6 h-6 flex items-center justify-center mb-3">
                  {i + 1}
                </span>
                <p className="font-semibold text-emerald-950">{step.title}</p>
                <p className="text-sm text-gray-500 mt-1">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section id="mapa" className="bg-emerald-950 px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-semibold text-emerald-300">UŽIVO SA TERENA</span>
          <h2 className="text-3xl font-bold text-white mt-2 mb-6">Trenutno stanje prijava</h2>

          {loading && <p className="text-emerald-200">Učitavanje mape...</p>}
          {error && <p className="text-red-300">{error}</p>}
          {!loading && !error && <ReportsMap reports={reports} />}
        </div>
      </section>

      {/* Nedavne prijave */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-emerald-950 mb-6">Nedavne prijave</h2>

          {!loading && recentReports.length === 0 && (
            <p className="text-gray-500">Još nema objavljenih prijava.</p>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {recentReports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
