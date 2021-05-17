import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Zoom } from "@material-ui/core";
import React, { forwardRef } from "react";

type Props = {
  children: string;
  isOpen: boolean;
  title: string;
  toggleOpen: () => void;
};

const PrimaryModal = ({ title, children, isOpen, toggleOpen }: Props) => {
  const transition = () => forwardRef((props, ref) => <Zoom in={isOpen} ref={ref} />);
  return (
    <Dialog open={isOpen} keepMounted onClose={toggleOpen}>
      <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleOpen} color="primary">
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrimaryModal;
