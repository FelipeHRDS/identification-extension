const grupoUsuario = document.querySelector(".grupoUsuario");
const popup = document.querySelector(".popup");
const botao = document.querySelector(".botao");

function adicionarItem(nome = "Usuario", ativo = false) {
    const novoItem = grupoUsuario.cloneNode(true);

    novoItem.classList.remove("ocultar");

    const textoSwitch = novoItem.querySelector(".switchText");
    textoSwitch.innerText = nome;

    const switchButton = novoItem.querySelector(".switchInput");
    switchButton.checked = ativo;

    const lixeira = novoItem.querySelector(".fa-trash");

    lixeira.addEventListener("click", (event) => {
        const grupo = event.target.closest(".grupoUsuario");
        const usuarioExcluido = grupo.querySelector(".switchText").innerText;

        chrome.storage.local.get(["usuarios", "usuario"], (resultado) => {
            const usuarios = (resultado.usuarios || []).filter(
                usuario => usuario !== usuarioExcluido
            );

            const dados = { usuarios };

            if (resultado.usuario === usuarioExcluido) {
                dados.usuario = "";
            }

            chrome.storage.local.set(dados);
        });

        grupo.remove();
    });

    switchButton.addEventListener("change", (event) => {
        const usuario = event.target
            .closest(".grupoUsuario")
            .querySelector(".switchText")
            .innerText;

        const switches = document.querySelectorAll(".switchInput");

        switches.forEach(switchInput => {
            if (switchInput !== event.target) {
                switchInput.checked = false;
            }
        });

        if (event.target.checked) {
            chrome.storage.local.set({
                usuario
            });
        } else {
            chrome.storage.local.get("usuario", (resultado) => {
                if (resultado.usuario === usuario) {
                    chrome.storage.local.remove("usuario");
                }
            });
        }
    });

    const lapis = novoItem.querySelector(".fa-pencil");

    lapis.addEventListener("click", () => {
        const texto = novoItem.querySelector(".switchText");
        const nomeAntigo = texto.innerText;
        const input = document.createElement("input");

        input.value = nomeAntigo;

        novoItem.insertBefore(input, texto);
        texto.remove();

        input.focus();

        input.addEventListener("blur", () => {
            const novoNome = input.value.trim();

            const novoTexto = document.createElement("span");

            novoTexto.innerText = novoNome;
            novoTexto.classList.add("switchText");

            novoItem.insertBefore(novoTexto, input);
            input.remove();

            chrome.storage.local.get(["usuarios", "usuario"], (resultado) => {
                const usuarios = resultado.usuarios || [];
                const indice = usuarios.indexOf(nomeAntigo);

                if (indice !== -1) {
                    usuarios[indice] = novoNome;
                }

                const dados = { usuarios };

                if (resultado.usuario === nomeAntigo) {
                    dados.usuario = novoNome;
                }

                chrome.storage.local.set(dados);
            });
        });
    });

    popup.insertBefore(novoItem, popup.children[1]);

    if (nome === "Usuario" && !ativo) {
        chrome.storage.local.get("usuarios", (resultado) => {
            const usuarios = resultado.usuarios || [];

            if (!usuarios.includes("Usuario")) {
                usuarios.push("Usuario");

                chrome.storage.local.set({
                    usuarios
                });
            }
        });
    }
}

botao.addEventListener("click", () => {
    adicionarItem();
});

chrome.storage.local.get(["usuarios", "usuario"], (resultado) => {
    const usuarios = resultado.usuarios || [];
    const usuarioAtivo = resultado.usuario;

    usuarios.forEach(nome => {
        adicionarItem(nome, nome === usuarioAtivo);
    });
});