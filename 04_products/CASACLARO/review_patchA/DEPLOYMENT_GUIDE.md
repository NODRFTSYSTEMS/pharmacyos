# CasaClaro Patch A - Deployment Guide
**Version:** 2.1  
**Date:** March 29, 2026  
**Status:** Production Ready

## Files Included

### New Files (Create these)
1. `currency-engine.js` - Live exchange rate engine
2. `city.html` - Dynamic city detail template
3. `submit-property.html` - Property listing form
4. `retiree-guide.html` - Comprehensive retiree guide

### Modified Files (Update these)
1. `cities_enhanced.json` - Added rentalMarket data to all cities
2. `styles_v2.css` - Add Patch A CSS additions (see styles_v2.css.patch)

### Required Updates to Existing Pages
Add to `<head>` of `index_v2.html`, `relocation.html`, `partners.html`:
```html
<script src="currency-engine.js"></script>
```

Add live rate badge to header:
```html
<div id="live-rate-badge"></div>
```

Update navigation links to point to new files:
- `retiree-guide.html` (was dead link)
- `submit-property.html` (was dead link)
- `city.html?id=medellin` (dynamic)

## Key Features Deployed

### 1. Live Exchange Rates
- Hourly updates from exchangerate.host
- Offline fallback to cached rates
- Visual stale indicator after 2 hours
- Auto-conversion USD↔COP

### 2. 404 Remediation
All previously dead links now functional:
- ✅ Retiree Guide (comprehensive 90-day checklist)
- ✅ Property Submission (multi-step form with photo upload)
- ✅ City Detail Pages (dynamic neighborhood breakdown)

### 3. Rental Market Integration
- Added rental rates to all 3 cities
- Lease term information
- Deposit requirements
- Short-term regulation notes

## Testing Checklist

- [ ] Load index_v2.html - verify rate badge appears
- [ ] Click "Explore" on Medellín card - verify city.html loads
- [ ] Check rate conversion on prices
- [ ] Test property form currency toggle
- [ ] Verify mobile responsiveness
- [ ] Check all navigation links functional

## API Limits
- exchangerate.host: 100 requests/hour (sufficient with caching)
- Fallback rate: 4100 COP/USD (update if stale >24hrs)

## Next Patches
- **Patch B:** Rental Calculator + Neighborhood Expansion
- **Patch C:** Spanish i18n Framework
