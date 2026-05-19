import { useMemo, useState } from 'react';
import Map, { Layer, Marker, NavigationControl, Popup, Source } from 'react-map-gl';
import { BoltIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { Station } from '../../types';

interface StationMapProps {
  stations: Station[];
  selectedStationId?: string;
  onSelect?: (station: Station) => void;
}

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

export const StationMap = ({ stations, selectedStationId, onSelect }: StationMapProps) => {
  const [query, setQuery] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [popupStation, setPopupStation] = useState<Station | null>(null);

  const filteredStations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stations.filter((station) => {
      const matchesSearch = !q || station.name.toLowerCase().includes(q) || station.city.toLowerCase().includes(q);
      const matchesAvailability = !showOnlyAvailable || station.approvalStatus === 'approved';
      return matchesSearch && matchesAvailability;
    });
  }, [query, showOnlyAvailable, stations]);

  const defaultCenter = filteredStations[0]?.location.coordinates ?? [75.7873, 26.9124];

  if (!mapboxToken) {
    return (
      <div className="panel-muted h-[360px] p-5 text-sm text-slate-600">
        Add `VITE_MAPBOX_TOKEN` to enable the interactive station map.
      </div>
    );
  }

  const geojson = {
    type: 'FeatureCollection' as const,
    features: filteredStations.map((station) => ({
      type: 'Feature' as const,
      properties: {
        id: station._id,
        name: station.name,
        city: station.city,
        pricePerKwh: station.pricePerKwh,
        approvalStatus: station.approvalStatus,
        chargingPorts: station.chargingPorts
      },
      geometry: {
        type: 'Point' as const,
        coordinates: station.location.coordinates
      }
    }))
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search station or city" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={showOnlyAvailable} onChange={(e) => setShowOnlyAvailable(e.target.checked)} />
          Available only
        </label>
      </div>

      <Map
        mapboxAccessToken={mapboxToken}
        initialViewState={{ longitude: defaultCenter[0], latitude: defaultCenter[1], zoom: 11 }}
        style={{ width: '100%', height: 380 }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        <NavigationControl position="top-right" />
        <Source id="stations" type="geojson" data={geojson} cluster clusterRadius={40} clusterMaxZoom={13}>
          <Layer
            id="clusters"
            type="circle"
            filter={['has', 'point_count']}
            paint={{
              'circle-color': '#0f9d77',
              'circle-radius': ['step', ['get', 'point_count'], 16, 8, 22, 16, 28],
              'circle-opacity': 0.85
            }}
          />
          <Layer
            id="cluster-count"
            type="symbol"
            filter={['has', 'point_count']}
            layout={{ 'text-field': '{point_count_abbreviated}', 'text-size': 12 }}
            paint={{ 'text-color': '#ffffff' }}
          />
        </Source>

        {filteredStations.map((station) => (
          <Marker
            key={station._id}
            longitude={station.location.coordinates[0]}
            latitude={station.location.coordinates[1]}
            onClick={() => {
              onSelect?.(station);
              setPopupStation(station);
            }}
          >
            <button
              type="button"
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 shadow ${selectedStationId === station._id ? 'border-emerald-600 bg-emerald-500 text-white' : 'border-white bg-slate-800 text-white'}`}
            >
              <BoltIcon className="h-4 w-4" />
            </button>
          </Marker>
        ))}

        {popupStation ? (
          <Popup
            longitude={popupStation.location.coordinates[0]}
            latitude={popupStation.location.coordinates[1]}
            closeButton
            closeOnClick={false}
            onClose={() => setPopupStation(null)}
            anchor="bottom"
          >
            <div className="w-56 text-sm">
              <p className="font-semibold text-slate-900">{popupStation.name}</p>
              <p className="text-slate-500">{popupStation.city}</p>
              <p className="mt-2 text-slate-600">Availability: {popupStation.approvalStatus}</p>
              <p className="text-slate-600">Pricing: Rs {popupStation.pricePerKwh}/kWh</p>
              <button className="btn-primary mt-3 w-full !px-3 !py-2 text-xs" onClick={() => onSelect?.(popupStation)}>Book Now</button>
            </div>
          </Popup>
        ) : null}
      </Map>
    </div>
  );
};
