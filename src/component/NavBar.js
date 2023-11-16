import { Button, Flex, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LoginContext } from "./LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import {
  faHouse,
  faList,
  faPen,
  faRightFromBracket,
  faRightToBracket,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

export function NavBar() {
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams();
  // 위치가 바뀌는 것을 인식
  const location = useLocation();

  useEffect(() => {
    fetchLogin();
  }, [location]);

  if (login !== "") {
    urlParams.set("id", login.id);
  }

  function handleLogout() {
    // TODO : 로그 아웃 후 할일 추가
    axios.post("/api/member/logout").then(() => {
      toast({
        description: "로그아웃 되었습니다.",
        status: "info",
      });
      navigate("/");
    });
  }

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faHouse} /> {"\u00A0"}
        home
      </Button>
      {isAuthenticated() && (
        <Button onClick={() => navigate("/write")}>
          <FontAwesomeIcon icon={faPen} /> {"\u00A0"}
          write
        </Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/signup")}>
          <FontAwesomeIcon icon={faUserPlus} /> {"\u00A0"}
          signup
        </Button>
      )}
      {isAdmin() && (
        <Button onClick={() => navigate("member/list")}>
          <FontAwesomeIcon icon={faList} /> {"\u00A0"}
          회원목록
        </Button>
      )}
      {isAuthenticated() && (
        <Button onClick={() => navigate("/member?" + urlParams.toString())}>
          <FontAwesomeIcon icon={faUser} /> {"\u00A0"}
          회원정보
        </Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/login")}>
          <FontAwesomeIcon icon={faRightToBracket} /> {"\u00A0"}
          로그인
        </Button>
      )}
      {isAuthenticated() && (
        <Button onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} /> {"\u00A0"} 로그아웃
        </Button>
      )}
    </Flex>
  );
}
