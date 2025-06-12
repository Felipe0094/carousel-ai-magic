import React from 'react';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';

interface BrokerBrandingSectionProps {
  useBrokerBranding: boolean;
  onBrokerBrandingChange: (value: boolean) => void;
}

const BrokerBrandingSection: React.FC<BrokerBrandingSectionProps> = ({
  useBrokerBranding,
  onBrokerBrandingChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="useBrokerBranding"
          checked={useBrokerBranding}
          onChange={(e) => onBrokerBrandingChange(e.target.checked)}
          className="h-4 w-4 text-feijo-red border-gray-300 rounded accent-feijo-red"
        />
        <Label htmlFor="useBrokerBranding" className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-feijo-red" />
          Usar identidade da Feijó Seguros
        </Label>
      </div>
      {useBrokerBranding && (
        <div className="p-4 bg-feijo-gray/10 rounded-lg border border-feijo-gray/20">
          <p className="text-sm text-feijo-gray">
            <strong>Feijó Seguros</strong> será incluída na geração das imagens com nossa identidade visual
          </p>
        </div>
      )}
    </div>
  );
};

export default BrokerBrandingSection;
