
import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <div className="text-center space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-center mb-6">
        <img 
          src="/lovable-uploads/7d913761-ee53-435e-9d2c-4ca1ecccdf23.png" 
          alt="Feijó Seguros" 
          className="h-20 w-auto"
        />
      </div>
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
        IA Gerador de Prompts
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-feijo-red">
        Feijó Seguros
      </h2>
      <p className="text-xl text-gray-600 leading-relaxed">
        Crie prompts profissionais para carrosséis e imagens únicas dos nossos seguros usando o poder da IA
      </p>
    </div>
  );
};

export default AppHeader;
