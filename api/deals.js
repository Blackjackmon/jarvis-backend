export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.HUBSPOT_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  try {
    const response = await fetch(
      'https://api.hubapi.com/crm/v3/objects/deals?limit=100&properties=dealname,dealstage,amount,hs_lastmodifieddate',
      { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
    );
    if (!response.ok) throw new Error(`HubSpot API error: ${response.status}`);
    const data = await response.json();
    const deals = (data.results || []).map(deal => ({ id: deal.id, properties: deal.properties }));
    res.status(200).json({ deals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deals', message: error.message });
  }
}
