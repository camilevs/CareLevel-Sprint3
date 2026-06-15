-- =============================================================
-- SEED: Beneficiários, Perfis e Dados do Dashboard Admin
-- =============================================================

-- -------------------------------------------------------------
-- 1. USUÁRIOS BENEFICIÁRIOS
-- -------------------------------------------------------------
INSERT INTO users (name, email, password, role) VALUES
  ('Lina Monteiro',       'lina.monteiro@carelevel.com',       '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Maicon Kepler',       'maicon.kepler@carelevel.com',       '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Lana Jardim',         'lana.jardim@carelevel.com',         '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Arthur Costa',        'arthur.costa@carelevel.com',        '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Giovanna Bezerra',    'giovanna.bezerra@carelevel.com',    '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Eduarda Costa',       'eduarda.costa@carelevel.com',       '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Deyverson Sanches',   'deyverson.sanches@carelevel.com',   '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Felipe Duarte',       'felipe.duarte@carelevel.com',       '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Carla Nunes',         'carla.nunes@carelevel.com',         '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Rafael Oliveira',     'rafael.oliveira@carelevel.com',     '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Juliana Prado',       'juliana.prado@carelevel.com',       '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Carlos Andrade',      'carlos.andrade@carelevel.com',      '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Beatriz Souza',       'beatriz.souza@carelevel.com',       '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Thiago Mendes',       'thiago.mendes@carelevel.com',       '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Isabela Ramos',       'isabela.ramos@carelevel.com',       '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Lucas Henrique',      'lucas.henrique@carelevel.com',      '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Amanda Ferreira',     'amanda.ferreira@carelevel.com',     '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Pedro Almeida',       'pedro.almeida@carelevel.com',       '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Fernanda Lima',       'fernanda.lima@carelevel.com',       '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user'),
  ('Rodrigo Castro',      'rodrigo.castro@carelevel.com',      '$2b$10$3T..OFJ5jOwcvXpZQ24Ug.FvwLuwbcbx1J733WBKdMcPdUHuFFOOi', 'user')
ON CONFLICT (email) DO NOTHING;

-- -------------------------------------------------------------
-- 2. PERFIS (app_profiles) — um por usuário
-- Equipes disponíveis: eq_001 a eq_009
-- -------------------------------------------------------------
INSERT INTO app_profiles (user_id, nome, equipe_id, nivel, streak, carepoints, ranking_ativo, validade_points)
SELECT u.id, u.name,
  CASE u.email
    WHEN 'lina.monteiro@carelevel.com'     THEN 'eq_003'
    WHEN 'maicon.kepler@carelevel.com'     THEN 'eq_001'
    WHEN 'lana.jardim@carelevel.com'       THEN 'eq_002'
    WHEN 'arthur.costa@carelevel.com'      THEN 'eq_001'
    WHEN 'giovanna.bezerra@carelevel.com'  THEN 'eq_004'
    WHEN 'eduarda.costa@carelevel.com'     THEN 'eq_002'
    WHEN 'deyverson.sanches@carelevel.com' THEN 'eq_006'
    WHEN 'felipe.duarte@carelevel.com'     THEN 'eq_007'
    WHEN 'carla.nunes@carelevel.com'       THEN 'eq_008'
    WHEN 'rafael.oliveira@carelevel.com'   THEN 'eq_005'
    WHEN 'juliana.prado@carelevel.com'     THEN 'eq_004'
    WHEN 'carlos.andrade@carelevel.com'    THEN 'eq_003'
    WHEN 'beatriz.souza@carelevel.com'     THEN 'eq_002'
    WHEN 'thiago.mendes@carelevel.com'     THEN 'eq_001'
    WHEN 'isabela.ramos@carelevel.com'     THEN 'eq_005'
    WHEN 'lucas.henrique@carelevel.com'    THEN 'eq_009'
    WHEN 'amanda.ferreira@carelevel.com'   THEN 'eq_008'
    WHEN 'pedro.almeida@carelevel.com'     THEN 'eq_006'
    WHEN 'fernanda.lima@carelevel.com'     THEN 'eq_007'
    WHEN 'rodrigo.castro@carelevel.com'    THEN 'eq_009'
  END,
  CASE u.email
    WHEN 'lina.monteiro@carelevel.com'     THEN 40
    WHEN 'maicon.kepler@carelevel.com'     THEN 33
    WHEN 'lana.jardim@carelevel.com'       THEN 32
    WHEN 'arthur.costa@carelevel.com'      THEN 30
    WHEN 'giovanna.bezerra@carelevel.com'  THEN 27
    WHEN 'eduarda.costa@carelevel.com'     THEN 25
    WHEN 'deyverson.sanches@carelevel.com' THEN 20
    WHEN 'felipe.duarte@carelevel.com'     THEN 8
    WHEN 'carla.nunes@carelevel.com'       THEN 6
    WHEN 'rafael.oliveira@carelevel.com'   THEN 22
    WHEN 'juliana.prado@carelevel.com'     THEN 18
    WHEN 'carlos.andrade@carelevel.com'    THEN 15
    WHEN 'beatriz.souza@carelevel.com'     THEN 12
    WHEN 'thiago.mendes@carelevel.com'     THEN 29
    WHEN 'isabela.ramos@carelevel.com'     THEN 11
    WHEN 'lucas.henrique@carelevel.com'    THEN 10
    WHEN 'amanda.ferreira@carelevel.com'   THEN 7
    WHEN 'pedro.almeida@carelevel.com'     THEN 16
    WHEN 'fernanda.lima@carelevel.com'     THEN 9
    WHEN 'rodrigo.castro@carelevel.com'    THEN 14
  END,
  CASE u.email
    WHEN 'lina.monteiro@carelevel.com'     THEN 38
    WHEN 'maicon.kepler@carelevel.com'     THEN 35
    WHEN 'lana.jardim@carelevel.com'       THEN 29
    WHEN 'arthur.costa@carelevel.com'      THEN 28
    WHEN 'giovanna.bezerra@carelevel.com'  THEN 27
    WHEN 'eduarda.costa@carelevel.com'     THEN 26
    WHEN 'deyverson.sanches@carelevel.com' THEN 20
    WHEN 'felipe.duarte@carelevel.com'     THEN 18
    WHEN 'carla.nunes@carelevel.com'       THEN 14
    WHEN 'rafael.oliveira@carelevel.com'   THEN 30
    WHEN 'juliana.prado@carelevel.com'     THEN 22
    WHEN 'carlos.andrade@carelevel.com'    THEN 17
    WHEN 'beatriz.souza@carelevel.com'     THEN 12
    WHEN 'thiago.mendes@carelevel.com'     THEN 33
    WHEN 'isabela.ramos@carelevel.com'     THEN 9
    WHEN 'lucas.henrique@carelevel.com'    THEN 5
    WHEN 'amanda.ferreira@carelevel.com'   THEN 7
    WHEN 'pedro.almeida@carelevel.com'     THEN 16
    WHEN 'fernanda.lima@carelevel.com'     THEN 11
    WHEN 'rodrigo.castro@carelevel.com'    THEN 21
  END,
  CASE u.email
    WHEN 'lina.monteiro@carelevel.com'     THEN 18740
    WHEN 'maicon.kepler@carelevel.com'     THEN 15230
    WHEN 'lana.jardim@carelevel.com'       THEN 12580
    WHEN 'arthur.costa@carelevel.com'      THEN 10320
    WHEN 'giovanna.bezerra@carelevel.com'  THEN 8640
    WHEN 'eduarda.costa@carelevel.com'     THEN 7410
    WHEN 'deyverson.sanches@carelevel.com' THEN 6990
    WHEN 'felipe.duarte@carelevel.com'     THEN 890
    WHEN 'carla.nunes@carelevel.com'       THEN 620
    WHEN 'rafael.oliveira@carelevel.com'   THEN 9200
    WHEN 'juliana.prado@carelevel.com'     THEN 5800
    WHEN 'carlos.andrade@carelevel.com'    THEN 4350
    WHEN 'beatriz.souza@carelevel.com'     THEN 3120
    WHEN 'thiago.mendes@carelevel.com'     THEN 11900
    WHEN 'isabela.ramos@carelevel.com'     THEN 2780
    WHEN 'lucas.henrique@carelevel.com'    THEN 1490
    WHEN 'amanda.ferreira@carelevel.com'   THEN 740
    WHEN 'pedro.almeida@carelevel.com'     THEN 4900
    WHEN 'fernanda.lima@carelevel.com'     THEN 1870
    WHEN 'rodrigo.castro@carelevel.com'    THEN 3600
  END,
  TRUE,
  '01/2027'
FROM users u
WHERE u.email IN (
  'lina.monteiro@carelevel.com','maicon.kepler@carelevel.com','lana.jardim@carelevel.com',
  'arthur.costa@carelevel.com','giovanna.bezerra@carelevel.com','eduarda.costa@carelevel.com',
  'deyverson.sanches@carelevel.com','felipe.duarte@carelevel.com','carla.nunes@carelevel.com',
  'rafael.oliveira@carelevel.com','juliana.prado@carelevel.com','carlos.andrade@carelevel.com',
  'beatriz.souza@carelevel.com','thiago.mendes@carelevel.com','isabela.ramos@carelevel.com',
  'lucas.henrique@carelevel.com','amanda.ferreira@carelevel.com','pedro.almeida@carelevel.com',
  'fernanda.lima@carelevel.com','rodrigo.castro@carelevel.com'
)
ON CONFLICT (user_id) DO NOTHING;

-- Perfil do user existente (id=3)
INSERT INTO app_profiles (user_id, nome, equipe_id, nivel, streak, carepoints, ranking_ativo, validade_points)
SELECT id, name, 'eq_009', 10, 5, 1490, TRUE, '01/2027'
FROM users WHERE email = 'user@carelevel.com.br'
ON CONFLICT (user_id) DO NOTHING;

-- -------------------------------------------------------------
-- 3. HISTÓRICO DE CAREPOINTS para os novos usuários
-- -------------------------------------------------------------
INSERT INTO historico_carepoints (user_id, data, atividade, pontos, tipo)
SELECT u.id, '10/06/2026', 'MISSÃO SEMANAL: HIDRATAÇÃO COMPLETA', 35, 'credito'
FROM users u WHERE u.email = 'lina.monteiro@carelevel.com'
ON CONFLICT DO NOTHING;

INSERT INTO historico_carepoints (user_id, data, atividade, pontos, tipo)
SELECT u.id, '11/06/2026', 'MISSÃO DIÁRIA: BEBER 2L DE ÁGUA', 15, 'credito'
FROM users u WHERE u.email = 'lina.monteiro@carelevel.com'
ON CONFLICT DO NOTHING;

INSERT INTO historico_carepoints (user_id, data, atividade, pontos, tipo)
SELECT u.id, '09/06/2026', 'MISSÃO SEMANAL: MEDITAÇÃO DIÁRIA', 150, 'credito'
FROM users u WHERE u.email = 'maicon.kepler@carelevel.com'
ON CONFLICT DO NOTHING;

INSERT INTO historico_carepoints (user_id, data, atividade, pontos, tipo)
SELECT u.id, '08/06/2026', 'CONQUISTA: 7 DIAS SEGUIDOS DE ATIVIDADE', 500, 'badge'
FROM users u WHERE u.email = 'arthur.costa@carelevel.com'
ON CONFLICT DO NOTHING;

INSERT INTO historico_carepoints (user_id, data, atividade, pontos, tipo)
SELECT u.id, '07/06/2026', 'RESGATE: VALE-REFEIÇÃO', -400, 'debito'
FROM users u WHERE u.email = 'lana.jardim@carelevel.com'
ON CONFLICT DO NOTHING;

INSERT INTO historico_carepoints (user_id, data, atividade, pontos, tipo)
SELECT u.id, '10/06/2026', 'MISSÃO DIÁRIA: COMER 3 FRUTAS', 25, 'credito'
FROM users u WHERE u.email = 'thiago.mendes@carelevel.com'
ON CONFLICT DO NOTHING;

INSERT INTO historico_carepoints (user_id, data, atividade, pontos, tipo)
SELECT u.id, '11/06/2026', 'MISSÃO DIÁRIA: ANDAR 2KM', 20, 'credito'
FROM users u WHERE u.email = 'rafael.oliveira@carelevel.com'
ON CONFLICT DO NOTHING;

INSERT INTO historico_carepoints (user_id, data, atividade, pontos, tipo)
SELECT u.id, '12/06/2026', 'MISSÃO SEMANAL: ALIMENTAÇÃO SAUDÁVEL', 300, 'credito'
FROM users u WHERE u.email = 'beatriz.souza@carelevel.com'
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------
-- 4. ADMIN_DADOS — atualizar com nomes de equipes reais do banco
-- Os rótulos de engTeam e perfDept passam a usar nomes reais
-- (totalAtivos será computado dinamicamente pelo backend)
-- -------------------------------------------------------------
UPDATE admin_dados SET
  eng_team = '[
    {"nome": "Produção",          "engajamento": 82},
    {"nome": "Logística",         "engajamento": 78},
    {"nome": "Recursos Humanos",  "engajamento": 76},
    {"nome": "Vendas",            "engajamento": 75},
    {"nome": "Financeiro",        "engajamento": 65},
    {"nome": "Atendimento",       "engajamento": 70},
    {"nome": "Marketing",         "engajamento": 88},
    {"nome": "Jurídico",          "engajamento": 60},
    {"nome": "TI",                "engajamento": 72}
  ]'::jsonb,
  eng_mensal = '[
    {"mes": "Jan", "Logística": 75, "Recursos Humanos": 72, "Produção": 70, "Vendas": 69, "Financeiro": 70, "TI": 75},
    {"mes": "Fev", "Logística": 73, "Recursos Humanos": 74, "Produção": 72, "Vendas": 71, "Financeiro": 72, "TI": 73},
    {"mes": "Mar", "Logística": 76, "Recursos Humanos": 76, "Produção": 74, "Vendas": 73, "Financeiro": 74, "TI": 76},
    {"mes": "Abr", "Logística": 77, "Recursos Humanos": 75, "Produção": 73, "Vendas": 72, "Financeiro": 73, "TI": 77},
    {"mes": "Mai", "Logística": 79, "Recursos Humanos": 78, "Produção": 75, "Vendas": 75, "Financeiro": 75, "TI": 79},
    {"mes": "Jun", "Logística": 81, "Recursos Humanos": 80, "Produção": 76, "Vendas": 80, "Financeiro": 77, "TI": 81}
  ]'::jsonb,
  perf_dept = '[
    {"dept": "Logística",         "val": 45},
    {"dept": "Recursos Humanos",  "val": 28},
    {"dept": "Produção",          "val": 52},
    {"dept": "Vendas",            "val": 72},
    {"dept": "Financeiro",        "val": 52},
    {"dept": "Atendimento",       "val": 40},
    {"dept": "Marketing",         "val": 38},
    {"dept": "Jurídico",          "val": 30},
    {"dept": "TI",                "val": 45}
  ]'::jsonb,
  stress_dept = '[
    {"dept": "Logística",         "val": 55},
    {"dept": "Recursos Humanos",  "val": 50},
    {"dept": "Produção",          "val": 60},
    {"dept": "Vendas",            "val": 70},
    {"dept": "Financeiro",        "val": 45},
    {"dept": "Atendimento",       "val": 65},
    {"dept": "Marketing",         "val": 20},
    {"dept": "Jurídico",          "val": 35},
    {"dept": "TI",                "val": 72}
  ]'::jsonb,
  radar = '[
    {"dim": "Produtividade",  "Logística": 80, "Recursos Humanos": 60, "TI": 70},
    {"dim": "Colaboração",    "Logística": 70, "Recursos Humanos": 75, "TI": 65},
    {"dim": "Inovação",       "Logística": 55, "Recursos Humanos": 50, "TI": 80},
    {"dim": "Satisfação",     "Logística": 65, "Recursos Humanos": 70, "TI": 60},
    {"dim": "Qualidade",      "Logística": 75, "Recursos Humanos": 65, "TI": 72},
    {"dim": "Comunicação",    "Logística": 60, "Recursos Humanos": 80, "TI": 55}
  ]'::jsonb,
  stats = jsonb_set(stats, '{estresseGlobal}', '58')
WHERE id = 1;
