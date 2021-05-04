import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createStyles, List, ListItem, ListItemIcon, ListItemText, makeStyles, Theme } from "@material-ui/core";
import React, { FC } from "react";

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

const ListItemContents = [
  {
    icon: <FontAwesomeIcon size="lg" icon={["fas", "address-book"]} />,
    primary: "学習の記録",
    secondary: "Learning Record",
  },
  {
    icon: <FontAwesomeIcon size="lg" icon={["fas", "edit"]} />,
    primary: "学習の記録の作成",
    secondary: "Create learning Record",
  },
  {
    icon: <FontAwesomeIcon size="lg" icon={["fas", "users"]} />,
    primary: "他の人の学習記録を見る",
    secondary: "Other people's learning records",
  },
  { icon: <FontAwesomeIcon size="lg" icon={["fas", "user"]} />, primary: "プロフィール", secondary: "Profile" },
  {
    icon: <FontAwesomeIcon size="lg" icon={["fas", "user-edit"]} />,
    primary: "プロフィールの編集",
    secondary: "ProfileEdit",
  },
];

const MenuList: FC = () => {
  const classes = useStyles();

  return (
    <>
      <List subheader={<h2 className={classes.headerText}>Menu</h2>} className={classes.list}>
        {ListItemContents.map((content) => (
          <ListItem key={content.secondary} button selected divider>
            <ListItemIcon className={classes.icon}>{content.icon}</ListItemIcon>
            <ListItemText primary={content.primary} secondary={content.secondary} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default MenuList;
