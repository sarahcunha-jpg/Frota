import { Settings, Bell, Moon, LogOut, Shield, Eye, Lock } from "lucide-react";
import { useState } from "react";
import { useFleet } from "../context/FleetContext";
import { Card, Button, Badge } from "./ui";

export default function Configuracoes() {
  const { currentUser, logout } = useFleet();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e segurança</p>
      </div>

      {/* Perfil */}
      <Card header={<h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2"><Shield size={16} /> Perfil</h3>}>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2c4f7c] flex items-center justify-center text-white font-bold text-2xl">
              {currentUser?.nome.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{currentUser?.nome}</h3>
              <p className="text-sm text-gray-600">{currentUser?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="primary">{currentUser?.role === "administrador" ? "👨‍💼" : currentUser?.role === "gestor" ? "📊" : currentUser?.role === "mecanico" ? "🔧" : "👮"} {currentUser?.role}</Badge>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Matrícula</p>
              <p className="text-gray-800 font-medium mt-1">{currentUser?.matricula}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Unidade</p>
              <p className="text-gray-800 font-medium mt-1">{currentUser?.unidade}</p>
            </div>
          </div>
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <Button size="sm" variant="secondary" className="flex-1">Editar Perfil</Button>
            <Button size="sm" variant="outline" className="flex-1">Alterar Senha</Button>
          </div>
        </div>
      </Card>

      {/* Preferências */}
      <Card header={<h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2"><Settings size={16} /> Preferências</h3>}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-gray-600" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Modo Escuro</p>
                <p className="text-xs text-gray-500">Ativar tema escuro da interface</p>
              </div>
            </div>
            <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gray-600" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Notificações</p>
                <p className="text-xs text-gray-500">Receber alertas de manutenção</p>
              </div>
            </div>
            <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
          </div>
        </div>
      </Card>

      {/* Segurança */}
      <Card header={<h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2"><Lock size={16} /> Segurança</h3>}>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 text-sm">Autenticação de dois fatores</p>
              <p className="text-xs text-gray-500 mt-0.5">Adicione proteção extra à sua conta</p>
            </div>
            <Badge variant="gray">Desativado</Badge>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 text-sm">Última mudança de senha</p>
              <p className="text-xs text-gray-500 mt-0.5">2024-12-15 às 14:30</p>
            </div>
            <Button size="sm" variant="secondary">Alterar</Button>
          </div>
          <div className="p-3 bg-red-50 rounded-lg flex items-center justify-between border border-red-200">
            <div>
              <p className="font-medium text-red-900 text-sm">Sessões ativas</p>
              <p className="text-xs text-red-700 mt-0.5">1 dispositivo conectado</p>
            </div>
            <Button size="sm" variant="danger">Encerrar Todas</Button>
          </div>
        </div>
      </Card>

      {/* Sair */}
      <div className="flex gap-3">
        <Button variant="danger" icon={<LogOut size={18} />} onClick={logout} className="flex-1 h-12">
          Sair da Conta
        </Button>
      </div>
    </div>
  );
}