export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  if (!process.env.XAI_API_KEY) return res.status(503).json({ error: 'Image generation is not configured.' });

  const { therapyType = 'injection pen' } = req.body || {};
  const prompt = therapyType === 'oral medication'
    ? 'Create a clean, reassuring editorial illustration for a patient medication handout: a generic pill bottle and one tablet beside a glass of water on a white background. Minimal navy and teal accents, no text, no logo, no brand labels, no people, no medical claims.'
    : 'Create a clean, reassuring editorial illustration for a patient medication handout: an adult hand holding a generic prefilled injection pen beside a simple step-by-step preparation tray on a white background. Minimal navy and teal accents, no text, no logo, no brand labels, no needle insertion, no blood, no patient-specific features, no medical claims.';

  try {
    const response = await fetch('https://api.x.ai/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.XAI_API_KEY}` },
      body: JSON.stringify({ model: 'grok-imagine-image-2.0', prompt, quality: 'low' })
    });
    const payload = await response.json();
    if (!response.ok) {
      const message = typeof payload?.error === 'string' ? payload.error : payload?.error?.message;
      return res.status(response.status).json({ error: message || 'Image generation failed.' });
    }
    const imageUrl = payload?.data?.[0]?.url;
    if (!imageUrl) return res.status(502).json({ error: 'The image service returned no image.' });
    return res.status(200).json({ imageUrl });
  } catch {
    return res.status(502).json({ error: 'Unable to reach the image service.' });
  }
}
