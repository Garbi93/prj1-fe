import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DeleteIcon, EditIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { LoginContext } from "./LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Flex>
        <Textarea
          placeholder="댓글을 작성해 주세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Center isDisabled={isSubmitting} onClick={handleSubmit}>
          <Button h={"full"} size={"lg"}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </Center>
      </Flex>
    </Box>
  );
}

function CommentItem({
  comment,
  onDeleteModalOpen,
  setIsSubmitting,
  isSubmitting,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [commentEdited, setCommentEdited] = useState(comment.comment);

  const toast = useToast();

  const { hasAccess } = useContext(LoginContext);

  function handleSubmit() {
    setIsSubmitting(true);

    axios
      .put("/api/comment/edit", { id: comment.id, comment: commentEdited })
      // 응답 코드에 따를 기능들
      .then(() => {
        toast({
          description: "댓글 수정이 완료 되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        }

        if (error.response.status === 400) {
          toast({
            description: "입력값을 확인해 주세요.",
            status: "warning",
          });
        }
      })
      .finally(() => {
        // 댓글 list refresh
        setIsSubmitting(false);
        // textarea 닫기
        setIsEditing(false);
      });
  }

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Heading size="xs">{comment.memberNickName}</Heading>
        <Text fontSize="xs">{comment.ago}</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Box flex={1}>
          <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
            {comment.comment}
          </Text>
          {isEditing && (
            <Box>
              <Textarea
                value={commentEdited}
                onChange={(e) => setCommentEdited(e.target.value)}
              />
              <Button
                isDisabled={isSubmitting}
                colorScheme="blue"
                onClick={handleSubmit}
              >
                저장
              </Button>
            </Box>
          )}
        </Box>

        {hasAccess(comment.memberId) && (
          <Box>
            {isEditing || (
              <Button
                variant="ghost"
                size="xs"
                colorScheme="purple"
                onClick={() => setIsEditing(true)}
              >
                <EditIcon />
              </Button>
            )}
            {isEditing && (
              <Button
                variant="ghost"
                size="xs"
                colorScheme="gray"
                onClick={() => setIsEditing(false)}
              >
                <NotAllowedIcon />
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => onDeleteModalOpen(comment.id)}
              size="xs"
              colorScheme="red"
            >
              <DeleteIcon />
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
}

function CommentList({
  commentList,
  onDeleteModalOpen,
  isSubmitting,
  setIsSubmitting,
}) {
  const { hasAccess } = useContext(LoginContext);
  return (
    <Center mt={20}>
      <Card w={"lg"}>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            {commentList.map((comment) => (
              <CommentItem
                key={comment.id}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                comment={comment}
                onDeleteModalOpen={onDeleteModalOpen}
              />
            ))}
          </Stack>
        </CardBody>
      </Card>
    </Center>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState([]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  // const [id, setId] = useState(0);
  // useRef : 컴포넌트에서 임시로 값을 저장하는 용도로 사용
  const commentIdRef = useRef(0);

  const { isAuthenticated } = useContext(LoginContext);

  const toast = useToast();

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);

      axios
        .get("/api/comment/list?" + params) // 자바스크립트에서 피연산자가 String 타입이어서 params에 toString() 을 안 붙여도 String 타입으로 더해진다.
        .then((response) => setCommentList(response.data));
    }
  }, [isSubmitting]);

  function handleSubmit(comment) {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add", comment)
      .then(() => {
        toast({
          description: "댓글이 등록 되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        toast({
          description: "댓글 등록중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  function handleDelete() {
    // console.log(id + "댓글삭제");
    // 모달, 삭제후 리스트 업데이트, then, fetch, finally

    setIsSubmitting(true);
    axios
      .delete("/api/comment/" + commentIdRef.current)
      .then(() => {
        toast({
          description: "댓글이 삭제되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        } else {
          toast({
            description: "댓글 삭제중 문제가 발생했습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        onClose();
        setIsSubmitting(false);
      });
  }

  function handleDeleteModalOpen(id) {
    // id 를 어딘가 저장
    // setId(id);
    commentIdRef.current = id;
    // 모달 열기
    onOpen();
  }

  return (
    <Box>
      <Center mt={10}>
        <Box w={"lg"}>
          <Heading>
            <FontAwesomeIcon icon={faComments} /> COMMENTS
          </Heading>
        </Box>
      </Center>
      {isAuthenticated() && (
        <Center mt={10}>
          <Box w={"lg"}>
            <CommentForm
              boardId={boardId}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </Box>
        </Center>
      )}
      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
      />

      {/* 삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
