-- Migration: cria tabela de progresso de missões por usuário
-- Executar uma vez no banco fiapcarelevel
-- Pré-requisito: tabelas 'users' e 'missoes' já existem

CREATE TABLE IF NOT EXISTS missao_progresso (
  id           SERIAL    PRIMARY KEY,
  user_id      INT       NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  missao_id    INT       NOT NULL REFERENCES missoes(id) ON DELETE CASCADE,
  item_id      INT       NOT NULL,
  concluida_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, missao_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_missao_progresso_user ON missao_progresso (user_id);
