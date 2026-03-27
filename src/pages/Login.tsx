import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Link, useNavigate } from "react-router-dom"; // 1. Importe o useNavigate
import { GoogleLogin } from '@react-oauth/google';

export function Login() {
  const navigate = useNavigate(); // 2. Inicialize o hook

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dica Sênior: Se o cara já tem token, joga ele direto pro Dashboard
  useEffect(() => {
    const token = localStorage.getItem("@RentlyHub:token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/access-token", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token } = response.data;

      // Salva o token
      localStorage.setItem("@RentlyHub:token", access_token);

      // 3. O Pulo do Gato: Redireciona para o Dashboard sem alert chato
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Falha no login. Verifique email e senha.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse: any) {
    try {
      setLoading(true);
      setError("");
      
      const response = await api.post("/login/google", {
        token: credentialResponse.credential
      });
      
      const { access_token } = response.data;
      localStorage.setItem("@RentlyHub:token", access_token);
      navigate("/dashboard");
    } catch(err) {
      console.error(err);
      setError("Falha no login com Google.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-slate-200">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            RentlyHub
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Gerencie suas propriedades com inteligência.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-500">Ou continue com</span>
            </div>
          </div>
          
          <div className="flex justify-center">
             <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError("Falha ao iniciar o login com o Google.");
              }}
              useOneTap
            />
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            Não tem uma conta?{" "}
            <Link
              to="/signup"
              className="font-semibold text-slate-900 hover:text-slate-700"
            >
              Crie agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
