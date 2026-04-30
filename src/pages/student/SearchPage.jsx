import React, { useState } from 'react';
import { Search, MapPin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import styles from '../Student.module.css';

const ETABLISSEMENTS = [
  {
    name: "Faculté des Sciences Ben M'Sik",
    abbr: 'FSBM',
    type: 'Faculté des Sciences',
    address: 'Avenue Driss El Harti, Ben M\'Sik, Casablanca',
    mapQuery: 'Faculté+des+Sciences+Ben+M\'Sik+Casablanca',
    lat: 33.5666, lng: -7.5419,
  },
  {
    name: 'Faculté des Sciences Ain Chock',
    abbr: 'FSAC',
    type: 'Faculté des Sciences',
    address: 'Km 8, Route El Jadida, Casablanca',
    mapQuery: 'Faculté+des+Sciences+Ain+Chock+Casablanca',
    lat: 33.5500, lng: -7.6200,
  },
  {
    name: 'Faculté des Sciences et Techniques',
    abbr: 'FSTM',
    type: 'Faculté des Sciences',
    address: 'Route El Jadida, Casablanca',
    mapQuery: 'Faculté+des+Sciences+et+Techniques+Mohammedia+Casablanca',
    lat: 33.5200, lng: -7.6100,
  },
  {
    name: 'Faculté des Lettres - Ain Chock',
    abbr: 'FLSHAC',
    type: 'Faculté des Lettres',
    address: 'Hay Hassan, Casablanca',
    mapQuery: 'Faculté+des+Lettres+Ain+Chock+Casablanca',
    lat: 33.5700, lng: -7.6050,
  },
  {
    name: "Faculté des Lettres - Ben M'Sik",
    abbr: 'FLSHB',
    type: 'Faculté des Lettres',
    address: "Avenue Driss El Harti, Ben M'Sik, Casablanca",
    mapQuery: "Faculté+des+Lettres+Ben+M'Sik+Casablanca",
    lat: 33.5680, lng: -7.5400,
  },
  {
    name: 'Faculté des Lettres - Mohammedia',
    abbr: 'FLSHM',
    type: 'Faculté des Lettres',
    address: 'Mohammedia, Casablanca',
    mapQuery: 'Faculté+des+Lettres+Mohammedia',
    lat: 33.6900, lng: -7.3900,
  },
  {
    name: 'Faculté des Sciences Juridiques Ain Chock',
    abbr: 'FSJESC',
    type: 'Faculté de Droit',
    address: "2 Rue Ben Charif, Casablanca",
    mapQuery: 'Faculté+Sciences+Juridiques+Ain+Chock+Casablanca',
    lat: 33.5878, lng: -7.6035,
  },
  {
    name: 'Faculté des Sciences Juridiques Ain Sebaâ',
    abbr: 'FSJESAS',
    type: 'Faculté de Droit',
    address: 'Ain Sebaâ, Casablanca',
    mapQuery: 'Faculté+Sciences+Juridiques+Ain+Sebaa+Casablanca',
    lat: 33.6050, lng: -7.5200,
  },
  {
    name: 'Faculté des Sciences Juridiques Mohammedia',
    abbr: 'FSJESM',
    type: 'Faculté de Droit',
    address: 'Mohammedia',
    mapQuery: 'Faculté+Sciences+Juridiques+Mohammedia',
    lat: 33.6900, lng: -7.3860,
  },
  {
    name: 'Faculté de Médecine et de Pharmacie',
    abbr: 'FMPC',
    type: 'Médecine',
    address: '19 Rue Tarik Ibn Ziad, Casablanca',
    mapQuery: 'Faculté+de+Médecine+et+Pharmacie+Casablanca',
    lat: 33.5869, lng: -7.6038,
  },
  {
    name: 'Faculté de Médecine Dentaire',
    abbr: 'FMDC',
    type: 'Médecine',
    address: 'Boulevard Allal El Fassi, Casablanca',
    mapQuery: 'Faculté+Médecine+Dentaire+Casablanca',
    lat: 33.5850, lng: -7.6100,
  },
  {
    name: 'ENCG Casablanca',
    abbr: 'ENCGC',
    type: 'Grande École',
    address: 'Km 9.5, Route El Jadida, Casablanca',
    mapQuery: 'ENCG+Casablanca',
    lat: 33.5421, lng: -7.6235,
  },
  {
    name: 'ENSEM',
    abbr: 'ENSEM',
    type: 'Grande École',
    address: "Km 7, Route El Jadida, Casablanca",
    mapQuery: 'ENSEM+Casablanca',
    lat: 33.5500, lng: -7.6170,
  },
  {
    name: 'ENSAM',
    abbr: 'ENSAM',
    type: 'Grande École',
    address: 'Casablanca',
    mapQuery: 'ENSAM+Casablanca',
    lat: 33.5720, lng: -7.5920,
  },
  {
    name: 'ENS Casablanca',
    abbr: 'ENS',
    type: 'Grande École',
    address: 'Route El Jadida, Casablanca',
    mapQuery: 'Ecole+Normale+Superieure+Casablanca',
    lat: 33.5490, lng: -7.6280,
  },
  {
    name: 'ENSET',
    abbr: 'ENSET',
    type: 'Grande École',
    address: 'Mohammedia',
    mapQuery: 'ENSET+Mohammedia',
    lat: 33.6870, lng: -7.3800,
  },
  {
    name: 'École Supérieure de Technologie',
    abbr: 'EST',
    type: 'Grande École',
    address: "Km 7, Route El Jadida, Casablanca",
    mapQuery: 'Ecole+Superieure+Technologie+Casablanca',
    lat: 33.5510, lng: -7.6190,
  },
  {
    name: 'ENSAD — Arts et Design',
    abbr: 'ENSAD',
    type: 'Grande École',
    address: 'Casablanca',
    mapQuery: 'ENSAD+Casablanca',
    lat: 33.5900, lng: -7.5850,
  },
];

const FILTERS = ['Tous', 'Faculté des Sciences', 'Faculté des Lettres', 'Faculté de Droit', 'Médecine', 'Grande École'];

// Default map: University Hassan II Casablanca center
const DEFAULT_MAP = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.98!2d-7.65!3d33.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4e8b5e5b9b%3A0x46c92f8e44!2sUniversit%C3%A9+Hassan+II+de+Casablanca!5e0!3m2!1sfr!2sma!4v1700000000000!5m2!1sfr!2sma';

const SearchPage = () => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Tous');
  const [selectedEtab, setSelectedEtab] = useState(null);

  const filtered = ETABLISSEMENTS.filter(e => {
    const matchFilter = filter === 'Tous' || e.type === filter;
    const matchQuery = e.name.toLowerCase().includes(query.toLowerCase()) || e.abbr.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  // Fallback using OSM/Nominatim approach without API key
  const mapEmbedSrc = selectedEtab
    ? `https://maps.google.com/maps?q=${selectedEtab.lat},${selectedEtab.lng}&z=16&output=embed`
    : `https://maps.google.com/maps?q=33.5731,+-7.5898&z=12&output=embed`;

  const externalLink = selectedEtab
    ? `https://www.google.com/maps/search/${selectedEtab.mapQuery}`
    : `https://www.google.com/maps/search/Université+Hassan+II+Casablanca`;

  return (
    <div className={styles.searchSection}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 8 }}>
        Établissements
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
        {ETABLISSEMENTS.length} établissements disponibles à l'Université Hassan II. Cliquez sur un établissement pour le localiser sur la carte.
      </p>

      {/* Search & Filter */}
      <div className={styles.searchBar}>
        <input
          id="search-input"
          className={styles.searchInput}
          placeholder={t('search_placeholder')}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" style={{ padding: '12px 20px' }}>
          <Search size={18} />
        </button>
      </div>

      <div className={styles.filterRow}>
        {FILTERS.map(f => (
          <button
            key={f}
            className={`${styles.filterChip} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Split layout: Results + Map */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: 24,
        marginTop: 8,
        alignItems: 'start',
      }}>
        {/* Left: Results list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 520, overflowY: 'auto', paddingRight: 4 }}>
          {filtered.map(e => {
            const isSelected = selectedEtab?.abbr === e.abbr;
            return (
              <div
                key={e.abbr}
                onClick={() => setSelectedEtab(isSelected ? null : e)}
                style={{
                  background: isSelected ? 'rgba(26,31,94,0.06)' : 'white',
                  border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid #e2e8f0',
                  borderRadius: 14,
                  padding: '14px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 4px 16px rgba(26,31,94,0.12)' : '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem', lineHeight: 1.3 }}>
                    {e.name}
                  </div>
                  <span style={{
                    background: isSelected ? 'var(--color-primary)' : '#e8eaf6',
                    color: isSelected ? 'white' : 'var(--color-primary)',
                    borderRadius: 6, padding: '2px 8px', fontSize: '0.72rem',
                    fontWeight: 700, flexShrink: 0, marginLeft: 8, transition: 'all 0.2s',
                  }}>{e.abbr}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 6 }}>{e.type}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: '#94a3b8' }}>
                  <MapPin size={12} />
                  <span>{e.address}</span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-muted)' }}>
              Aucun établissement trouvé.
            </div>
          )}
        </div>

        {/* Right: Google Maps */}
        <div style={{
          position: 'sticky',
          top: 20,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
          border: '2px solid #e2e8f0',
        }}>
          {/* Map header */}
          <div style={{
            background: 'var(--color-primary)',
            color: 'white',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {selectedEtab ? selectedEtab.name : 'Université Hassan II de Casablanca'}
              </span>
            </div>
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', textDecoration: 'none' }}
            >
              <ExternalLink size={13} />
              Ouvrir
            </a>
          </div>

          <iframe
            title="carte-etablissement"
            src={mapEmbedSrc}
            width="100%"
            height="420"
            style={{ border: 'none', display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {selectedEtab && (
            <div style={{
              padding: '12px 18px',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.82rem',
              color: '#64748b',
            }}>
              <MapPin size={14} color="var(--color-primary)" />
              <span>{selectedEtab.address}</span>
            </div>
          )}
          {!selectedEtab && (
            <div style={{
              padding: '10px 18px',
              background: '#f0f4ff',
              borderTop: '1px solid #e2e8f0',
              fontSize: '0.8rem',
              color: 'var(--color-primary)',
              textAlign: 'center',
              fontStyle: 'italic',
            }}>
              💡 Cliquez sur un établissement pour le localiser précisément
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
