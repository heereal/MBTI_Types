import React, { useEffect, useState } from "react";
import {
  onSnapshot,
  query,
  collection,
  doc,
  deleteDoc,
  orderBy,
  updateDoc,
  getDoc,
  where,
} from "firebase/firestore";
import { Text, TouchableOpacity, Alert, View } from "react-native";
import styled from "@emotion/native";
import { MaterialIcons } from "@expo/vector-icons";
import MbtiColorBtnCommunity from "../global/MbtiColorBtnCommunity";
import { getDate } from "../../utils";
import { AntDesign } from "@expo/vector-icons";
import { authService } from "../../firebase";
import { dbService } from "../../firebase";
import { async } from "@firebase/util";

export default function Post({ getPost }) {
  // console.log("getPost :", getPost);

  const [post, setPost] = useState(getPost);
  const [state, setState] = useState(false);

  const getpost = () => {
    const q = query(
      collection(dbService, "posts")
      // where("category", "==", "community")
    );
    onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => {
        const newState = {
          id: doc.id,
          ...doc.data(),
        };
        return newState;
      });
      // console.log("post", posts);
      const getone = posts.find((post) => post?.id === getPost?.id);
      setPost(getone);
    });
  };

  console.log("데이터", post);

  // const getone = getPost;

  // // console.log(
  // //   "123",
  // //   posts?.find((post) => post?.id === getPost?.id)
  // // );
  // // const getone = getPost;

  // const getone= posts.find((post) => post?.id === getPost?.id);

  // const getData = async () => {
  //   const docRef = doc(dbService, "communityPosts", getPost?.id);
  //   const docSnap = await getDoc(docRef);
  //   const data = await docSnap.data();
  //   return data;
  // };

  // console.log("데이터", post);

  const currentUid = authService.currentUser?.email.toString();

  const LikeRef = doc(dbService, "posts", getPost?.id);

  const Like_Button = async () => {
    if (post.likedUserList?.includes(currentUid)) {
      let newarray = [...post.likedUserList].filter((e) => e !== currentUid);
      console.log("삭제", post.likedUserList);
      await updateDoc(LikeRef, {
        likedUserList: newarray,
      });
      setState((e) => !e);
    } else {
      let newarray = [...post.likedUserList, currentUid];
      await updateDoc(LikeRef, {
        likedUserList: newarray,
      });
      setState((e) => !e);
    }
  };

  const Likecolor = () => {
    if (post.likedUserList?.includes(currentUid)) {
      return "tomato";
    } else {
      return "#584164";
    }
  };

  // 본문 삭제하기.
  const deletePost = () => {
    Alert.alert("게시물 삭제", "정말 삭제 하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          deleteDoc(doc(dbService, "posts", getone?.id));
        },
      },
    ]);
  };

  useEffect(() => {
    getpost();
  }, [state]);

  return (
    <>
      <Wrap>
        <PostContainer>
          <TitleMbtiBox>
            <StyledTitle>{post?.title}</StyledTitle>
            {getPost.category === "community" ? (
              <MbtiColorBtnCommunity mbti={post?.mbti} />
            ) : null}
          </TitleMbtiBox>
          <NameDateBox>
            <StyledNickName>{post?.nickname}</StyledNickName>
            <StyledDate> {getDate(post?.date)}</StyledDate>
          </NameDateBox>
          <StyledContent>{post?.content}</StyledContent>
        </PostContainer>
        {/* <TouchableOpacity onPress={deletePost}>
          <StyledDelete>
            <MaterialIcons name="delete" size={24} color="black" />
          </StyledDelete>
        </TouchableOpacity> */}
      </Wrap>
      <LikeButtonWrap>
        {!authService.currentUser ? (
          <LikePreview>
            <AntDesign name="heart" size={15} color="tomato" />
            <Text>{post.likedUserList?.length}</Text>
          </LikePreview>
        ) : (
          <LikeButton onPress={Like_Button}>
            <AntDesign name="heart" size={15} color={Likecolor()} />

            <Text>{post.likedUserList?.length}</Text>
          </LikeButton>
        )}
      </LikeButtonWrap>
    </>
  );
}

const LikeButtonWrap = styled.View`
  width: 100%;
  flex-direction: row;
  padding: 10px 20px;
`;

const LikeButton = styled.TouchableOpacity`
  width: 50px;
  height: 30px;
  border-radius: 25px;
  background-color: whitesmoke;
  flex-direction: row;
  justify-content: space-around;
  padding: 0 5px;
  align-items: center;
`;
const LikePreview = styled.View`
  width: 50px;
  height: 30px;
  border-radius: 25px;
  flex-direction: row;
  justify-content: space-around;
  padding: 0 5px;
  align-items: center;
`;

const Wrap = styled.View`
  padding: 10px 20px;
  align-items: center;
  min-height: 200px;
`;

const PostContainer = styled.View`
  width: 95%;
  padding-top: 20px;
`;

const TitleMbtiBox = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
`;

const StyledTitle = styled.Text`
  width: 80%;
  font-weight: 600;
  font-size: 23px;
  margin-right: 10px;
`;

const NameDateBox = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const StyledDate = styled.Text`
  font-size: 16px;
  color: gray;
`;

const StyledNickName = styled.Text`
  font-weight: 400;
  font-size: 16px;
  margin-right: 5px;
`;

const StyledContent = styled.Text`
  font-size: 19px;
`;
