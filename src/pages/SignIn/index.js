import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "../../components/Container";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { TextButton } from "../../components/TextButton";

import { signIn } from "./../../services/api.js";

import { setItem, getItem } from "./../../utils";

const initialState = {
  email: "",
  password: "",
};

const SignIn = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (getItem("auth")) {
      navigate("/wallet", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    signIn(form)
      .then((res) => {
        setLoading(false);
        setItem("auth", { ...res.data });
        if (res.status === 200) navigate("/wallet", { replace: true });
      })
      .catch((e) => {
        setLoading(false);
        console.log(e.response.data);
      });
  };

  return (
    <Container>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <h1>MyWallet</h1>
        <Input
          type="email"
          name="email"
          onChange={handleChange}
          value={form.email}
          placeholder="E-mail"
          disabled={loading}
          required
        />
        <Input
          type="password"
          name="password"
          onChange={handleChange}
          value={form.password}
          placeholder="Senha"
          disabled={loading}
          required
        />
        <Button type="submit" isLoading={loading} disabled={loading}>
          Entrar
        </Button>
      </form>
      <TextButton onClick={() => navigate("/sign-up")}>
        Primeira vez? Cadastre-se!
      </TextButton>
    </Container>
  );
};

export { SignIn };
