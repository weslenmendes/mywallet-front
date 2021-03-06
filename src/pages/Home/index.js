import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { RiLogoutBoxRLine as LogoutIcon } from "react-icons/ri";
import {
  AiOutlinePlusCircle as PlusIcon,
  AiOutlineMinusCircle as MinusIcon,
} from "react-icons/ai";

import { Container } from "./../../components/Container";
import { Box } from "../../components/Box";

import { Board } from "../../components/Board";
import { BoxButton } from "../../components/BoxButton";
import { Separator } from "./../../components/Separator";
import { ItemList } from "../../components/ItemList";
import { Loader } from "./../../components/Loader";

import { getData, signOut } from "./../../services/api";

import AuthContext from "./../../contexts/AuthContext";
import { removeItem } from "../../utils";

const Home = (props) => {
  const { auth, handleAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.token) {
      setLoading(true);
      getData(auth.token)
        .then((res) => {
          if (res.status === 200) {
            setLoading(false);
            setData(res.data);
            setBalance(calculateBalance(res.data));
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log(e.response.data);
        });
    }

    if (!auth?.token || !auth?.name) {
      navigate("/", { replace: true });
    }
  }, [auth, navigate]);

  const calculateBalance = (data) => {
    return data.reduce((acc, prev) => {
      if (prev.type === "in") return acc + prev.amount;

      return acc - prev.amount;
    }, 0);
  };

  const handleSignout = () => {
    const confirm = window.confirm("Você quer mesmo sair?");

    if (confirm && auth.token) {
      signOut(auth.token).then(() => {
        removeItem("auth");
        handleAuth({});
        navigate("/", { replace: true });
      });
    }
  };

  const createContent = () => {
    let content = null;

    if (loading) {
      content = <Loader color="#8C11BE" height="50" width="80" />;
    } else if (data.length === 0 && !loading) {
      content = <p>Não há registros de entrada ou saída</p>;
    } else {
      content = <ItemList data={data} token={auth.token} />;
    }

    return content;
  };

  return (
    <Container justifyContent="start">
      <Box>
        <h2>Olá, {auth?.name}</h2>
        <button onClick={() => handleSignout()}>
          <LogoutIcon />
        </button>
      </Box>
      <Board balance={balance}>{createContent()}</Board>
      <Box bgButtonColor="#A328D6">
        <BoxButton onClick={() => navigate("/wallet/new-entry")}>
          <PlusIcon />
          <p>Nova entrada</p>
        </BoxButton>
        <Separator height="100%" width="15px" />
        <BoxButton onClick={() => navigate("/wallet/new-exit")}>
          <MinusIcon />
          <p>Nova saída</p>
        </BoxButton>
      </Box>
    </Container>
  );
};

export { Home };
