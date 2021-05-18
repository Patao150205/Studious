import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { auth, db } from "../../firebase/firebaseConfig";
import { UplodedImg } from "../../pages/edit";
import { HandleDelete } from "../../pages/record";
import { SendCommentsData } from "../component/UIkit/organisms/commentArea";
import { RootState } from "../store";

//Thunk
export const updateMyInfo: any = createAsyncThunk("user/updateMyInfo", async (data: PartialUserInfo, thunk) => {
  const uid = data.uid;
  auth.currentUser?.updateProfile({
    displayName: data.username,
  });
  await db.collection("users").doc(uid).set(data, { merge: true });
  //Redux用にキャストする
  data.created_at && (data.created_at = data.created_at.toDate().toLocaleDateString());
  return data;
});

export const fetchMyUserInfo: any = createAsyncThunk("user/fetchMyUserInfo", async (uid: string, thunk) => {
  //uidの未定義による新たなドキュメント作成のエラー回避のための条件分岐
  uid && (await db.collection("users").doc(uid).set({ isSignin: true }, { merge: true }));
  const res = await db.collection("users").doc(uid).get();
  const data: any = res.data();
  data.created_at = data.created_at?.toDate().toLocaleDateString();
  return data;
});

export const updateMyRecord: any = createAsyncThunk("user/updateMyRecord", async (data: PartialUserRecord, thunk) => {
  if (!data.recordId) {
    const recordRef = db.collection("users").doc(data.uid).collection("userRecords").doc();
    data.recordId = recordRef.id;
    await recordRef.set(data, { merge: true });
  } else {
    data.isNew = false;
    await db.collection("users").doc(data.uid).collection("userRecords").doc(data.recordId).set(data, { merge: true });
  }
});

export const deleteUserRecord: any = createAsyncThunk(
  "user/deleteUserRecord",
  async ({ uid, recordId, newPosts, total_time, posts_count }: HandleDelete, thunk) => {
    await db.collection("users").doc(uid).collection("userRecords").doc(recordId).delete();
    await db.collection("users").doc(uid).set({ statisticalData: { total_time, posts_count } }, { merge: true });
    return newPosts;
  }
);

export const sendPostComment: any = createAsyncThunk("user/sendPostComment", async (data: SendCommentsData, thunk) => {
  await db
    .collection("users")
    .doc(data.recordAuthorUid)
    .collection("userRecords")
    .doc(data.recordId)
    .set({ othersComments: data }, { merge: true });
  const convertedData = data.comments.map((comment) => {
    if (comment.created_at.seconds) {
      comment.created_at = comment.created_at.toDate().toLocaleString();
    }
    return comment;
  });
  data.comments = convertedData;
  return data;
});

export const deletePostComment: any = createAsyncThunk("user/sendPostComment", async (data, thunk) => {});

export const updateIsSignin: any = createAsyncThunk("user/updateIsSignin", async (uid: string, thunk) => {
  uid && (await db.collection("users").doc(uid).set({ isSignin: false }, { merge: true }));
  return;
});

//型の値の型を抽出する。
type ValueOf<T> = T[keyof T];

type UserInfo = {
  created_at: any;
  email: string;
  introduce_myself: string;
  isSignin: boolean;
  role: "User" | "Admin";
  photoURL: string;
  sns_path: { twitter: string; GitHub: string };
  statisticalData: { total_time: number; posts_count: number };
  target: string;
  uid: string;
  username: string;
};
export type UserRecord = {
  created_at: any;
  doneDate?: any;
  goodHeart: [{ uid: string; username: string; userIcon: string }] | [];
  recordId: string;
  learning_content?: [{ learningContent: string; hours: number; minutes: number; convertedToMinutes: number }];
  ownComment: string;
  othersComments?: SendCommentsData;
  images: UplodedImg[];
  isNew: boolean;
  isLearningRecord: boolean;
  sumedTime: number;
  updated_at: any;
  uid: string;
  username: string;
  userIcon: string;
};
export type UserState = {
  myInfo: UserInfo;
  myRecords: UserRecord[];
};

export type PartialUserInfo = Partial<UserInfo>;
export type PartialUserRecord = Partial<UserRecord>;

export const initialState: UserState = {
  myInfo: {
    created_at: null,
    email: "",
    photoURL: "",
    introduce_myself: "",
    isSignin: false,
    role: "User",
    sns_path: { twitter: "", GitHub: "" },
    statisticalData: { total_time: 0, posts_count: 0 },
    target: "",
    uid: "",
    username: "",
  },
  myRecords: [
    {
      recordId: "",
      created_at: null,
      doneDate: null,
      goodHeart: [],
      learning_content: [{ learningContent: "", hours: 0, minutes: 0, convertedToMinutes: 0 }],
      ownComment: "",
      othersComments: { comments: [], recordAuthorUid: "", recordId: "" },
      images: [],
      isNew: true,
      isLearningRecord: false,
      sumedTime: 0,
      updated_at: null,
      uid: "",
      username: "",
      userIcon: "",
    },
  ],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reflectRecordData: (state, action) => {
      state.myRecords = action.payload;
    },
    reflectHeart: (state, action) => {
      state.myRecords.map((post) => {
        if (post.recordId === action.payload.recordId) {
          post.goodHeart = action.payload;
        }
      });
    },
  },
  extraReducers: {
    [updateMyInfo.fulfilled]: (state, action) => {
      state.myInfo = {
        ...action.payload,
      };
    },
    [updateMyInfo.rejected]: () => {
      alert("ユーザ情報の更新に失敗しました。");
    },
    [fetchMyUserInfo.fulfilled]: (state, action) => {
      state.myInfo = action.payload;
    },
    [fetchMyUserInfo.rejected]: () => {
      alert("ユーザー情報の取得に失敗しました。");
    },
    [updateMyRecord.rejected]: (state, action) => {
      alert("投稿データの作成に失敗しました。");
    },
    [deleteUserRecord.fulfilled]: (state, action) => {
      state.myRecords = action.payload;
    },
    [deleteUserRecord.rejected]: (state, action) => {
      alert("投稿の削除に失敗しました");
    },
    [sendPostComment.fulfilled]: (state, action: PayloadAction<SendCommentsData>) => {
      const recordId = action.payload.recordId;
      state.myRecords.find((record) => {
        if (record.recordId === recordId) {
          record.othersComments = action.payload;
          return true;
        }
      });
    },
    [sendPostComment.rejected]: (state, action) => {
      alert("コメントの送信に失敗しました。");
    },
    [updateIsSignin.fulfilled]: (state, action) => {
      state.myInfo.isSignin = false;
    },
  },
});

export const userSelector = (state: RootState) => state.users;
export const userMyInfoSelector = (state: RootState) => state.users.myInfo;
export const userRecordSelector = (state: RootState) => state.users.myRecords;
export const userIsSinginSelector = (state: RootState) => state.users.myInfo.isSignin;
export const userStatisticalDataSelector = (state: RootState) => state.users.myInfo.statisticalData;

export const { reflectRecordData, reflectHeart } = usersSlice.actions;

export default usersSlice.reducer;
