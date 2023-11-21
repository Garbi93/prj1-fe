import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
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
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";

export function BoardEdit() {
  const [uploadFiles, setUploadFiles] = useState(null);

  const [board, updateBoard] = useImmer(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

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
      .putForm("/api/board/edit", { board, uploadFiles })
      .then(() => {
        toast({
          description: board.id + "번 게시글이 수정 되었습니다.",
          status: "success",
        });

        navigate("/board/" + id);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            description: "요청이 잘못되었습니다.",
            status: "error",
          });
        } else {
          toast({
            description: "수정 중에 문제가 발생 하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => onClose());
  }

  function handleDeleteFile(fileId) {
    axios
      .delete("/api/file/remove?id=" + id + "&fi=" + fileId)
      .then(() => {
        toast({
          description: fileId + "파일일 삭제되었습니다.",
          status: "success",
        });
        navigate(0);
      })
      .catch(() => console.log("notDelete"))
      .then(() => console.log("deleteLogic"));
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

      {/* 이미지 출력 */}
      {board.files.map((file) => (
        <Box>
          <Box key={file.id} my={"5px"} boarder="3px solid black">
            <Image width="50%" src={file.url} alt={file.name} />
          </Box>
          <Button
            onClick={() => handleDeleteFile(file.id)}
            colorScheme="orange"
          >
            {file.name} : 삭제
          </Button>
        </Box>
      ))}

      {/* 이미지 추가 */}
      <FormControl>
        <FormLabel>추가 하실 이미지</FormLabel>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setUploadFiles(e.target.files)}
        />
        <FormHelperText>
          한 개 파일은 1MB 이내, 총 용량은 10MB 이내로 첨부하세요.
        </FormHelperText>
      </FormControl>

      <Button colorScheme="blue" onClick={onOpen}>
        저장
      </Button>
      {/* navigete (-1) : 이전 경로로 이동 */}
      <Button onClick={() => navigate(-1)}>취소</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>저장 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>저장 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleSubmit} colorScheme="blue">
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
