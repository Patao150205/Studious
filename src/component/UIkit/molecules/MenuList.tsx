import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createStyles, List, ListItem, ListItemIcon, ListItemText, makeStyles, Theme } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { FC, ReactNode, useCallback } from "react";
import { logout } from "../../../Auth";
import { auth } from "../../../../firebase/firebaseConfig";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme: any) =>
  createStyles({
    list: {
      marginTop: "55px",
      paddingBottom: "30px",
      backgroundColor: theme.palette.primary[100],
      [theme.breakpoints.up("sm")]: {
        marginTop: 65,
      },
    },
    headerText: {
      fontSize: 25,
      padding: "20px 0",
      textAlign: "center",
      color: theme.palette.secondary[900],
    },
    icon: {
      color: theme.palette.secondary[500],
    },
  })
);

type ListeItemContent = {
  icon: ReactNode;
  primary: string;
  secondary: string;
  onClick: () => void;
};

type Props = { handleToggle: () => void };

const MenuList: FC<Props> = ({ handleToggle }) => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();

  const uid = auth.currentUser?.uid ?? "エラー";

  const ListItemContents: ListeItemContent[] = [
    {
      icon: <FontAwesomeIcon size="lg" icon={["fas", "user"]} />,
      primary: "プロフィール",
      secondary: "Profile",
      onClick: useCallback(() => {
        router.push("/");
      }, [router]),
    },
    {
      icon: <FontAwesomeIcon size="lg" icon={["fas", "user-edit"]} />,
      primary: "プロフィールの編集",
      secondary: "ProfileEdit",
      onClick: useCallback(() => {
        router.push("/edit");
      }, [router]),
    },
    {
      icon: <FontAwesomeIcon size="lg" icon={["far", "address-book"]} />,
      primary: "学習の記録",
      secondary: "Learning record",
      onClick: useCallback(() => {
        router.push("/record");
      }, [router]),
    },
    {
      icon: <FontAwesomeIcon size="lg" icon={["fas", "edit"]} />,
      primary: "学習記録・投稿の作成",
      secondary: "Create learning record and post",
      onClick: useCallback(() => {
        router.push("/record/edit");
      }, [router]),
    },
    {
      icon: <FontAwesomeIcon size="lg" icon={["fas", "address-book"]} />,
      primary: "全投稿",
      secondary: "All posts",
      onClick: useCallback(() => {
        router.push("/record/allpost");
      }, [router]),
    },
    {
      icon: <FontAwesomeIcon size="lg" icon={["fas", "users"]} />,
      primary: "他の人の投稿＜実装予定＞",
      secondary: "Other people's learning records",
      onClick: useCallback(() => {
        router.push("/record/interaction");
      }, [router]),
    },
    {
      icon: <FontAwesomeIcon size="lg" icon={["fas", "sign-out-alt"]} />,
      primary: "ログアウト",
      secondary: "Logout",
      onClick: useCallback(() => {
        logout(router, uid, dispatch);
      }, [logout, router]),
    },
  ];

  return (
    <>
      <List onClick={handleToggle} subheader={<h2 className={classes.headerText}>Menu</h2>} className={classes.list}>
        {ListItemContents.map((content) => (
          <ListItem key={content.secondary} onClick={content.onClick} button selected divider>
            <ListItemIcon className={classes.icon}>{content.icon}</ListItemIcon>
            <ListItemText primary={content.primary} secondary={content.secondary} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default MenuList;
