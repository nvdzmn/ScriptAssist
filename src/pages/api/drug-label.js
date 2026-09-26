export default async function handler(req, res) {
  const brand = String(req.query.brand || '').replace(/®/g, '').trim();
  if (!brand) return res.status(400).json({ error: 'A drug brand is required.' });
  const search = encodeURIComponent(`openfda.brand_name:"${brand}"`);
  const apiKey = process.env.OPENFDA_API_KEY ? `&api_key=${encodeURIComponent(process.env.OPENFDA_API_KEY)}` : '';
  try {
    const response = await fetch(`https://api.fda.gov/drug/label.json?search=${search}&limit=1${apiKey}`);
    if (response.status === 404) return res.status(404).json({ error: 'No matching FDA label was found.' });
    const payload = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: 'FDA label lookup failed.' });
    const record = payload.results?.[0] || {};
    const clean = (section) => (Array.isArray(section) ? section[0] : section || '').replace(/\s+/g, ' ').slice(0, 500);
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json({ indication: clean(record.indications_and_usage), warnings: clean(record.warnings) || clean(record.warnings_and_cautions), dosage: clean(record.dosage_and_administration), source: 'openFDA drug-label database' });
  } catch {
    return res.status(502).json({ error: 'Unable to reach openFDA.' });
  }
}
