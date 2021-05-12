import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebaseConfig";
import { UplodedImg } from "../../pages/edit";
import { HandleDelete } from "../../pages/record";
import { RootState } from "../store";

//Thunk
export const updateMyInfo: any = createAsyncThunk("user/updateMyInfo", async (data: PartialUserInfo, thunk) => {
  const uid = data.uid;
  await db.collection("users").doc(uid).set(data, { merge: true });
  //Redux用にキャストする
  data.created_at && (data.created_at = data.created_at.toDate().toLocaleDateString());
  console.log("1");
  return data;
});

export const fetchMyUserInfo: any = createAsyncThunk("user/fetchMyUserInfo", async (uid: string, thunk) => {
  //uidの未定義による新たなドキュメント作成のエラー回避のための条件分岐
  uid && (await db.collection("users").doc(uid).set({ isSignin: true }, { merge: true }));
  const res = await db.collection("users").doc(uid).get();
  const data: any = res.data();
  data.created_at = data.created_at.toDate().toLocaleDateString();
  return data;
});

export const updateMyRecord: any = createAsyncThunk("user/updateMyRecord", async (data: PartialUserRecord, thunk) => {
  console.log(data);
  if (!data.recordId) {
    const recordRef = db.collection("users").doc(data.uid).collection("userRecords").doc();
    data.recordId = recordRef.id;
    await recordRef.set(data, { merge: true });
  } else {
    data.isNew = false;
    await db.collection("users").doc(data.uid).collection("userRecords").doc(data.recordId).set(data, { merge: true });
  }
  data.created_at = data.created_at.toDate().toLocaleString();
  data.updated_at = data.updated_at.toDate().toLocaleString();
  console.log(data.updated_at);
  return data;
});

export const fetchUserRecord: any = createAsyncThunk("user/fetchUserRecord", async (uid: string, thunk) => {
  const recordRef = db.collection("users").doc(uid).collection("userRecords");
  const postDatas: any = [];
  await recordRef.get().then((res) => {
    res.forEach((ele) => {
      const data = ele.data();
      data.created_at = data.created_at.toDate().toLocaleString();
      data.updated_at = data.updated_at.toDate().toLocaleString();
      postDatas.push(data);
    });
  });
  return postDatas;
});

export const deleteUserRecord: any = createAsyncThunk(
  "user/deleteUserRecord",
  async ({ uid, recordId, newPosts }: HandleDelete, thunk) => {
    await db.collection("users").doc(uid).collection("userRecords").doc(recordId).delete();
    return newPosts;
  }
);

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
  postCount: number;
  sns_path: { twitter: string; GitHub: string };
  statisticalData: { totalTime: number; totalPostDay: number; averageTimePerWeek: number; averageTimePerDay: number };
  target: string;
  uid: string;
  username: string;
};
export type UserRecord = {
  recordId: string;
  created_at: any;
  comment: string;
  doneDate: string;
  learning_content: [{ learningContent: string; hours: number; minutes: number; convertedToMinutes: number }];
  images: UplodedImg[];
  isNew: boolean;
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
    postCount: 0,
    role: "User",
    sns_path: { twitter: "", GitHub: "" },
    statisticalData: { totalTime: 0, totalPostDay: 0, averageTimePerWeek: 0, averageTimePerDay: 0 },
    target: "",
    uid: "",
    username: "",
  },
  myRecords: [
    {
      recordId: "",
      created_at: null,
      comment: "",
      doneDate: "",
      learning_content: [{ learningContent: "", hours: 0, minutes: 0, convertedToMinutes: 0 }],
      images: [],
      isNew: true,
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
  reducers: {},
  extraReducers: {
    [updateMyInfo.fulfilled]: (state, action) => {
      state.myInfo = {
        ...action.payload,
      };
      console.log(state.myInfo);
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
    [updateMyRecord.fulfilled]: (state, action) => {
      if (action.payload.isNew) {
        state.myRecords.push(action.payload);
      } else {
        const data = state.myRecords.map((post) => {
          if (post.recordId === action.payload.recordId) {
            post = action.payload;
          }
          return post;
        });
        state.myRecords = data;
      }
    },
    [updateMyRecord.rejected]: (state, action) => {
      alert("投稿データの作成に失敗しました。");
    },
    [fetchUserRecord.fulfilled]: (state, action) => {
      state.myRecords = action.payload;
    },
    [fetchUserRecord.rejected]: (state, action) => {
      alert("投稿データの取得に失敗しました。");
    },
    [deleteUserRecord.fulfilled]: (state, action) => {
      state.myRecords = action.payload;
    },
    [deleteUserRecord.rejected]: (state, action) => {
      alert("投稿の削除に失敗しました");
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

export const {} = usersSlice.actions;

export default usersSlice.reducer;
