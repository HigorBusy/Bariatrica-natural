# Protocolo Bariatrica Natural - 21 Dias

Funil/quiz mobile-first para captura de leads com resultado personalizado e envio para Supabase.

## Aviso de seguranca

Este produto nao e cirurgia bariatrica, nao e tratamento medico e nao substitui medico, nutricionista, psicologo ou qualquer profissional de saude. O conteudo usa linguagem educativa sobre rotina, saciedade, controle de beliscos, organizacao alimentar e habitos progressivos.

## Configuracao

1. Instale dependencias:

```bash
npm install
```

2. Crie `.env.local` a partir de `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

3. Rode o SQL em `supabase/schema.sql` no SQL Editor do Supabase.

4. Inicie localmente:

```bash
npm run dev
```

5. Teste o funil completo em `http://localhost:3000`, incluindo uma URL com UTMs:

```text
http://localhost:3000?utm_source=teste&utm_medium=local&utm_campaign=mvp
```

## Deploy Vercel

1. Suba este projeto para o GitHub.
2. Importe o repositorio na Vercel.
3. Configure as variaveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Rode o primeiro deploy.
5. Envie um lead de teste e confirme registros nas tabelas `leads` e `quiz_answers`.
