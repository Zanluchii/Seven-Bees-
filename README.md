# Seven Bees English School — Site

Site institucional + loja de matrículas da **Seven Bees English School** (Londrina/PR).
HTML, CSS e JavaScript puros. Não precisa instalar nada: basta abrir o `index.html`
no navegador ou publicar a pasta em qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, Hostinger…).

## Estrutura
```
index.html        página única com todas as seções
css/style.css     estilos (cores da marca em :root)
js/main.js        interações + CONFIG (preços, cursos, WhatsApp, unidades)
assets/           favicon
assets/videos/    vídeos (.mp4) e capas (.jpg)
```

## Recursos interativos
- Chat animado em inglês no topo (simula uma aula de conversação)
- Comparativo interativo **Turma tradicional × Turma Seven Bees**
- **Teste de nível** (quiz) que recomenda o curso ideal e adiciona ao carrinho
- **Loja de cursos** com filtro (Kids/Teens/Adultos/Empresas), escolha de modalidade e carrinho
- Promoção da 1ª mensalidade (R$ 34,90 no Plano Grupo) aplicada automaticamente
- **Checkout em 3 etapas**: dados do aluno → pagamento → confirmação (envia o pedido no WhatsApp)
- Formulário de **aula demonstrativa grátis** (envia para o WhatsApp)
- Unidades com mapa e botão "Como chegar"
- Cards "Bee Curious" (expressões e curiosidades) que viram ao toque
- Calculadora "Quanto custa não falar inglês?" (Empresas)
- **Abelhas voando** pelas seções (fogem do cursor) e **abelha guia "Bee"** com dicas por seção
- **Depoimentos** em carrossel (aparece quando houver depoimentos em `CONFIG.testimonials`)
- **Vídeos**: "Medo da primeira aula?" (dicas) e depoimentos em vídeo da professora Tália e do aluno Paulo (`assets/videos/`)
- FAQ, botão flutuante de WhatsApp, menu mobile, animações

## Como editar
Tudo que muda com frequência fica no objeto `CONFIG` no início de `js/main.js`:
- `whatsapp`: número que recebe pedidos e agendamentos
- `promoFirstMonth`: valor promocional da 1ª mensalidade do Plano Grupo
- `courses`: nome, descrição e preços (`price.grupo` / `price.vip`). Use `null` para "Sob consulta".
- `testimonials`: depoimentos (nome, papel, texto e foto opcional)
- `units`: endereços usados no mapa

As abelhas voando são controladas pelo atributo `data-bees="N"` nas seções do `index.html` (N = quantidade).

## Pagamento online
Hoje a matrícula é registrada e enviada para o WhatsApp da escola, que confirma turma e envia a cobrança.
Para cobrar automaticamente (Pix/cartão), dá para integrar Mercado Pago, PagSeguro, Asaas ou Stripe
no envio do formulário de checkout (`cform.addEventListener("submit", …)` em `js/main.js`).
