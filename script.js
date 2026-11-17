document.addEventListener("DOMContentLoaded", () => {
  const btnMenu = document.querySelector("#btn-menu");
  const menuPrincipal = document.querySelector("#menu-principal");

  if (btnMenu && menuPrincipal) {
    btnMenu.addEventListener("click", () => {
      const aberto = menuPrincipal.classList.toggle("ativo");
      btnMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
  }

  const btnTema = document.querySelector("#btn-tema");
  if (btnTema) {
    btnTema.addEventListener("click", () => {
      const escuro = document.body.classList.toggle("escuro");
      btnTema.setAttribute("aria-pressed", escuro ? "true" : "false");
      btnTema.textContent = escuro ? "Modo Claro" : "Modo Escuro";
    });
  }

  const btnBio = document.querySelector("#btn-expandir-bio");
  const bioExtra = document.querySelector("#bio-extra");
  if (btnBio && bioExtra) {
    btnBio.addEventListener("click", () => {
      const visivel = bioExtra.hasAttribute("hidden");
      if (visivel) {
        bioExtra.removeAttribute("hidden");
        btnBio.setAttribute("aria-expanded", "true");
        btnBio.textContent = "Recolher trajetória";
      } else {
        bioExtra.setAttribute("hidden", "");
        btnBio.setAttribute("aria-expanded", "false");
        btnBio.textContent = "Saber mais sobre minha trajetória";
      }
    });
  }

  const botoesFiltro = document.querySelectorAll(".btn-filtro");
  const cardsProjetos = document.querySelectorAll("#lista-projetos .card");
  const contadorProjetos = document.querySelector("#contador-projetos");
  const msgBuscaVazia = document.querySelector("#mensagem-busca-vazia");

  function filtrarProjetos(categoria) {
    let visiveis = 0;

    cardsProjetos.forEach(card => {
      const catCard = card.getAttribute("data-categoria");
      if (categoria === "todos" || catCard === categoria) {
        card.classList.remove("oculto");
        visiveis++;
      } else {
        card.classList.add("oculto");
      }
    });

    botoesFiltro.forEach(btn => {
      const ativo = btn.getAttribute("data-categoria") === categoria;
      btn.classList.toggle("ativo", ativo);
      btn.setAttribute("aria-pressed", ativo ? "true" : "false");
    });

    if (contadorProjetos) {
      contadorProjetos.textContent = `Exibindo ${visiveis} projeto(s).`;
    }

    if (msgBuscaVazia) {
      if (visiveis === 0) {
        msgBuscaVazia.classList.remove("oculto");
      } else {
        msgBuscaVazia.classList.add("oculto");
      }
    }
  }

  botoesFiltro.forEach(btn => {
    btn.addEventListener("click", () => {
      filtrarProjetos(btn.getAttribute("data-categoria"));
    });
  });

  const form = document.querySelector("#form-contato");
  const campoNome = document.querySelector("#campo-nome");
  const campoEmail = document.querySelector("#campo-email");
  const campoMotivo = document.querySelector("#campo-motivo");
  const containerAssunto = document.querySelector("#container-assunto");
  const campoAssunto = document.querySelector("#campo-assunto");
  const campoMensagem = document.querySelector("#campo-mensagem");
  const contadorMensagem = document.querySelector("#contador-mensagem");
  const resumoErros = document.querySelector("#resumo-erros");
  const statusEnvio = document.querySelector("#status-envio");
  const btnEnviar = document.querySelector("#btn-enviar");
  const seletorSimulacao = document.querySelector("#seletor-simulacao");

  function atualizarContadorMensagem() {
    const qtd = campoMensagem.value.length;
    contadorMensagem.textContent = `${qtd} / 1000 caracteres (mínimo de 30)`;
  }

  if (campoMensagem) {
    campoMensagem.addEventListener("input", atualizarContadorMensagem);
  }

  if (campoMotivo) {
    campoMotivo.addEventListener("change", () => {
      if (campoMotivo.value === "outro") {
        containerAssunto.classList.remove("oculto");
        campoAssunto.setAttribute("required", "");
      } else {
        containerAssunto.classList.add("oculto");
        campoAssunto.removeAttribute("required");
        campoAssunto.value = "";
        limparErroCampo(campoAssunto, document.querySelector("#erro-assunto"));
      }
    });
  }

  function definirErroCampo(campo, elErro, mensagem) {
    campo.setAttribute("aria-invalid", "true");
    if (elErro) elErro.textContent = mensagem;
  }

  function limparErroCampo(campo, elErro) {
    campo.removeAttribute("aria-invalid");
    if (elErro) elErro.textContent = "";
  }

  function validarFormulario() {
    let valido = true;
    const erros = [];

    const valNome = campoNome.value.trim();
    const elErroNome = document.querySelector("#erro-nome");
    if (!valNome) {
      definirErroCampo(campoNome, elErroNome, "O nome é obrigatório.");
      erros.push("Nome é obrigatório.");
      valido = false;
    } else if (valNome.length < 3 || valNome.length > 80) {
      definirErroCampo(campoNome, elErroNome, "O nome deve ter entre 3 e 80 caracteres.");
      erros.push("Nome deve ter entre 3 e 80 caracteres.");
      valido = false;
    } else {
      limparErroCampo(campoNome, elErroNome);
    }

    const valEmail = campoEmail.value.trim();
    const elErroEmail = document.querySelector("#erro-email");
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!valEmail) {
      definirErroCampo(campoEmail, elErroEmail, "O e-mail é obrigatório.");
      erros.push("E-mail é obrigatório.");
      valido = false;
    } else if (!regexEmail.test(valEmail)) {
      definirErroCampo(campoEmail, elErroEmail, "Informe um endereço de e-mail válido.");
      erros.push("E-mail em formato inválido.");
      valido = false;
    } else {
      limparErroCampo(campoEmail, elErroEmail);
    }

    const elErroMotivo = document.querySelector("#erro-motivo");
    if (!campoMotivo.value) {
      definirErroCampo(campoMotivo, elErroMotivo, "Selecione um motivo.");
      erros.push("Motivo do contato é obrigatório.");
      valido = false;
    } else {
      limparErroCampo(campoMotivo, elErroMotivo);
    }

    if (campoMotivo.value === "outro") {
      const valAssunto = campoAssunto.value.trim();
      const elErroAssunto = document.querySelector("#erro-assunto");
      if (!valAssunto) {
        definirErroCampo(campoAssunto, elErroAssunto, "O assunto adicional é obrigatório.");
        erros.push("Assunto adicional é obrigatório.");
        valido = false;
      } else if (valAssunto.length < 5 || valAssunto.length > 100) {
        definirErroCampo(campoAssunto, elErroAssunto, "O assunto deve ter entre 5 e 100 caracteres.");
        erros.push("Assunto adicional deve ter entre 5 e 100 caracteres.");
        valido = false;
      } else {
        limparErroCampo(campoAssunto, elErroAssunto);
      }
    }

    const valMensagem = campoMensagem.value.trim();
    const elErroMensagem = document.querySelector("#erro-mensagem");
    if (!valMensagem) {
      definirErroCampo(campoMensagem, elErroMensagem, "A mensagem é obrigatória.");
      erros.push("Mensagem é obrigatória.");
      valido = false;
    } else if (valMensagem.length < 30 || valMensagem.length > 1000) {
      definirErroCampo(campoMensagem, elErroMensagem, "A mensagem deve ter entre 30 e 1000 caracteres.");
      erros.push("Mensagem deve ter entre 30 e 1000 caracteres.");
      valido = false;
    } else {
      limparErroCampo(campoMensagem, elErroMensagem);
    }

    if (!valido) {
      resumoErros.classList.remove("oculto");
      resumoErros.innerHTML = "<strong>Existem erros no formulário:</strong><ul>" + erros.map(e => `<li>${e}</li>`).join("") + "</ul>";
      resumoErros.focus();
    } else {
      resumoErros.classList.add("oculto");
      resumoErros.innerHTML = "";
    }

    return valido;
  }

  function simularEnvioAssincrono(sucesso) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (sucesso) {
          resolve("Mensagem enviada com sucesso! (Demonstração simulada)");
        } else {
          reject(new Error("Falha na conexão com o servidor. Tente novamente."));
        }
      }, 1500);
    });
  }

  if (form) {
    form.addEventListener("submit", async (evt) => {
      evt.preventDefault();

      if (!validarFormulario()) return;

      btnEnviar.disabled = true;
      btnEnviar.textContent = "Enviando...";
      statusEnvio.className = "status-envio";
      statusEnvio.textContent = "Processando envio...";

      const modoSucesso = seletorSimulacao.value === "sucesso";

      try {
        const resposta = await simularEnvioAssincrono(modoSucesso);
        statusEnvio.className = "status-envio sucesso";
        statusEnvio.textContent = resposta;
        form.reset();
        atualizarContadorMensagem();
        containerAssunto.classList.add("oculto");
      } catch (erro) {
        statusEnvio.className = "status-envio erro";
        statusEnvio.textContent = erro.message;
      } finally {
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Enviar mensagem";
      }
    });
  }
});