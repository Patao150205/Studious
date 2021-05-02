import { auth, db, FirebaseTimestamp, GitHubProvider, TwitterProvider } from "../firebase/firebaseConfig";
import { initialState, updateCurrnetUser, updateUserProfile, UserState } from "./features/usersSlice";

export const signUpWithEmailPassword = (
  email: string,
  dispatch: any,
  password: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(async (snapshot) => {
      const user = snapshot.user;
      if (user === null) {
        throw new Error("ユーザ情報を取得できませんでした。");
      }
      const timestamp = FirebaseTimestamp.now();
      const data = {
        ...initialState,
        uid: user.uid,
        email: user.email ?? "",
        created_at: timestamp as any,
        updated_at: timestamp as any,
      };

      data.created_at = timestamp.toDate().toLocaleString();
      data.updated_at = timestamp.toDate().toLocaleString();
      const isNewUser = snapshot.additionalUserInfo?.isNewUser;

      await db.collection("users").doc(user.uid).set(data, { merge: true });
      dispatch(updateCurrnetUser(data));
    })
    .catch((err) => {
      if (err.code === "auth/email-already-in-use") {
        setTitle("メールアドレスエラー");
        setMessage("errメールアドレスが既に使用されています。別のアドレスを使用してください。");
        setIsOpen(true);
      } else {
        setTitle("通信エラー");
        setMessage(`${err.code}\n${err.message}`);
        setIsOpen(true);
      }
    });
};

export const signInWithEmailPassword = (
  email: string,
  dispatch: any,
  password: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  toggleOpen: () => void
) => {
  auth
    .signInWithEmailAndPassword(email, password)
    .then(async (snapshot) => {
      const user = snapshot.user;
      console.log("こんにちは！");
      if (user === null) {
        throw new Error("ユーザ情報を取得できませんでした。");
      }
      const res = await db.collection("users").doc(user.uid).get();
      const data = res.data() as UserState;
      dispatch(updateCurrnetUser(data));
    })
    .catch((err) => {
      setTitle("通信エラーが発生しました。");
      setMessage(err.message);
      toggleOpen();
    });
};

export const SignInWithTwitter = (
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  toggleOpen: () => void,
  dispatch: any
): void => {
  auth
    .signInWithPopup(TwitterProvider)
    .then((result) => {
      const user = result.user;
      if (user === null) {
        throw new Error("ユーザ情報を取得できませんでした。");
      }
      const TwitterUser = result.additionalUserInfo;
      const timestamp = FirebaseTimestamp.now();
      const data = {
        ...initialState,
        uid: user.uid,
        username: user.displayName,
        photoURL: user.photoURL,
        created_at: timestamp as any,
        updated_at: timestamp as any,
        sns_path: { twitter: `https://twitter.com/${TwitterUser?.username}`, GitHub: "" },
      };
      data.created_at = timestamp.toDate();
      data.updated_at = timestamp.toDate();

      console.log(data);
      db.collection("users")
        .doc(user.uid)
        .set(data, { merge: true })
        .then(() => {
          // dispatch(uanyetUser(data));
        });
      auth.onAuthStateChanged((user) => {});
    })
    .catch((err) => {
      setTitle("通信エラーが発生しました。");
      setMessage(err.message);
      toggleOpen();
    });
};

export const SignInWithGitHub = (
  dispatch: any,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  toggleOpen: () => void
): void => {
  auth
    .signInWithPopup(GitHubProvider)
    .then((result) => {
      const user = result.user;
      if (user === null) {
        throw new Error("ユーザ情報を取得できませんでした。");
      }
      const GitHubUser: any = result.additionalUserInfo;
      const data = {
        ...initialState,
        uid: user.uid,
        username: GitHubUser.username,
        photoURL: user.photoURL,
        sns_path: { twitter: "", GitHub: GitHubUser.profile.html_url },
        created_at: FirebaseTimestamp.now(),
        updated_at: FirebaseTimestamp.now(),
      } as const;
      db.collection("users")
        .doc(user.uid)
        .set(data)
        .then(() => {
          // dispatch(uanyetUser(user));
        });
      auth.onAuthStateChanged((user) => {});
    })
    .catch((err) => {
      setTitle("通信エラーが発生しました。");
      setMessage(err.message);
      toggleOpen();
    });
};

export const passwordResetWithEmail = (
  email: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      setTitle("メールの送信に成功しました。");
      setMessage("メールを確認して、パスワードのリセットを行ってください。");
      setIsOpen(true);
    })
    .catch((err) => {
      if ("auth/user-not-found") {
        setTitle("メールの送信に失敗しました。");
        setMessage("入力されたメールアドレスに対応したユーザーが存在しません。ユーザーが削除された可能性もあります。");
        setIsOpen(true);
        return;
      }
      setTitle("メールの送信に失敗しました。");
      setMessage(err.message);
      setIsOpen(true);
    });
};
