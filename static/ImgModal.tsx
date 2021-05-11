import { DialogContent, Modal, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import Head from "next/head";
import React, { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, EffectCoverflow, Scrollbar } from "swiper";
import { UplodedImg } from "../pages/edit";
SwiperCore.use([Navigation, Pagination, Scrollbar, EffectCoverflow]);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    swiperWrapper: {
      width: "70%",
      // position: "absolute",
      // top: "50%",
      // left: "50%",
      // transform: "translate(-50%, -50%)",
    },
    img: {
      width: "100%",
    },
  })
);

type Props = {
  path: string;
  isOpen: boolean;
  initialSlide: number;
  uploadedImg: UplodedImg[] | null;
  handleOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImgModal: FC<Props> = ({ path, uploadedImg, isOpen, initialSlide, handleOpen }) => {
  const classes = useStyles();
  const Pictures = React.forwardRef((props, ref: any) => (
    <div className={classes.swiperWrapper} ref={ref}>
      <Swiper
        spaceBetween={50}
        navigation={true}
        slidesPerView={1}
        loop
        initialSlide={initialSlide}
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
    <>
      <Head>
        <link rel="stylesheet" href="/styles/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/styles/swiper.css" />
      </Head>
      <div className={classes.root}>
        <Modal open={isOpen} onClose={() => handleOpen(false)} keepMounted>
          <DialogContent>
            <Pictures />
          </DialogContent>
        </Modal>
      </div>
    </>
  );
};

export default ImgModal;
