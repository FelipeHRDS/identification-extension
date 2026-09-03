const grupoUsuario = document.querySelector(".grupoUsuario");
const popup = document.querySelector(".popup");
const botao = document.querySelector(".botao");

function adicionarItem() {
    const novoItem = grupoUsuario.cloneNode(true);

    novoItem.classList.remove("ocultar");

    const lixeira = novoItem.querySelector(".fa-trash");

    lixeira.addEventListener("click", (event) => {
        event.target.closest(".grupoUsuario").remove();
    });

    const switchButton = novoItem.querySelector(".switchInput");

    switchButton.addEventListener("change", (e) => {
        const isChecked = e.target.checked;

        console.log(isChecked);
    });

    popup.insertBefore(novoItem, popup.children[1]);
}

botao.addEventListener("click", adicionarItem);