import { auth, db, FirebaseTimestamp, GitHubProvider, TwitterProvider } from "../firebase/firebaseConfig";
import { initialState, fetchUserInfo, updateProfile } from "./features/usersSlice";

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
        ...initialState.myProfile,
        uid: user.uid,
        email: user.email ?? "",
        created_at: timestamp as any,
      };
      dispatch(updateProfile(data));
    })
    .catch((err) => {
      switch (err.code) {
        case "auth/email-already-in-use":
          setTitle("メールアドレスエラー");
          setMessage("errメールアドレスが既に使用されています。別のアドレスを使用してください。");
          setIsOpen(true);
          break;
        case "auth/user-not-found":
          setTitle("メールアドレスエラー");
          setMessage(
            "入力されたメールアドレスに対応したユーザーが存在しません。ユーザーが削除された可能性もあります。"
          );
          setIsOpen(true);
          break;
        default:
          setTitle("通信エラー");
          setMessage(`${err.code}\n${err.message}`);
          setIsOpen(true);
          break;
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
      if (user === null) {
        throw new Error("ユーザ情報を取得できませんでした。");
      }
      dispatch(fetchUserInfo(user.uid));
    })
    .catch((err) => {
      switch (err.code) {
        case "auth/user-not-found":
          setTitle("メールアドレスエラー");
          setMessage(
            "入力されたメールアドレスに対応したユーザーが存在しません。ユーザーが削除された可能性もあります。"
          );
          toggleOpen();
          break;
        default:
          setTitle("エラーが発生しました。");
          setMessage(err.message);
          toggleOpen();
      }
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
      const TwitterUser: any = result.additionalUserInfo;
      const isNewUser = TwitterUser.isNewUser;

      if (isNewUser) {
        const timestamp = FirebaseTimestamp.fromDate(new Date(user.metadata.creationTime as string));
        const data = {
          ...initialState.myProfile,
          uid: user.uid,
          username: user.displayName,
          photoURL: user.photoURL,
          created_at: timestamp,
          sns_path: { twitter: `https://twitter.com/${TwitterUser?.username ?? "エラー"}`, GitHub: "" },
        };
        dispatch(updateProfile(data));
      } else {
        dispatch(fetchUserInfo(user.uid));
      }
    })
    .catch((err) => {
      setTitle("エラーが発生しました。");
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
      const isNewUser = GitHubUser.isNewUser;

      if (isNewUser) {
        const timestamp = FirebaseTimestamp.fromDate(new Date(user.metadata.creationTime as string));
        const data = {
          ...initialState.myProfile,
          uid: user.uid,
          username: GitHubUser.username,
          photoURL: user.photoURL,
          sns_path: { twitter: "", GitHub: GitHubUser.profile.html_url },
          created_at: timestamp,
        };
        dispatch(updateProfile(data));
      } else {
        dispatch(fetchUserInfo(user.uid));
      }
    })
    .catch((err) => {
      switch (err.code) {
        case "auth/account-exists-with-different-credential":
          setTitle("メールアドレスエラー");
          setMessage("他の認証方法で、同じメールアドレスを使用しているため同じアドレスを使って、ログインできません。");
          toggleOpen();
          break;
        default:
          setTitle("エラーが発生しました。");
          setMessage(`エラーコード:${err.code}; ${err.message}`);
          toggleOpen();
          break;
      }
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
      switch (err.code) {
        case "auth/user-not-found":
          setTitle("メールの送信に失敗しました。");
          setMessage(
            "入力されたメールアドレスに対応したユーザーが存在しません。ユーザーが削除された可能性もあります。"
          );
          setIsOpen(true);
          break;
        default:
          setTitle("メールの送信に失敗しました。");
          setMessage(err.message);
          setIsOpen(true);
          break;
      }
    });
};
