import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Auth = () => {
  const { signIn, signUp, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        if (!name) {
          throw new Error("Nome é obrigatório");
        }
        await signUp(email, password, name);
        navigate("/auth/signin");
      } else {
        await signIn(email, password);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{isSignUp ? "Criar Conta" : "Entrar"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Carregando..." : isSignUp ? "Criar Conta" : "Entrar"}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  {isSignUp ? (
                    <>
                      Já tem uma conta?{" "}
                      <button
                        type="button"
                        onClick={() => setIsSignUp(false)}
                        className="text-green-600 hover:underline"
                      >
                        Entrar
                      </button>
                    </>
                  ) : (
                    <>
                      Não tem uma conta?{" "}
                      <button
                        type="button"
                        onClick={() => setIsSignUp(true)}
                        className="text-green-600 hover:underline"
                      >
                        Criar Conta
                      </button>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth; 