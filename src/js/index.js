import { API_KEY } from './key.js';
const URL = "https://api.groq.com/openai/v1/chat/completions";

const btn = document.getElementById('generate-btn');
const descriptionInput = document.getElementById('description');
const preview = document.getElementById('preview-section');
const htmlCode = document.getElementById('html-code');
const cssCode = document.getElementById('css-code');

btn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const prompt = descriptionInput.value;
    if (!prompt) return alert("Descreva o background primeiro!");

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
                    content: `Crie um gradiente CSS linear vibrante com pelo menos 3 cores para o tema: ${prompt}. Regras: 
                    1. Retorne APENAS o valor do background (ex: linear-gradient(90deg, #color1, #color2, #color3)). 
                    2. Use sempre 90deg ou 270deg para favorecer o movimento horizontal. 
                    3. Não use markdown, não use ponto e vírgula, retorne apenas o valor puro.`
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Erro na requisição");
        }

        const data = await response.json();
        // Localize onde você recebe o conteúdo da IA e use estas linhas:
let generatedCss = data.choices[0].message.content.trim();

// Esta linha remove TUDO que não for o valor do gradiente
generatedCss = generatedCss.replace(/```css|```|;|background:|background-image:/g, "").trim();

console.log("Valor limpo enviado ao CSS:", generatedCss); // Confira se aparece apenas o linear-gradient no console

        // 1. Remove a imagem de fundo atual para não cobrir a animação
        document.body.style.backgroundImage = "none";

        // 2. Aplica o gradiente e "estica" ele para 400% do tamanho da tela
        document.body.style.background = generatedCss;
        document.body.style.backgroundSize = "400% 400%";

        // 3. Cria a animação de ondulação via código
        document.body.animate([
            { backgroundPosition: '0% 50%' },
            { backgroundPosition: '100% 50%' },
            { backgroundPosition: '0% 50%' }
        ], {
            duration: 12000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });

        // 4. Atualiza o card de preview
        preview.style.display = "block"; 
        preview.style.background = generatedCss;
        preview.style.backgroundSize = "400% 400%";
        preview.style.animation = "gradientMove 12s ease infinite";

        // 5. Exibe o código HTML para o usuário
        htmlCode.textContent = `<div class="gradient-background"></div>`;

        // 6. Exibe o código CSS gerado para o usuário
        cssCode.textContent = `background: ${generatedCss};\nbackground-size: 400% 400%;\nanimation: gradientMove 12s ease infinite;\n\n@keyframes gradientMove {\n    0% { background-position: 0% 50%; }\n    50% { background-position: 100% 50%; }\n    100% { background-position: 0% 50%; }\n}`;

    } catch (error) {
        console.error("Erro no Groq:", error);
        alert("A magia falhou: " + error.message);
    } finally {
        btn.innerText = "Gerar background Mágico";
        btn.disabled = false;
    }
});