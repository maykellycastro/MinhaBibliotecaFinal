# Minha Biblioteca

Projeto de Web API em C# com ASP.NET Core e uma interface web para administrar livros e revistas.

## Integrantes

Preencham com os nomes de todos os integrantes da equipe:
- Nome do integrante 1
- Nome do integrante 2
- Nome do integrante 3
- Nome do integrante 4

## O que foi desenvolvido

A API trabalha com dois tipos de material: livro e revista. O projeto permite listar, consultar, cadastrar, atualizar e excluir materiais. Também possui consulta da descrição e do prazo de empréstimo, além de uma tentativa de empréstimo.

O livro permite empréstimo por 14 dias. A revista possui prazo calculado de 7 dias, mas não implementa a operação de empréstimo.

## Como executar a API

É necessário ter o SDK do .NET 10 instalado.

1. Abra o terminal na pasta `MinhaBiblioteca`, onde está o arquivo `MinhaBiblioteca.csproj`.
2. Execute:

   ```bash
   dotnet restore
   dotnet run
   ```

3. O terminal mostrará o endereço em que a API iniciou. Para abrir o Swagger, acrescente `/swagger` ao endereço.

## Como executar o front-end

1. Com a API em execução, abra a pasta `front` no VS Code.
2. No arquivo `front/script.js`, confira a constante `API_URL` e ajuste endereço e porta para os mesmos valores apresentados pelo terminal da API. O endereço deve terminar em `/api/Materiais`.
3. Abra `front/index.html` com a extensão Live Server.

## Endpoints utilizados

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/Materiais` | Lista os materiais |
| GET | `/api/Materiais/{id}` | Consulta um material pelo ID |
| POST | `/api/Materiais/livro` | Cadastra um livro |
| POST | `/api/Materiais/revista` | Cadastra uma revista |
| PUT | `/api/Materiais/livro/{id}` | Atualiza um livro |
| PUT | `/api/Materiais/revista/{id}` | Atualiza uma revista |
| DELETE | `/api/Materiais/{id}` | Exclui um material |
| GET | `/api/Materiais/{id}/descricao` | Consulta descrição e prazo |
| POST | `/api/Materiais/{id}/emprestar` | Tenta realizar o empréstimo |

## Organização do front-end

A pasta `front` possui três arquivos. O `index.html` contém a estrutura e os formulários, o `style.css` contém os ajustes visuais e o `script.js` concentra as funções de comunicação com a API e atualização da página.

## Bootstrap

Foram utilizados o grid responsivo (`container`, `row` e `col`), cards, navbar, tabela responsiva, formulários, botões, badges e alertas.

## Validações e mensagens

Os formulários verificam campos obrigatórios e limites numéricos, como páginas, edição e mês de publicação. A API também valida os dados. A interface verifica o resultado das requisições e apresenta mensagens de sucesso ou erro. A exclusão pede confirmação antes de enviar o DELETE.

## Testes para realizar antes da entrega

A equipe deve executar e conferir no navegador e no Swagger:

- listar os materiais iniciais;
- consultar um ID existente e um ID inexistente;
- cadastrar livro e revista;
- tentar cadastrar dados inválidos;
- editar os dois tipos de material;
- excluir um material e testar novamente o ID excluído;
- consultar descrição e prazo de um livro e de uma revista;
- tentar emprestar um livro e uma revista;
- conferir a interface em tela pequena e grande.

Registrem aqui os testes que vocês realmente executaram e os resultados observados.

## Dificuldades e aprendizados da equipe

Preencham esta parte com as dificuldades que aconteceram durante o desenvolvimento, como foram resolvidas e o que cada integrante aprendeu. O texto deve corresponder ao trabalho realizado pela equipe.

## Observação

Os materiais são armazenados em memória. Por isso, os dados cadastrados são reiniciados quando a API é encerrada.
