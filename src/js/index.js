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
        // 1. Faz a chamada para a sua própria rota segura na Vercel
        const response = await fetch("/api/generate", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: descriptionInput.value })
        });

        if (!response.ok) throw new Error("Erro na conexão com a IA");

        const data = await response.json();
        
        // 2. Limpa o texto recebido da IA
        let generatedCss = data.choices[0].message.content.trim();
        generatedCss = generatedCss.replace(/```css|```|;|background:|background-image:/g, "").trim();

        // 3. Aplica o visual ao fundo do site com o tamanho necessário para a animação
        document.body.style.backgroundImage = "none"; 
        document.body.style.background = generatedCss;
        document.body.style.backgroundSize = "400% 400%";

        // 4. Cria a animação de ondulação (movimento suave)
        document.body.animate([
            { backgroundPosition: '0% 50%' },
            { backgroundPosition: '100% 50%' },
            { backgroundPosition: '0% 50%' }
        ], {
            duration: 15000, 
            iterations: Infinity,
            easing: 'ease-in-out'
        });

        // 5. Atualiza o card de preview e os campos de código
        preview.style.display = "block"; 
        preview.style.background = generatedCss;
        preview.style.backgroundSize = "400% 400%";
        preview.style.animation = "gradientMove 15s ease infinite";
        
        htmlCode.textContent = `<div class="gradient-background"></div>`;
        cssCode.textContent = `background: ${generatedCss};\nbackground-size: 400% 400%;\nanimation: gradientMove 15s ease infinite;`;

    } catch (error) {
        console.error(error);
        alert("A magia falhou: verifique os logs no console.");
    } finally {
        btn.innerText = "Gerar background Mágico";
        btn.disabled = false;
    }
});