import { createStyles, makeStyles, Modal, Theme } from "@material-ui/core";
import React, { FC, forwardRef } from "react";
import { MainMenu } from "../component/UIkit/organisms";

const useStyles = makeStyles((theme: Theme) =>
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
  const RefMainMenu = React.forwardRef((props, ref) => <MainMenu forwardRef={ref} />);
  return (
    <Modal keepMounted open={open} onClose={() => onClose()} className={classes.modal}>
      <RefMainMenu />
    </Modal>
  );
};

export default MenuModal;
