import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);

  const navigate = useNavigate();

  // /edit/:id
  const { id } = useParams();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  const handleTitleChange = (e) => {
    updateBoard((draft) => {
      draft.title = e.target.value;
    });
  };

  function handleContentChange(e) {
    updateBoard((draft) => {
      draft.content = e.target.value;
    });
  }

  function handleSubmit() {
    // 저장 버튼 클릭시
    // PUT/api/board/edit
    // board
    axios
      .put("/api/board/edit", board)
      .then(() => console.log("잘 됨"))
      .catch(() => console.log("잘 안됨"))
      .finally(() => console.log("끝"));
  }

  return (
    <Box>
      <h1>{id}번 글 수정</h1>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={board.title} onChange={handleTitleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea value={board.content} onChange={handleContentChange} />
      </FormControl>
      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input
          value={board.writer}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.writer = e.target.value;
            });
          }}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit}>
        저장
      </Button>
      {/* navigete (-1) : 이전 경로로 이동 */}
      <Button onClick={() => navigate(-1)}>취소</Button>
    </Box>
  );
}
