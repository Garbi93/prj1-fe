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
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

function CommentForm({ boardId }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    axios.post("/api/comment/add", {
      // boardId: boardId,
      // comment: comment,
      // 받는 변수명과 주는 변수명이 같으면 생략 가능
      boardId,
      comment,
    });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button onClick={handleSubmit}>쓰기</Button>
    </Box>
  );
}

function CommentList({ boardId }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id", boardId);

    axios
      .get("/api/comment/list?" + params) // 자바스크립트에서 피연산자가 String 타입이어서 params에 toString() 을 안 붙여도 String 타입으로 더해진다.
      .then((response) => setCommentList(response.data));
  }, []);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">댓글리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((comment) => (
            <Box>
              <Flex justifyContent="space-between">
                <Heading size="xs">{comment.memberId}</Heading>
                <Text fontSize="xs">{comment.inserted}</Text>
              </Flex>
              <Text pt="2" fontSize="sm">
                {comment.comment}
              </Text>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList boardId={boardId} />
    </Box>
  );
}
