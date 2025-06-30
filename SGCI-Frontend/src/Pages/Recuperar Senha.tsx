import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../Service/loginService";

const RecuperarSenha: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    if (!email) {
      setMensagem("Por favor, insira um e-mail válido.");
      setLoading(false);
      return;
    }

    try {
      const sucesso = await loginService.recuperarSenha(email);
      if (sucesso) {
        setMensagem("E-mail de recuperação enviado com sucesso.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setMensagem("Erro ao enviar e-mail de recuperação. Tente novamente.");
      }
    } catch (error) {
      setMensagem("Erro ao processar a solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="container p-5">
      <div className="col-sm-6 offset-sm-3">
        <h3 className="text-center mb-4">Recuperar Senha</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {mensagem && <p className="text-center text-danger">{mensagem}</p>}
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Recuperar Senha"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBackToLogin}
            >
              Voltar para Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecuperarSenha;
