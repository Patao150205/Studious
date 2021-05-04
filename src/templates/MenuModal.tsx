import { createStyles, makeStyles, Modal, Theme } from "@material-ui/core";
import React, { FC } from "react";
import { MainMenu } from "../component/UIkit/organisms";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    modal: {
      minWidth: 320,
      maxWidth: 600,
      width: "100%",
      margin: "0 auto",
      overflow: "scroll",
    },
    icon: {
      [theme.breakpoints.down("sm")]: {
        fontSize: 25,
      },
    },
  })
);

type Props = {
  open: boolean;
  onClose: () => void;
};

const MenuModal: FC<Props> = ({ open, onClose }) => {
  const classes = useStyles();

  return (
    <Modal keepMounted open={open} onClose={() => onClose()} className={classes.modal}>
      <MainMenu />
    </Modal>
  );
};

export default MenuModal;
