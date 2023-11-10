import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      .then(() => {
        console.log("잘 됨");
        toast({
          description: "저장이 잘 되었습니다.",
          status: "success",
        });
      })
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
      <Box>
        <Button
          colorScheme="blue"
          onClick={() => {
            onOpen();
            handleSubmit();
            toast();
          }}
        >
          저장
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{id}번 내용을 수정 할 예정 입니다.</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <h4>수정된 내용은</h4>
              <p>제 목 : {board.title}</p>
              <p>내 용 : {board.content}</p>
              <p>작성자 : {board.writer}</p>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button>저장</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      {/* navigete (-1) : 이전 경로로 이동 */}
      <Button onClick={() => navigate(-1)}>취소</Button>
    </Box>
  );
}
