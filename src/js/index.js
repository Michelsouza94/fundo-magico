const btn = document.getElementById('generate-btn');
const descriptionInput = document.getElementById('description');
const preview = document.getElementById('preview-section');
const htmlCode = document.getElementById('html-code');
const cssCode = document.getElementById('css-code');

btn.addEventListener('click', async (e) => {
    e.preventDefault();

    const prompt = descriptionInput.value.trim();

    if (!prompt) {
        return alert("Descreva o background primeiro!");
    }

    btn.innerText = "Mágica instantânea...";
    btn.disabled = true;

    try {
        // 1. Chama a API da Vercel
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        // 2. Lê a resposta
        const data = await response.json();

        console.log("Resposta da API:", data);

        // 3. Verifica se a API retornou erro
        if (!response.ok) {
            throw new Error(
                data.error || "Erro na conexão com a IA"
            );
        }

        // 4. Verifica se recebeu o CSS
        if (!data.content) {
            throw new Error(
                "A IA não retornou um gradiente válido."
            );
        }

        // 5. Limpa o CSS recebido
        let generatedCss = data.content
            .replace(/```css/gi, "")
            .replace(/```/g, "")
            .replace(/background-image\s*:/gi, "")
            .replace(/background\s*:/gi, "")
            .trim();

        console.log("CSS gerado:", generatedCss);

        // 6. Aplica o background no site
        document.body.style.backgroundImage = "none";
        document.body.style.background = generatedCss;
        document.body.style.backgroundSize = "400% 400%";

        // 7. Cria a animação
        document.body.animate(
            [
                { backgroundPosition: "0% 50%" },
                { backgroundPosition: "100% 50%" },
                { backgroundPosition: "0% 50%" }
            ],
            {
                duration: 15000,
                iterations: Infinity,
                easing: "ease-in-out"
            }
        );

        // 8. Atualiza o preview
        preview.style.display = "block";
        preview.style.background = generatedCss;
        preview.style.backgroundSize = "400% 400%";
        preview.style.animation = "gradientMove 15s ease infinite";

        // 9. Mostra o código gerado
        htmlCode.textContent =
            `<div class="gradient-background"></div>`;

        cssCode.textContent =
            `background: ${generatedCss};
background-size: 400% 400%;
animation: gradientMove 15s ease infinite;`;

    } catch (error) {
        console.error("Erro:", error);

        alert(
            "A magia falhou: " + error.message
        );

    } finally {
        btn.innerText = "Gerar background Mágico";
        btn.disabled = false;
    }
});
