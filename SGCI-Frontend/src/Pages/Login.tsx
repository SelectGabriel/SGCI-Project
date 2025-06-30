import React, { useState } from "react";
import logo from "../Shared/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { loginService } from "../Service/loginService";
import { authService } from "../Service/authService";

const Login: React.FC = () => {
  interface LoginForm {
    login: string;
    senha: string;
  }

  const [formData, setFormData] = useState<LoginForm>({ login: "", senha: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.login || !formData.senha) {
      setError("Todos os campos devem ser preenchidos");
      return false;
    }
    setError(null);
    return true;
  };

  const handleLogin = async () => {
    try {
      const success = await loginService.login(formData.login, formData.senha);
      if (!success) {
        setError("Login ou senha incorretos");
      } else {
        console.log("Usuário autenticado:", authService.getUserInfo());
        navigate("/listar-experimento");
      }
    } catch (err) {
      console.error("Erro ao realizar login:", err);
      setError("Ocorreu um erro ao tentar realizar o login");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleLogin();
    }
  };

  return (
    <div className="container p-5">
      <div className="col-sm-4 offset-sm-4">
        <form onSubmit={handleSubmit}>
          <div className="row mb-4 text-center">
            <h3>SGCI - Sistema Gerenciador do Corredor Inteligente</h3>
            <img
              src={logo}
              alt="Logo do Corredor Inteligente"
              className="d-block mx-auto"
              style={{ width: "250px" }}
            />
          </div>

          <div className="form-outline mb-4">
            {error && <p className="text-danger">{error}</p>}
            <label className="form-label" htmlFor="login">
              E-mail:
            </label>
            <input
                type="email"
                placeholder="exemplo@dominio.com"
                className="form-control"
                required
                value={formData.login}
                onChange={handleChange}
                id="login"
                name="login"
            />
          </div>

          <div className="form-outline mb-4">
            <label className="form-label" htmlFor="senha">
              Senha:
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="row mb-4">
            <div className="col">
              <Link to="/recuperar-senha">Esqueceu a senha?</Link>
            </div>
          </div>

          {/* Submit button */}
          <button type="submit" className="btn btn-primary btn-block">
            Entrar
          </button>
        </form>

        <div className="text-center mt-4">
          <span>Não possui uma conta? </span>
          <Link to="/autocadastro-pesquisador">Cadastrar Pesquisador</Link>
        </div>
      </div>
    </div>
  );
};


export default Login;
