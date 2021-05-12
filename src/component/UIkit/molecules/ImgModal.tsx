import { DialogContent, Modal, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import React, { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, EffectCoverflow } from "swiper";
import { UplodedImg } from "../../../../pages/edit";
import Head from "next/head";

SwiperCore.use([Navigation, Pagination, EffectCoverflow]);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    swiperWrapper: {
      width: "70%",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
    },
    img: {
      maxWidth: "100%",
      "&:hover": {
        opacity: "0.8",
      },
    },
  })
);

type Props = {
  isOpen: boolean;
  initialSlide: number;
  uploadedImg: UplodedImg[] | null;
  handleOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImgModal: FC<Props> = ({ uploadedImg, isOpen, initialSlide, handleOpen }) => {
  console.log(isOpen);
  const classes = useStyles();
  const Pictures = React.forwardRef((props, ref: any) => (
    <div {...props} ref={ref}>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/6.5.8/swiper-bundle.min.css" />
      </Head>
      <Swiper
        className={classes.swiperWrapper}
        spaceBetween={50}
        slidesPerView={1}
        direction={"horizontal"}
        navigation
        initialSlide={initialSlide}
        loop
        pagination={{ clickable: true }}
        effect="coverflow">
        {uploadedImg?.map((img) => (
          <SwiperSlide key={img.id}>
            <img className={classes.img} src={img.path} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  ));
  return (
    <div>
      <Modal open={isOpen} onClose={() => handleOpen(false)} keepMounted>
        <DialogContent>
          <Pictures />
        </DialogContent>
      </Modal>
    </div>
  );
};

export default ImgModal;
