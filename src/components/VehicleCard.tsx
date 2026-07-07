import React from 'react';
import './VehicleCard.css'; // use classes que utilizam as variáveis definidas

type Props = {
  plate: string;
  model: string;
  status: 'operacional'|'inoperante';
};

export default function VehicleCard({plate, model, status}: Props){
  return (
    <div className="card vehicle-card">
      <div className="vehicle-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div className="vehicle-left">
          <div className="vehicle-plate" style={{fontWeight:700, color:'#0b4ed6'}}>{plate}</div>
          <div className="vehicle-model" style={{color:'var(--muted)'}}>{model}</div>
        </div>
        <div className="vehicle-right">
          <span className={`badge ${status==='operacional' ? 'badge--success' : 'badge--danger'}`}>
            {status === 'operacional' ? 'Operacional' : 'Inoperante'}
          </span>
        </div>
      </div>
    </div>
  );
}
