export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Método não permitido"
        });
    }

    const { prompt } = req.body || {};
    const API_KEY = process.env.GROQ_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({
            error: "GROQ_API_KEY não configurada na Vercel"
        });
    }

    if (!prompt) {
        return res.status(400).json({
            error: "O prompt é obrigatório"
        });
    }

    try {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-120b",
                    messages: [
                        {
                            role: "system",
                            content:
                                "Você é um especialista em CSS. Gere apenas valores CSS válidos para background. Nunca use markdown, explicações ou blocos de código."
                        },
                        {
                            role: "user",
                            content: `Crie um gradiente CSS linear para o tema: ${prompt}. Retorne APENAS um valor como linear-gradient(90deg, #ff0000, #0000ff).`
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log("Groq status:", response.status);
        console.log("Groq resposta:", data);

        if (!response.ok) {
            return res.status(response.status).json({
                error: data?.error?.message || "Erro retornado pela Groq",
                details: data
            });
        }

        if (!data?.choices?.[0]?.message?.content) {
            return res.status(500).json({
                error: "A Groq não retornou conteúdo válido",
                details: data
            });
        }

        return res.status(200).json({
            content: data.choices[0].message.content.trim()
        });

    } catch (error) {
        console.error("Erro na API:", error);

        return res.status(500).json({
            error: error.message || "Erro interno no servidor"
        });
    }
}
