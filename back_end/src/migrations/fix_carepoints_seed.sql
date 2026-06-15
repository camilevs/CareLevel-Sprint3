-- Migration: corrige seed de carepoints/conquistas que ficou presa ao primeiro
-- admin criado (id=1) em vez do usuário de teste, e preenche carepoints_config /
-- app_conquistas para os beneficiários que não receberam linha própria.
-- Executar uma vez no banco fiapcarelevel.

-- 1. Reatribui ao usuário de teste o histórico/conquistas/config que foi
--    seedado contra o admin (id=1) por engano.
UPDATE historico_carepoints SET user_id = (SELECT id FROM users WHERE email = 'user@carelevel.com.br')
WHERE user_id = (SELECT id FROM users WHERE email = 'admin@carelevel.com');

UPDATE app_conquistas SET user_id = (SELECT id FROM users WHERE email = 'user@carelevel.com.br')
WHERE user_id = (SELECT id FROM users WHERE email = 'admin@carelevel.com');

UPDATE carepoints_config SET user_id = (SELECT id FROM users WHERE email = 'user@carelevel.com.br')
WHERE user_id = (SELECT id FROM users WHERE email = 'admin@carelevel.com');

-- 2. Backfill de carepoints_config para beneficiários sem linha própria
--    (gera uma curva de 4 meses até o saldo atual de cada um).
INSERT INTO carepoints_config (user_id, analise)
SELECT p.user_id,
  jsonb_build_array(
    jsonb_build_object('mes', 'Jan', 'valor', round(p.carepoints * 0.22)::int, 'destaque', false),
    jsonb_build_object('mes', 'Fev', 'valor', round(p.carepoints * 0.46)::int, 'destaque', false),
    jsonb_build_object('mes', 'Mar', 'valor', round(p.carepoints * 0.68)::int, 'destaque', false),
    jsonb_build_object('mes', 'Abr', 'valor', p.carepoints, 'destaque', true)
  )
FROM app_profiles p
WHERE NOT EXISTS (SELECT 1 FROM carepoints_config c WHERE c.user_id = p.user_id);

-- 3. Backfill de app_conquistas para beneficiários sem linha própria
--    (reaproveita o conjunto padrão de emblemas/medalhas já existente).
INSERT INTO app_conquistas (user_id, destaque_atual, emblemas, medalhas, detalhes, opcoes_destaque)
SELECT p.user_id, base.destaque_atual, base.emblemas, base.medalhas, base.detalhes, base.opcoes_destaque
FROM app_profiles p
CROSS JOIN (SELECT destaque_atual, emblemas, medalhas, detalhes, opcoes_destaque FROM app_conquistas LIMIT 1) base
WHERE NOT EXISTS (SELECT 1 FROM app_conquistas a WHERE a.user_id = p.user_id);
