let usuarioAtivo = "";
let processandoEnvio = false;

// 1. Mantém o usuário sincronizado em tempo real (evita atraso no momento do Enter)
chrome.storage.local.get("usuario", (resultado) => {
    usuarioAtivo = resultado.usuario || "";
});

chrome.storage.onChanged.addListener((mudancas, area) => {
    if (area === "local" && mudancas.usuario) {
        usuarioAtivo = mudancas.usuario.newValue || "";
    }
});

function obterCaixa() {
    // Busca a caixa de texto do Lexical atualizada
    return document.querySelector("div[contenteditable='true'][data-lexical-editor='true']");
}

document.addEventListener("keydown", (event) => {
    // Se não for Enter, se tiver segurando Shift (quebra de linha) ou se já estiver enviando, ignora.
    if (event.key !== "Enter" || event.shiftKey || processandoEnvio) {
        return;
    }

    const caixa = obterCaixa();

    // Se a caixa não existir ou o Enter NÃO tiver sido pressionado dentro da caixa, ignora.
    if (!caixa || !caixa.contains(event.target)) {
        return;
    }

    const texto = caixa.textContent.trim();

    // Se estiver vazio ou não houver usuário selecionado no popup, deixa o WhatsApp agir normalmente
    if (!texto || !usuarioAtivo) {
        return;
    }

    // Intercepta o Enter nativo
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    processandoEnvio = true;
    caixa.focus();

    // 2. Coloca o cursor piscando exatamente no INÍCIO do texto
    const selecao = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(caixa);
    range.collapse(true); // true = move pro começo da caixa
    selecao.removeAllRanges();
    selecao.addRange(range);

    // 3. Insere apenas o prefixo. O Lexical do WhatsApp reconhece isso perfeitamente.
    const prefixo = `*${usuarioAtivo}:* `;
    document.execCommand("insertText", false, prefixo);

    // 4. Aguarda o WhatsApp processar a inserção de texto e clica em enviar
    setTimeout(() => {
        // Busca o botão de enviar (adicionado data-testid para maior garantia)
        const botaoEnviar = document.querySelector("[data-testid='send']") || document.querySelector("[aria-label='Enviar']");
        
        if (botaoEnviar) {
            botaoEnviar.click();
        }
        
        processandoEnvio = false;
    }, 150);

}, true);