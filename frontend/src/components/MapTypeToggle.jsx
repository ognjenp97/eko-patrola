function MapTypeToggle({ mapType, onChange }) {
  return (
    <div className="absolute top-3 right-3 z-[1000] bg-white rounded-lg shadow-sm flex overflow-hidden text-sm font-medium">
      <button
        type="button"
        onClick={() => onChange('standard')}
        className={`px-3 py-1.5 transition-colors ${
          mapType === 'standard'
            ? 'bg-emerald-800 text-white'
            : 'text-emerald-950 hover:bg-gray-50'
        }`}
      >
        Mapa
      </button>
      <button
        type="button"
        onClick={() => onChange('satellite')}
        className={`px-3 py-1.5 transition-colors ${
          mapType === 'satellite'
            ? 'bg-emerald-800 text-white'
            : 'text-emerald-950 hover:bg-gray-50'
        }`}
      >
        Satelit
      </button>
    </div>
  );
}

export default MapTypeToggle;
