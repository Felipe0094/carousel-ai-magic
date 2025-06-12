
import React from 'react';

const AppFooter: React.FC = () => {
  return (
    <footer className="text-center text-gray-500 py-12 border-t border-gray-200 mt-16">
      <div className="flex justify-center mb-4">
        <img 
          src="/lovable-uploads/7d913761-ee53-435e-9d2c-4ca1ecccdf23.png" 
          alt="Feijó Seguros" 
          className="h-12 w-auto opacity-75"
        />
      </div>
      <p className="text-lg text-feijo-red font-semibold">
        Feijó Seguros - Protegendo o que é importante para você
      </p>
      <p className="mt-2 text-sm">
        Powered by Gemini 2.5 Flash API
      </p>
    </footer>
  );
};

export default AppFooter;
