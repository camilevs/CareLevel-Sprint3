import { useState } from "react";

export default function AlterarDestaqueModal({ atual, opcoes = [], onClose, onSave }) {
  const [selecionado, setSelecionado] = useState(atual || "Sem Título");

  function handleSave() {
    onSave(selecionado);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 box-border backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] p-6 sm:p-7 w-full max-w-[480px] box-border animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[var(--text-primary)] font-bold text-base mb-4">Alterar destaque</h2>

        <div className="grid gap-3.5">
          {opcoes.map(({ grupo, itens }) => (
            <div key={grupo ?? "sem-grupo"}>
              {grupo && (
                <p className="text-[var(--text-muted)] text-xs font-bold mb-1.5 pl-1 uppercase tracking-[0.05em]">{grupo}</p>
              )}
              <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,max-content))] gap-2">
                {(itens ?? []).map((item) => {
                  const ativo = selecionado === item;
                  return (
                    <button
                      key={item}
                      onClick={() => setSelecionado(item)}
                      className={[
                        'flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold',
                        'border cursor-pointer font-inherit',
                        'transition-[border-color,background,color] duration-200',
                        ativo
                          ? 'bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent)] shadow-[0_0_0_2px_var(--accent-glow)]'
                          : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'w-2 h-2 rounded-full flex-shrink-0',
                          ativo ? 'bg-[var(--accent)]' : 'bg-[var(--border)]',
                        ].join(' ')}
                      />
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-5 max-[400px]:flex-col-reverse max-[400px]:mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-[var(--radius-sm)] text-xs font-semibold border border-[var(--border)] cursor-pointer bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-inherit transition-colors duration-200 hover:bg-[var(--bg-tertiary)] max-[400px]:w-full max-[400px]:py-2.5 max-[400px]:text-center"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold border-none cursor-pointer bg-[var(--accent)] text-white font-inherit shadow-[0_4px_12px_var(--accent-glow)] transition-[background,transform] duration-150 hover:bg-[var(--accent-hover)] hover:-translate-y-px max-[400px]:w-full max-[400px]:py-2.5 max-[400px]:text-center"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
