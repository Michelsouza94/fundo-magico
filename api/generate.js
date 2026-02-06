export default async function handler(req, res) {
    const { prompt } = req.body;
    // Aqui a Vercel pega a chave que você salvou no painel com segurança
    const API_KEY = process.env.GROQ_API_KEY; 

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{
                    role: "user",
                    content: `Crie um gradiente CSS linear para o tema: ${prompt}. Retorne APENAS o valor (ex: linear-gradient(90deg, #color1, #color2)). Sem markdown.`
                }]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Erro no servidor" });
    }
}
