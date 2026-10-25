function ReportCard({ report }) {
  const date = new Date(report.createdAt).toLocaleDateString('sr-Latn-BA');

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="relative h-40 bg-gray-100">
        {report.images?.[0] && (
          <img
            src={report.images[0]}
            alt={report.description}
            className="w-full h-full object-cover"
          />
        )}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
            report.status === 'cleaned'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-emerald-800'
          }`}
        >
          {report.status === 'cleaned' ? 'Očišćeno' : 'Aktivno'}
        </span>
      </div>
      <div className="p-4">
        <p className="font-medium text-emerald-950 line-clamp-2">{report.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
          <span>{date}</span>
          <span>
            {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ReportCard;
