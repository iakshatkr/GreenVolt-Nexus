import Map, { Marker, NavigationControl } from 'react-map-gl';
import type { Station } from '../../types';

interface StationMapProps {
  stations: Station[];
  selectedStationId?: string;
  onSelect?: (station: Station) => void;
}

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

export const StationMap = ({ stations, selectedStationId, onSelect }: StationMapProps) => {
  const defaultCenter = stations[0]?.location.coordinates ?? [75.7873, 26.9124];

  if (!mapboxToken) {
    return (
      <div className="panel-muted h-[360px] overflow-hidden p-5">
        <div className="grid h-full gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-[linear-gradient(135deg,#0c1728,#0d563a)] p-5 text-white">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-200">Mapbox token missing</p>
            <p className="mt-4 font-display text-2xl font-semibold">Station map fallback</p>
            <p className="mt-3 text-sm text-slate-300">
              Add `VITE_MAPBOX_TOKEN` to render the live interactive map.
            </p>
          </div>
          <div className="space-y-3 overflow-y-auto pr-1">
            {stations.map((station) => (
              <button
                key={station._id}
                type="button"
                onClick={() => onSelect?.(station)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedStationId === station._id
                    ? 'border-brand-400/40 bg-brand-400/10'
                    : 'border-white/8 bg-white/[0.03]'
                }`}
              >
                <p className="font-semibold text-white">{station.name}</p>
                <p className="text-sm text-slate-400">{station.address}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/8">
      <Map
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: defaultCenter[0],
          latitude: defaultCenter[1],
          zoom: 11
        }}
        style={{ width: '100%', height: 360 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        <NavigationControl position="top-right" />
        {stations.map((station) => (
          <Marker
            key={station._id}
            longitude={station.location.coordinates[0]}
            latitude={station.location.coordinates[1]}
            onClick={() => onSelect?.(station)}
          >
            <button
              type="button"
              className={`h-4 w-4 rounded-full border-4 ${
                selectedStationId === station._id
                  ? 'border-sun bg-brand-300'
                  : 'border-brand-400 bg-brand-500'
              }`}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
};
