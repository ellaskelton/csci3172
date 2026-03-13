/**
 * Music Discovery – client-side logic
 * Calls the Netlify serverless API (Spotify proxy) for search and related artists.
 */

(function () {
  'use strict';

  const API_BASE = '/api';
  const form = document.getElementById('search-form');
  const queryInput = document.getElementById('artist-query');
  const apiStatus = document.getElementById('api-status');
  const resultsSection = document.getElementById('results-section');
  const artistList = document.getElementById('artist-list');
  const relatedSection = document.getElementById('related-section');
  const relatedSubtitle = document.getElementById('related-subtitle');
  const relatedList = document.getElementById('related-list');
  const errorSection = document.getElementById('error-section');

  function setStatus(text, type) {
    if (!apiStatus) return;
    apiStatus.textContent = text;
    apiStatus.className = 'status-message ' + (type || '');
  }

  function showError(message) {
    if (errorSection) {
      errorSection.textContent = message;
      errorSection.classList.remove('hidden');
    }
  }

  function clearError() {
    if (errorSection) errorSection.classList.add('hidden');
  }

  function setVisible(el, visible) {
    if (!el) return;
    if (visible) el.classList.remove('hidden');
    else el.classList.add('hidden');
  }

  async function apiGet(endpoint, params = {}) {
    const url = new URL(API_BASE + endpoint, window.location.origin);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString());
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Request failed: ${res.status}`);
    }
    return data;
  }

  function renderArtistItem(artist, onClick) {
    const li = document.createElement('li');
    li.className = 'artist-card';
    const img = artist.images && artist.images[0];
    const imgEl = img
      ? document.createElement('img')
      : null;
    if (imgEl) {
      imgEl.src = img.url;
      imgEl.alt = '';
      imgEl.width = 64;
      imgEl.height = 64;
    }
    const text = document.createElement('div');
    text.className = 'artist-card-text';
    const name = document.createElement('span');
    name.className = 'artist-name';
    name.textContent = artist.name;
    const genres = document.createElement('span');
    genres.className = 'artist-genres';
    genres.textContent = (artist.genres || []).slice(0, 3).join(', ') || '—';
    text.append(name, document.createElement('br'), genres);
    if (imgEl) li.appendChild(imgEl);
    li.appendChild(text);
    if (onClick) {
      li.setAttribute('role', 'button');
      li.tabIndex = 0;
      li.addEventListener('click', () => onClick(artist));
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(artist);
        }
      });
    }
    return li;
  }

  async function onSearch(e) {
    e.preventDefault();
    clearError();
    const q = (queryInput && queryInput.value || '').trim();
    if (!q) {
      showError('Please enter an artist name.');
      return;
    }
    setStatus('Searching…');
    setVisible(resultsSection, false);
    setVisible(relatedSection, false);
    artistList.innerHTML = '';
    try {
      const data = await apiGet('/search', { q, limit: '12' });
      const items = data.items || [];
      if (items.length === 0) {
        setStatus('No artists found. Try another name.');
        return;
      }
      setStatus('');
      setVisible(resultsSection, true);
      items.forEach((artist) => {
        artistList.appendChild(renderArtistItem(artist, () => loadRelated(artist)));
      });
    } catch (err) {
      setStatus('');
      showError(err.message || 'Search failed.');
    }
  }

  async function loadRelated(artist) {
    clearError();
    setVisible(relatedSection, true);
    relatedSubtitle.textContent = 'Artists similar to ' + artist.name;
    relatedList.innerHTML = '<li class="loading">Loading…</li>';
    try {
      const artists = await apiGet('/related', { id: artist.id });
      relatedList.innerHTML = '';
      if (!artists.length) {
        relatedList.innerHTML = '<li class="no-results">No similar artists found.</li>';
        return;
      }
      artists.forEach((a) => {
        relatedList.appendChild(renderArtistItem(a, null));
      });
    } catch (err) {
      relatedList.innerHTML = '';
      relatedList.appendChild(
        Object.assign(document.createElement('li'), {
          className: 'error-item',
          textContent: err.message || 'Failed to load similar artists.',
        })
      );
    }
  }

  async function checkHealth() {
    try {
      await apiGet('/health');
      setStatus('Ready. Search for an artist above.');
    } catch (err) {
      setStatus('Server or Spotify not configured. Set env vars in Netlify and try again.');
    }
  }

  if (form) form.addEventListener('submit', onSearch);
  checkHealth();
})();
