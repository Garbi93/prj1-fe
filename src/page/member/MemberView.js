import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
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
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export function MemberView() {
  const [member, setMember] = useState(null);
  const [checked, setChecked] = useState("notChecked");
  // /member?id=userid
  const [params] = useSearchParams();

  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios
      .get("/api/member?" + params.toString())
      .then((response) => setMember(response.data));
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  function handleDelete() {
    // axios
    // delete /api/member?id=userid
    axios
      .delete("/api/member?" + params.toString())
      .then(() => {
        setChecked("checked");
        toast({
          description: "회원 탈퇴 하였습니다.",
          status: "success",
        });
        navigate("/");

        // TODO : 로그 아웃 기능 추가하기
      })
      .catch((error) => {
        if (setChecked("notChecked")) {
          if (error.response.status === 401 || error.response.status === 403) {
            toast({
              description: "권한이 없습니다.",
              status: "error",
            });
          } else
            toast({
              description: "탈퇴 처리 중에 문제가 발생하였습니다",
              status: "error",
            });
          toast({
            description: "삭제를 취소 하였습니다.",
            status: "success",
          });
        }
      })
      .finally(() => onClose);

    // ok -> home 으로 이동. 성공 toast 띄우기
    //error -> 실패 toast 띄우기
    // finally -> modal 닫기
  }

  return (
    <Box>
      <h1>{member.id}님 정보</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input type="text" value={member.password} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>email</FormLabel>
        <Input value={member.email} readOnly />
      </FormControl>
      <Button colorScheme="purple">수정</Button>
      <Button colorScheme="red" onClick={onOpen}>
        탈퇴
      </Button>

      {/* 탈퇴 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} checked={checked}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>탈퇴 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* radio button 추가 */}
            탈퇴 하시겠습니까?
            <RadioGroup value={checked} onChange={setChecked}>
              <Stack direction="row">
                <Radio value="notChecked">유지하기</Radio>
                <Radio value="checked">삭제하기</Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              탈퇴
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
