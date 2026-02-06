const URL = "https://api.groq.com/openai/v1/chat/completions";

const btn = document.getElementById('generate-btn');
const descriptionInput = document.getElementById('description');
const preview = document.getElementById('preview-section');
const htmlCode = document.getElementById('html-code');
const cssCode = document.getElementById('css-code');

// Função para pegar a chave do seu PC ou da Vercel
async function getApiKey() {
    try {
        const module = await import('./key.js');
        return module.API_KEY;
    } catch (e) {
        // Na Vercel, o arquivo key.js não existe, então retornamos vazio
        // A Vercel injetará a variável de ambiente se configurado corretamente
        return null; 
    }
}

btn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const prompt = descriptionInput.value;
    if (!prompt) return alert("Descreva o background primeiro!");

    // Pegamos a chave de forma dinâmica aqui dentro
    const KEY = await getApiKey();
    // Se não achar no arquivo, tenta pegar da variável global (Vercel)
    const API_KEY = KEY || "SUA_CHAVE_AQUI_CASO_NAO_USE_VAR_AMBIENTE"; 

    btn.innerText = "Mágica instantânea...";
    btn.disabled = true;

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{
                    role: "user", 
                    content: `Crie um gradiente CSS linear vibrante com pelo menos 3 cores para o tema: ${prompt}. Regras: 1. Retorne APENAS o valor do background (ex: linear-gradient(90deg, #color1, #color2, #color3)). 2. Não use markdown, não use ponto e vírgula, retorne apenas o valor puro.`
                }]
            })
        });

        if (!response.ok) throw new Error("Erro na requisição");

        const data = await response.json();
        let generatedCss = data.choices[0].message.content.trim();
        generatedCss = generatedCss.replace(/```css|```|;|background:|background-image:/g, "").trim();

        // Aplica a mágica visual
        document.body.style.backgroundImage = "none";
        document.body.style.background = generatedCss;
        document.body.style.backgroundSize = "400% 400%";

        document.body.animate([
            { backgroundPosition: '0% 50%' },
            { backgroundPosition: '100% 50%' },
            { backgroundPosition: '0% 50%' }
        ], { duration: 12000, iterations: Infinity, easing: 'ease-in-out' });

        // Atualiza UI
        preview.style.display = "block"; 
        preview.style.background = generatedCss;
        preview.style.backgroundSize = "400% 400%";
        htmlCode.textContent = `<div class="gradient-background"></div>`;
        cssCode.textContent = `background: ${generatedCss};...`;

    } catch (error) {
        console.error("Erro:", error);
        alert("A magia falhou!");
    } finally {
        btn.innerText = "Gerar background Mágico";
        btn.disabled = false;
    }
});