import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Notifications from "@mui/icons-material/NotificationsNone";
import { useNavigate } from "react-router-dom";
import SettingsMenu from "./consts/sesion";
import { UserContext } from "../context/ContextoUsuario";
import { motion } from 'framer-motion';
import { NavbarItems } from "./consts/navbarItems";
import ModalPerfil from '../components/consts/perfil'; // Ajusta la ruta si es necesario
import { useState } from 'react';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "white",
  borderRadius: "10px",
  color: "black",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerComponent = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openCategory, setOpenCategory] = React.useState(null);
  const { user, permissions } = React.useContext(UserContext);
  const { logout } = React.useContext(UserContext);

  const handleLogout = () => {
    logout();
    navigate("/iniciarSesion");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleProfileClick = () => {
    setOpenProfileModal(true); // Abrir modal cuando se haga clic en el nombre del usuario
  };

  const handleCloseModal = () => {
    setOpenProfileModal(false); // Cerrar modal
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCategoryClick = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const hasAnyPermission = (requiredPermissions) =>
    requiredPermissions.some((perm) => permissions.includes(perm));

  const filteredNavbarItems = NavbarItems.filter(
    (item) => !item.requiredPermissions || hasAnyPermission(item.requiredPermissions)
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "#FFFEF1" }}>
        <Toolbar>
          {/* Botón de menú */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              backgroundColor: "#FFE0E3",
              "&:hover": {
                backgroundColor: "#F291B5",
                color: "white",
              },
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
  
          {/* Logo de la empresa */}
          <img
            src="/jacke.png"
            alt="logo"
            style={{ width: "48px", height: "48px", marginRight: "16px" }}
          />
  
          {/* Nombre de la empresa */}
          <Typography variant="h6" noWrap component="div">
            Jake Nails
          </Typography>
  
          {/* Margen para empujar los elementos de la derecha */}
          <div style={{ marginLeft: "auto" }}></div>
  
          {/* Nombre del usuario */}
          <Typography
            variant="body1"
            noWrap
            component="div"
            sx={{ marginLeft: "auto", cursor: "pointer", fontWeight: 500, color: "black" }}
            onClick={handleProfileClick}
          >
           <div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '8px' // Ajusta el espacio entre el icono y el texto si es necesario
}}>
  <i className='bx bxs-user-circle' style={{ fontSize: '25px' }}></i>
  <span>
    {user ? `${user.nombre || user.Nombre} ${user.apellido || ''}` : 'Usuario'}
  </span>
</div>

          </Typography>
          <ModalPerfil open={openProfileModal} handleClose={handleCloseModal} />

          {/* <SettingsMenu />*/}
          
        </Toolbar>
      </AppBar>
      
      <DrawerComponent
        variant="permanent"
        open={open}
        classes={{ paper: "drawer-paper" }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
  
        <List>
          {filteredNavbarItems.map((item) => (
            <React.Fragment key={item.id}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 10, duration: 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <ListItem
                  button
                  onClick={() => handleCategoryClick(item.id)}
                  sx={{
                    borderRadius: "10px",
                    backgroundColor:
                      openCategory === item.id ? "#EFD4F5" : "#EFD4F5",
                    mt: 1,
                    "&:hover": {
                      backgroundColor: open ? "#8C09FF" : "#8C09FF",
                      color: open ? "white" : "white",
                      "& .MuiListItemIcon-root .MuiSvgIcon-root": {
                        color: "white !important",
                      },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                  {openCategory === item.id ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </ListItem>
              </motion.div>
              {openCategory === item.id && item.subitems && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <List sx={{ pl: 1, paddingRight: "10px" }}>
                    {item.subitems.filter(subitem => subitem.requiredPermissions.some(perm => permissions.includes(perm)))
                      .map((subitem) => (
                        <ListItem
                          key={subitem.id}
                          button
                          onClick={() => navigate(subitem.route)}
                          sx={{
                            paddingLeft: "15px",
                            paddingRight: "20px",
                            borderRadius: "10px",
                            backgroundColor: "#EFD4F5",
                            mt: 1,
                            "&:hover": {
                              backgroundColor: "#8C09FF",
                              color: "white",
                              "& .MuiListItemIcon-root .MuiSvgIcon-root": {
                                color: "white !important",
                              },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: "40px" }}>
                            {subitem.icon}
                          </ListItemIcon>
                          <ListItemText primary={subitem.label} />
                        </ListItem>
                      ))}
                  </List>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </List>
  
        <Box sx={{ flexGrow: 1 }} />
        <List sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
  <ListItem
    sx={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      padding: 0,
    }}
  >
    <ListItemButton
      onClick={handleLogout}
      sx={{
        justifyContent: 'center',
        backgroundColor: "#EFD4F5",
        color: "black",
        borderRadius: '5px',
        padding: '10px 20px',
        width: '100%',
        maxWidth: '200px',
        textAlign: 'center',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        "&:hover": { 
          backgroundColor: "#FF3B3B",
          color: "white",
          "& .MuiListItemIcon-root": {
            color: "white",
          },
          "& .MuiListItemText-primary": {
            color: "white",
          },
        },
      }}
    >
      <ListItemIcon
        sx={{ minWidth: '40px', display: 'flex', justifyContent: 'center' }}
      >
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText 
        primary="Cerrar sesión" 
        sx={{
          display: open ? 'block' : 'none',
          marginLeft: open ? '16px' : '0',
        }} 
      />
    </ListItemButton>
  </ListItem>
</List>




      </DrawerComponent>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
  
}
