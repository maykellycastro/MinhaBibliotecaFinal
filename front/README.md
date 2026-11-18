# Front-end da Minha Biblioteca

Esta pasta contém a página web usada para acessar a API da biblioteca.

## Como abrir

1. Inicie a API na pasta do projeto com `dotnet run`.
2. Confira no terminal qual endereço HTTP a API está usando.
3. Abra `script.js` e confira a constante `API_URL`. Ela deve terminar em `/api/Materiais` e usar o mesmo endereço e a mesma porta da API.
4. Abra `index.html` com o Live Server do VS Code.

## Arquivos

- `index.html`: estrutura da página e formulários.
- `style.css`: ajustes visuais e responsividade.
- `script.js`: comunicação com a API usando `fetch`, eventos, validações e atualização da tela.

## Recursos da página

- Listagem e filtro de materiais.
- Consulta de material por ID, descrição e prazo de empréstimo.
- Cadastro e edição de livros e revistas.
- Exclusão com confirmação.
- Tentativa de empréstimo para verificar a resposta da API.
- Mensagens de sucesso e erro.

A interface utiliza Bootstrap 5.3.3, incluindo grid responsivo, navbar, cards, tabelas, formulários, botões e alertas.
