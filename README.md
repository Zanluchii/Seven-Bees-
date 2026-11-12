# Seven Bees English School — Site

Site institucional + pré-matrícula da **Seven Bees English School** (Londrina/PR).
HTML, CSS e JavaScript puros. Não precisa instalar nada: basta abrir o `index.html`
no navegador ou publicar a pasta em qualquer hospedagem estática (Cloudflare Pages, Netlify…).

## Estrutura
```
index.html         página única com todas as seções
privacidade.html   Política de Privacidade (LGPD)
condicoes.html     condições da pré-matrícula + regulamento da promoção de 40%
css/style.css      estilos (cores da marca em :root)
js/main.js         interações + CONFIG (WhatsApp, promoção, cursos, unidades, rodapé)
assets/            favicon, ícone do celular e imagem de compartilhamento (og-image.jpg)
assets/videos/     vídeos (.mp4), capas (.jpg) e legendas (.vtt)
robots.txt, sitemap.xml
```

## Recursos
- Chat animado em inglês no topo e comparativo **Turma tradicional × Turma Seven Bees**
- **Teste de nível** que recomenda o curso (o resultado vai junto na mensagem do WhatsApp)
- **Cursos sem preço** (pedido da escola), com Plano Grupo / VIP Individual e o selo **40% OFF no Plano Grupo**
- Lista **“Meus cursos de interesse”**, com quantidade de alunos (para irmãos)
- **Pré-matrícula em 2 etapas** (dados → preferências) que abre o WhatsApp com tudo pronto. Responsável obrigatório em Kids e Teens. Nada é cobrado pelo site.
- Formulário de **aula grátis** (também pelo WhatsApp)
- Unidades com mapa, “Como chegar” e horário
- Bee Curious, calculadora de Empresas, FAQ, botão flutuante de WhatsApp
- Abelhas voando (menos no celular) e **abelha guia**: um “Oi” na primeira visita, dicas só ao toque
- Vídeos com capa e **legendas em português**
- SEO: og:image, canonical, dados da escola e das 2 unidades para o Google (schema.org), robots e sitemap

## Como editar
Quase tudo fica no objeto `CONFIG`, no início de `js/main.js`:
- `whatsapp` / `whatsappLabel`: número que recebe pré-matrículas e agendamentos
- `instagram`
- `promo`: texto curto da promoção e a mensagem do botão “Quero meu desconto”
- `courses`: cursos (`minor: true` pede o responsável; `quoteOnly: true` vira “Solicitar proposta”)
- `testimonials`: depoimentos escritos (a seção aparece quando houver pelo menos 1)
- `units`: endereço, CEP e **horário** de cada unidade
- `email`: e-mail de contato
- `company`: razão social e CNPJ do rodapé

**Única cópia fora do CONFIG:** o bloco `application/ld+json` no `<head>` do `index.html`
(telefone e endereços que o Google lê). Se mudar telefone ou endereço, mude lá também.

As abelhas voando são controladas pelo atributo `data-bees="N"` nas seções do `index.html`.

## Antes de publicar (checklist)
1. O domínio já está como `www.7bees.com.br` (canonical, og:url, schema, robots e sitemap).
2. Procurar e resolver todos os `[CONFIRMAR]` (no site eles aparecem com fundo amarelo tracejado):
   regra dos 40%, CEP do Iate Clube, WhatsApp/Instagram, prazo de guarda dos dados, datas das páginas legais.
3. Pedir para alguém da escola ouvir os vídeos com legenda ligada (ver `D:\SevenBees\material\LEIA-ME.md`).
4. Publicar na conta da escola (não na conta pessoal do desenvolvedor).

## Pagamento online
O site não cobra nada: a pré-matrícula vai para o WhatsApp e a escola confirma turma, horário e valores.
Cobrança automática (Pix/cartão) é um serviço à parte.
