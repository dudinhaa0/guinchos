import { useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';

export default function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function findMyLocation() {
    setLoading(true);
    setError('');
    setLatitude(null);
    setLongitude(null);
    setAccuracy(null);

    try {
      let permission = await Geolocation.checkPermissions();

      if (permission.location !== 'granted') {
        permission = await Geolocation.requestPermissions();
      }

      if (permission.location !== 'granted') {
        throw new Error(
          'Permissão de localização negada. Ative a localização do Guinchos24h nas configurações do celular.'
        );
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      });

      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setAccuracy(position.coords.accuracy);
    } catch (err) {
      console.error('Erro ao obter localização:', err);

      const message = String(err?.message || '').toLowerCase();
      if (message.includes('timeout') || err?.code === 'OS-PLUG-GLOC-0010') {
        setError('O GPS demorou demais para responder. Verifique se a localização está ativada e tente novamente em um local aberto.');
      } else if (message.includes('permission') || message.includes('denied')) {
        setError('A permissão de localização foi negada. Autorize o acesso à localização nas configurações do Android.');
      } else {
        setError(err?.message || 'Não foi possível obter sua localização. Verifique o GPS e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  const mapsUrl = latitude !== null && longitude !== null
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : '';

  return (
    <main className="page">
      <section className="app-card">
        <div className="brand-mark" aria-hidden="true">🚛</div>
        <p className="eyebrow">ASSISTÊNCIA RODOVIÁRIA 24 HORAS</p>
        <h1>Guinchos<span>24h</span></h1>
        <p className="intro">
          Quebrou na estrada? Não precisa saber o quilômetro.
          Encontre sua localização pelo GPS e compartilhe com o guincho.
        </p>

        <button className="primary-button" onClick={findMyLocation} disabled={loading}>
          {loading ? <><span className="spinner" /> Buscando localização...</> : '📍 Encontrar minha localização'}
        </button>

        {error && (
          <div className="message error" role="alert">
            <strong>Não foi possível localizar.</strong>
            <p>{error}</p>
          </div>
        )}

        {latitude !== null && longitude !== null && (
          <div className="result">
            <div className="success-title">✓ Localização encontrada</div>
            <div className="coordinate">
              <span>Latitude</span>
              <strong>{latitude.toFixed(6)}</strong>
            </div>
            <div className="coordinate">
              <span>Longitude</span>
              <strong>{longitude.toFixed(6)}</strong>
            </div>
            <div className="accuracy">
              Precisão aproximada: <strong>{accuracy.toFixed(1)} metros</strong>
            </div>
            <a className="maps-button" href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Abrir localização no Google Maps ↗
            </a>
            <p className="hint">Envie este ponto ao serviço de reboque para facilitar sua localização.</p>
          </div>
        )}

        <p className="footnote">Sua localização só é consultada quando você toca no botão.</p>
      </section>
    </main>
  );
}