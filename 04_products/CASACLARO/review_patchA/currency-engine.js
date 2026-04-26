/**
 * CasaClaro Live Currency Engine v1.0
 * Real-time COP/USD with offline fallback
 * Updates: Hourly | Source: exchangerate.host (Banco de la República)
 */

const CurrencyEngine = {
  config: {
    apiEndpoint: 'https://api.exchangerate.host/latest?base=USD&symbols=COP',
    refreshInterval: 3600000, // 1 hour
    fallbackRate: 4100,
    staleThreshold: 7200000 // 2 hours
  },

  state: {
    currentRate: null,
    lastUpdated: null,
    source: 'initializing',
    isStale: false
  },

  async init() {
    this.loadFromCache();
    await this.fetchLiveRate();
    setInterval(() => this.fetchLiveRate(), this.config.refreshInterval);
    this.renderBadge();
    this.updateAllCalculations();
  },

  loadFromCache() {
    const cached = localStorage.getItem('casaclaro_fx');
    if (cached) {
      const data = JSON.parse(cached);
      const age = Date.now() - new Date(data.timestamp).getTime();

      this.state.currentRate = data.rate;
      this.state.lastUpdated = data.timestamp;
      this.state.source = 'cache';
      this.state.isStale = age > this.config.staleThreshold;
    } else {
      this.state.currentRate = this.config.fallbackRate;
      this.state.lastUpdated = new Date().toISOString();
      this.state.source = 'fallback';
      this.state.isStale = true;
    }
  },

  async fetchLiveRate() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(this.config.apiEndpoint, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const rate = data.rates.COP;

      if (rate < 3000 || rate > 6000) throw new Error('Rate out of expected range');

      this.state.currentRate = rate;
      this.state.lastUpdated = new Date().toISOString();
      this.state.source = 'live';
      this.state.isStale = false;

      localStorage.setItem('casaclaro_fx', JSON.stringify({
        rate: rate,
        timestamp: this.state.lastUpdated
      }));

      this.renderBadge();
      this.updateAllCalculations();

    } catch (error) {
      console.error('[FX] Fetch failed:', error);
      this.state.source = 'cache-fallback';
      this.state.isStale = true;
      this.renderBadge();
    }
  },

  renderBadge() {
    const badge = document.getElementById('live-rate-badge');
    if (!badge) return;

    const date = new Date(this.state.lastUpdated);
    const timeStr = date.toLocaleString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    });

    const statusIcon = this.state.isStale ? 
      '<i class="fas fa-exclamation-triangle" style="color: var(--gold);"></i>' : 
      '<i class="fas fa-sync-alt" style="color: var(--emerald);"></i>';

    const statusClass = this.state.isStale ? 'rate-stale' : 'rate-live';

    badge.innerHTML = `
      <div class="rate-badge ${statusClass}" style="
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: ${this.state.isStale ? 'rgba(244, 185, 66, 0.1)' : 'rgba(45, 138, 94, 0.1)'};
        color: ${this.state.isStale ? 'var(--gold-dark)' : 'var(--emerald)'};
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.875rem;
        border: 1px solid ${this.state.isStale ? 'var(--gold)' : 'var(--emerald)'};
      ">
        ${statusIcon}
        <span>1 USD = ${this.state.currentRate.toLocaleString('es-CO', {maximumFractionDigits: 0})} COP</span>
        <span style="opacity: 0.7; font-size: 0.75rem; margin-left: 0.5rem;">
          ${this.state.isStale ? '[Desactualizado]' : ''} ${timeStr}
        </span>
      </div>
    `;
  },

  toCOP(usdAmount) {
    return usdAmount * this.state.currentRate;
  },

  formatDual(usdAmount) {
    const cop = this.toCOP(usdAmount);
    return {
      usd: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(usdAmount),
      cop: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(cop),
      rate: this.state.currentRate
    };
  },

  updateAllCalculations() {
    document.querySelectorAll('[data-usd-price]').forEach(el => {
      const usd = parseFloat(el.dataset.usdPrice);
      if (isNaN(usd)) return;

      const formatted = this.formatDual(usd);
      const preferLocal = localStorage.getItem('casaclaro_prefer_cop') === 'true';

      if (el.classList.contains('dual-display')) {
        el.innerHTML = `
          <span class="primary-currency">${preferLocal ? formatted.cop : formatted.usd}</span>
          <span class="secondary-currency" style="opacity: 0.7; font-size: 0.875rem; display: block;">
            ${preferLocal ? `~${formatted.usd}` : `~${formatted.cop}`}
          </span>
        `;
      } else {
        el.textContent = preferLocal ? formatted.cop : formatted.usd;
      }
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CurrencyEngine.init());
} else {
  CurrencyEngine.init();
}
