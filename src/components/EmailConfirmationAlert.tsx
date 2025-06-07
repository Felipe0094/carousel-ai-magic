import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, AlertCircle } from "lucide-react";

interface EmailConfirmationAlertProps {
  email: string;
}

const EmailConfirmationAlert = ({ email }: EmailConfirmationAlertProps) => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Mail className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">Verifique seu email</AlertTitle>
      <AlertDescription className="text-blue-700">
        Enviamos um link de confirmação para <span className="font-medium">{email}</span>.
        Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
        <div className="mt-2 text-sm">
          <AlertCircle className="h-4 w-4 inline mr-1" />
          Não recebeu o email? Verifique sua pasta de spam ou{" "}
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:underline font-medium"
          >
            tente novamente
          </button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default EmailConfirmationAlert; 