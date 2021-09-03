import { createStyles, DialogContent, makeStyles, Modal, Theme } from "@material-ui/core";
import React, { FC } from "react";
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
  handleToggle: () => void;
};

const MenuModal: FC<Props> = ({ open, handleToggle }) => {
  const classes = useStyles();
  const RefMainMenu = React.forwardRef((_, ref) => <MainMenu handleToggle={handleToggle} forwardRef={ref} />);
  return (
    <Modal keepMounted open={open} onClose={handleToggle} className={classes.modal}>
      <DialogContent>
        <RefMainMenu />
      </DialogContent>
    </Modal>
  );
};

export default MenuModal;
