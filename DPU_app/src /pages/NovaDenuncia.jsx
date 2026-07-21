import DenunciaForm from '@/components/denuncias/DenunciaForm';
import { Plus, MapPin } from 'lucide-react';

export default function NovaDenuncia() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-[#205ac6] bg-blue-50 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <Plus className="w-3.5 h-3.5" /> Nova Denúncia
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registrar Problema Urbano</h1>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> Bairro Mangabeira Cidade Verde
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <DenunciaForm />
      </div>
    </div>
  );
}
