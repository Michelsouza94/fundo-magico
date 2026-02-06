const URL = "https://api.groq.com/openai/v1/chat/completions";

const btn = document.getElementById('generate-btn');
const descriptionInput = document.getElementById('description');
const preview = document.getElementById('preview-section');
const htmlCode = document.getElementById('html-code');
const cssCode = document.getElementById('css-code');

// Função inteligente para buscar a chave
async function getApiKey() {
    try {
        
        const module = await import('./key.js');
        return module.API_KEY;
    } catch (e) {
        
        console.warn("Ambiente online detectado. Usando chaves da Vercel.");
        return null;
    }
}

btn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const prompt = descriptionInput.value;
    if (!prompt) return alert("Descreva o background primeiro!");

    btn.innerText = "Mágica instantânea...";
    btn.disabled = true;

    try {
        // Busca a chave de forma dinâmica
        const localKey = await getApiKey();
        
        const FINAL_KEY = localKey || "";

        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FINAL_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{
                    role: "user", 
                    content: `Crie um gradiente CSS linear vibrante para o tema: ${prompt}. Retorne APENAS o valor (ex: linear-gradient(90deg, #color1, #color2)). Sem markdown.`
                }]
            })
        });

        if (!response.ok) throw new Error("Erro na conexão com a IA");

        const data = await response.json();
        let generatedCss = data.choices[0].message.content.trim();
        generatedCss = generatedCss.replace(/```css|```|;|background:|background-image:/g, "").trim();

        // Aplica o visual
        document.body.style.background = generatedCss;
        document.body.style.backgroundSize = "400% 400%";
        preview.style.display = "block"; 
        preview.style.background = generatedCss;
        
        htmlCode.textContent = `<div class="gradient-background"></div>`;
        cssCode.textContent = `background: ${generatedCss};`;

    } catch (error) {
        console.error(error);
        alert("A magia falhou: verifique sua chave de API!");
    } finally {
        btn.innerText = "Gerar background Mágico";
        btn.disabled = false;
    }
});