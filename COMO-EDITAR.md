# Como editar a página Natural Eyes

A página fica no ar em https://natural-eyes-revisao.vercel.app.
Toda alteração salva neste repositório (branch `main`) é publicada sozinha em cerca de 1 minuto.

## Como editar pelo navegador

1. Abra o arquivo que quer mudar (lista abaixo).
2. Clique no ícone de lápis ("Edit this file"), no canto superior direito.
3. Faça a alteração.
4. Clique em **Commit changes…** e confirme.
5. Espere cerca de 1 minuto e recarregue a página no ar.

Se algo der errado, é possível voltar à versão anterior pelo histórico do arquivo ("History").

## Arquivos

| Arquivo | O que tem |
|---|---|
| `index.html` | **A página oficial**: todos os textos e botões. |
| `script.js` | O link de pagamento (checkout) usado pelos botões de compra. |
| `styles.css` | Cores, tamanhos e espaçamentos. |
| `versao-a/index.html` | Versão antiga, só para consulta. Não está no endereço principal. |
| `versao-b/index.html` | Só redireciona para a página oficial. Não editar. |
| `assets/` | Fotos, vídeos e logo. |

## Link de pagamento (checkout)

No começo do arquivo `script.js`, troque o conteúdo entre aspas:

```js
checkoutUrl: "",
```

por exemplo:

```js
checkoutUrl: "https://pay.hotmart.com/SEU-CODIGO",
```

Com o link preenchido, os botões de compra ("Garantir minha vaga" na seção de preço e "Quero dominar a região da olheira" no final) passam a levar direto ao checkout.
Os outros botões continuam levando à seção de preço da própria página.

## Botões (em `index.html`)

Cada botão é uma linha parecida com esta:

```html
<a href="#investimento" class="btn btn--primario">Quero preencher olho com segurança</a>
```

- **Texto do botão:** é o que fica entre `>` e `</a>`. Mude só essa parte.
- **Destino:** é o `href="..."`.
  - `#investimento` leva à seção de preço da própria página.
  - Para levar a outro lugar, coloque o endereço completo, por exemplo `href="https://..."`.
- **Botões de compra:** são os que têm `data-checkout`. O destino deles vem do `checkoutUrl` do `script.js`.

Use Ctrl+F (ou Cmd+F) no editor e busque pelo texto do botão para encontrá-lo.

## Cuidados

- Não apague os sinais `<`, `>`, `"` nem as palavras `class="..."`. Mude só o texto visível ou o link.
- Para mudar cores ou o visual dos botões (`.btn--primario`, `.btn--claro` no `styles.css`), fale com quem desenvolveu a página.
