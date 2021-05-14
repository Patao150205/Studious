import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-ui/core";
import React, { FC, useCallback } from "react";
import { storage } from "../../../../firebase/firebaseConfig";
import { UplodedImg } from "../../../../pages/edit";
import loadImage from "blueimp-load-image";

type Props = {
  uploadedImg: UplodedImg[] | null;
  setUploadedImg: React.Dispatch<React.SetStateAction<UplodedImg[] | null>>;
};

const UploadPictureButton: FC<Props> = ({ uploadedImg, setUploadedImg }) => {
  const uploadImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      // ランダムな１６桁の文字列の生成
      const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const filename =
        file?.name +
        Array.from(crypto.getRandomValues(new Uint8Array(N)))
          .map((n) => S[n % S.length])
          .join("");
      //画像ファイルの圧縮
      if (file) {
        const canvas: any = await loadImage(file, {
          maxWidth: 400,
          canvas: true,
        });
        canvas.image.toBlob((blob: Blob) => {
          console.log(blob);
          const uploadRef = storage.ref("postImg").child(filename);
          const uploadedTask = uploadRef.put(blob);
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
        });
      }
    },
    [uploadedImg, setUploadedImg]
  );

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
