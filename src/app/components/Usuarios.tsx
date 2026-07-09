import { Users, Plus, Edit2, Trash2, Shield, Mail, Building2 } from "lucide-react";
import { useState } from "react";
import { useFleet } from "../context/FleetContext";
import { Card, Button, Badge, Input } from "./ui";

export default function Usuarios() {
  const { usuarios, deleteUser } = useFleet();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const filtered = usuarios.filter((u) => {
    const matchSearch = u.nome.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "administrador":
        return "danger";
      case "gestor":
        return "primary";
      case "mecanico":
        return "warning";
      case "policial":
        return "success";
      default:
        return "gray";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "administrador":
        return "👨‍💼 Administrador";
      case "gestor":
        return "📊 Gestor";
      case "mecanico":
        return "🔧 Mecânico";
      case "policial":
        return "👮 Policial";
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Controle de Acesso</h1>
          <p className="text-gray-600">Gerencie usuários e permissões do sistema</p>
        </div>
        <Button icon={<Plus size={18} />}>Novo Usuário</Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input placeholder="Buscar por nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#1E3A5F]"
        >
          <option value="">Todas as Funções</option>
          <option value="administrador">Administrador</option>
          <option value="gestor">Gestor</option>
          <option value="mecanico">Mecânico</option>
          <option value="policial">Policial</option>
        </select>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-100">
          <p className="text-xs text-red-600 uppercase tracking-wide font-semibold mb-1">Administradores</p>
          <p className="text-3xl font-bold text-red-700">{filtered.filter((u) => u.role === "administrador").length}</p>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold mb-1">Gestores</p>
          <p className="text-3xl font-bold text-blue-700">{filtered.filter((u) => u.role === "gestor").length}</p>
        </Card>
        <Card className="bg-yellow-50 border-yellow-100">
          <p className="text-xs text-yellow-600 uppercase tracking-wide font-semibold mb-1">Mecânicos</p>
          <p className="text-3xl font-bold text-yellow-700">{filtered.filter((u) => u.role === "mecanico").length}</p>
        </Card>
        <Card className="bg-green-50 border-green-100">
          <p className="text-xs text-green-600 uppercase tracking-wide font-semibold mb-1">Policiais</p>
          <p className="text-3xl font-bold text-green-700">{filtered.filter((u) => u.role === "policial").length}</p>
        </Card>
      </div>

      {/* Lista de Usuários */}
      <div className="space-y-3">
        {filtered.map((usuario) => (
          <Card key={usuario.id} className="hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2c4f7c] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {usuario.nome.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{usuario.nome}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Mail size={14} />
                      {usuario.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Matrícula</p>
                    <p className="text-gray-800 font-medium">{usuario.matricula}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Função</p>
                    <Badge variant={getRoleColor(usuario.role) as any} className="mt-1">
                      {getRoleLabel(usuario.role)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Unidade</p>
                    <p className="text-gray-800 font-medium flex items-center gap-1 mt-1">
                      <Building2 size={14} />
                      {usuario.unidade}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Badge variant={usuario.ativo ? "success" : "danger"}>
                    {usuario.ativo ? "✓ Ativo" : "✕ Inativo"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button size="sm" variant="secondary" icon={<Edit2 size={14} />} />
                <Button size="sm" variant="danger" icon={<Trash2 size={14} />} onClick={() => deleteUser(usuario.id)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Nenhum usuário encontrado</p>
        </Card>
      )}
    </div>
  );
}