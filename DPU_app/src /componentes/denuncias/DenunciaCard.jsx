import { cn } from '@/lib/utils';

const config = {
  'Aberta': { label: 'Aberta', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  'Em análise': { label: 'Em análise', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  'Resolvida': { label: 'Resolvida', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

const prioridadeConfig = {
  'Baixa': 'bg-slate-100 text-slate-600',
  'Média': 'bg-orange-100 text-orange-700',
  'Alta': 'bg-rose-100 text-rose-700',
};

export default function DenunciaCard({ denuncia }) {
  const status = config[denuncia.status] || config['Aberta'];
  const prio = prioridadeConfig[denuncia.prioridade] || prioridadeConfig['Média'];

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300">
      {denuncia.foto_url && (
        <div className="aspect-[16/9] overflow-hidden bg-slate-100">
          <img
            src={denuncia.foto_url}
            alt={denuncia.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#205ac6] bg-blue-50 px-2 py-0.5 rounded-md">
            {denuncia.categoria}
          </span>
          <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-md', prio)}>
            {denuncia.prioridade}
          </span>
        </div>
        <h3 className="font-semibold text-slate-900 leading-snug mb-1.5 line-clamp-2">{denuncia.titulo}</h3>
        {denuncia.descricao && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{denuncia.descricao}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 truncate">
            📍 {denuncia.endereco || 'Mangabeira Cidade Verde'}
          </span>
          <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full border', status.className)}>
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}
