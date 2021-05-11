import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Badge, createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { FC } from "react";
import { storage } from "../../../../firebase/firebaseConfig";
import { UplodedImg } from "../../../../pages/edit";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filebtn: {
      display: "none",
      "& > label": {
        position: "relative",
      },
    },
    editIcon: {
      position: "absolute",
      background: theme.palette.primary.light,
      borderRadius: "50%",
      width: 50,
      height: 50,
      top: 130,
      right: 30,
      fontSize: 30,
      cursor: "pointer",
    },
    profileLogo: {
      margin: "0 auto",
      width: 150,
      height: 150,
      objectFit: "cover",
      objectPosition: "center",
      cursor: "pointer",
      "&:hover": {
        opacity: "0.8",
      },
    },
  })
);

type Props = {
  photoURL: string;
  setUploadedImg: (uploadedFile: any) => void;
  uploadedImg: UplodedImg;
};

const EditProfileImg: FC<Props> = ({ photoURL, uploadedImg, setUploadedImg }) => {
  const classes = useStyles();

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadedImg.id && storage.ref("usersIcon").child(uploadedImg.id).delete();
    const file = e.target.files ? e.target.files[0] : null;
    // ランダムな１６桁の文字列の生成
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const filename =
      file?.name +
      Array.from(crypto.getRandomValues(new Uint8Array(N)))
        .map((n) => S[n % S.length])
        .join("");
    const uploadRef = storage.ref("usersIcon").child(filename);
    const uploadedTask = uploadRef.put(file as File);
    uploadedTask
      .then(() => {
        uploadedTask.snapshot.ref.getDownloadURL().then((DownloadURL) => {
          const uploadedFile = { id: filename, path: DownloadURL };
          setUploadedImg(uploadedFile);
        });
      })
      .catch((e) => {
        alert(`ファイルの読み込みに失敗しました。\n ${e.message}`);
      });
  };

  return (
    <label>
      <input
        className={classes.filebtn}
        type="file"
        onChange={(e) => {
          uploadImage(e);
        }}
      />
      <Badge classes={{ badge: classes.editIcon }} badgeContent={<FontAwesomeIcon icon={["fas", "marker"]} />}>
        <Avatar
          src={uploadedImg.path || photoURL || "/noUserImage.jpg"}
          alt="プロフィール画像"
          className={classes.profileLogo}
        />
      </Badge>
    </label>
  );
};

export default EditProfileImg;
