export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { woningdata } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Je bent een Nederlandse huurrecht expert. Genereer een professioneel huurrapport op basis van deze woninggegevens: ${JSON.stringify(woningdata)}. 
        
        Het rapport bevat:
        1. Volledige puntentelling per categorie met uitleg
        2. Persoonlijk stappenplan
        3. Juridische rechten van de huurder
        4. Kant-en-klare bezwaarbrief voor de Huurcommissie
        
        Schrijf in professioneel Nederlands.`
      }]
    })
  });

  const data = await response.json();
  const rapport = data.content[0].text;

  res.status(200).json({ rapport });
}
