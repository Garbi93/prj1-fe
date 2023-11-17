import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((response) => setBoardList(response.data));
  }, []);

  if (boardList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>게시물 목록</h1>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>
                <FontAwesomeIcon icon={faHeart} />
              </Th>
              <Th>title</Th>
              <Th>by</Th>
              <Th>at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList &&
              boardList.map((board) => (
                <Tr
                  _hover={{ cursor: "pointer" }}
                  key={board.id}
                  onClick={() => navigate("/board/" + board.id)}
                >
                  <Td>{board.id}</Td>
                  <Td>{board.countLike != 0 && board.countLike}</Td>
                  <Td>
                    {board.title}
                    {board.countComment > 0 && (
                      <Badge>
                        <ChatIcon />
                        {board.countComment}
                      </Badge>
                    )}
                  </Td>
                  <Td>{board.nickName}</Td>
                  <Td>{board.ago}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
