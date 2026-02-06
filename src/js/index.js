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
        // No lugar da URL da Groq, use a sua nova rota:
        const response = await fetch("/api/generate", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: descriptionInput.value })
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