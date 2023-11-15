import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

function CommentForm({ boardId, isSubmitting, onSubmit, setCommentChange }) {
  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  function handleSetComment() {
    setCommentChange({});
  }

  return (
    <Box>
      <Textarea
        value={comment}
        // onChange={(e) => setComment(e.target.value)}
        onChange={handleSetComment}
      />
      <Button isDisabled={isSubmitting} onClick={handleSubmit}>
        쓰기
      </Button>
    </Box>
  );
}

function CommentList({ commentList }) {
  const { id } = useSearchParams();

  // const { id } = new URLSearchParams();

  const toast = useToast();
  const navigate = useNavigate();
  function handleDelete() {
    axios.delete("/api/comment/delete/" + commentList[0].id).then(() => {
      toast({
        description: "댓글이 삭제 되었습니다.",
        status: "success",
      });
      navigate("/board/id/" + id);
    });
    // console.log(id);
    // console.log(commentList);
    // console.log(commentList[0].id);
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">댓글리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((comment) => (
            <Box key={comment.id}>
              <Flex justifyContent="space-between">
                <Heading size="xs">{comment.memberId}</Heading>
                <Text fontSize="xs">{comment.inserted}</Text>
              </Flex>
              <Flex justifyContent={"space-between"}>
                <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
                  {comment.comment}
                </Text>
                <Button onClick={handleDelete} size="sm">
                  삭제
                </Button>
              </Flex>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");

  const [commentList, setCommentList] = useState([]);

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
      .finally(() => setIsSubmitting(false));
  }

  function handleComment() {}

  return (
    <Box>
      <CommentForm
        boardId={boardId}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        setCommentChange={handleComment}
      />
      <CommentList boardId={boardId} commentList={commentList} />
    </Box>
  );
}
