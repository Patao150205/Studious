import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-ui/core";
import React, { FC } from "react";
import { SecondaryButton } from ".";
import { storage } from "../../../../firebase/firebaseConfig";
import { UplodedImg } from "../../../../pages/edit";

type Props = {
  uploadedImg: UplodedImg[] | null;
  setUploadedImg: React.Dispatch<React.SetStateAction<UplodedImg[] | null>>;
};

const UploadPictureButton: FC<Props> = ({ uploadedImg, setUploadedImg }) => {
  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    console.log("patao");
    // uploadedImg.id && storage.ref("usersIcon").child(uploadedImg.id).delete();
    const file = e.target.files ? e.target.files[0] : null;
    // ランダムな１６桁の文字列の生成
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const filename =
      file?.name +
      Array.from(crypto.getRandomValues(new Uint8Array(N)))
        .map((n) => S[n % S.length])
        .join("");
    const uploadRef = storage.ref("postImg").child(filename);
    const uploadedTask = uploadRef.put(file as File);
    uploadedTask
      .then(() => {
        uploadedTask.snapshot.ref.getDownloadURL().then((DownloadURL) => {
          const uploadedFile = { id: filename, path: DownloadURL };
          setUploadedImg((prev: any) => [...prev, uploadedFile]);
        });
      })
      .catch((e) => {
        alert(`ファイルの読み込みに失敗しました。\n ${e.message}`);
      });
  };

  return (
    <>
      <Button component="label" startIcon={<FontAwesomeIcon icon={["fas", "marker"]} />} variant="outlined">
        画像を投稿する
        <input
          id="uploadFileButton"
          hidden
          type="file"
          onChange={(e) => {
            uploadImage(e);
          }}
        />
      </Button>
    </>
  );
};

export default UploadPictureButton;
