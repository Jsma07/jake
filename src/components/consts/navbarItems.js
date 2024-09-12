import PeopleIcon from "@mui/icons-material/People";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import Shopping from "@mui/icons-material/ShoppingCartCheckout";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Calendar from "@mui/icons-material/CalendarMonth";
import BusinessIcon from "@mui/icons-material/AddBusiness";
import CleanHandsIcon from "@mui/icons-material/CleanHands";
import BathtubIcon from "@mui/icons-material/Bathtub";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Diversity2 from "@mui/icons-material/Diversity2";
import StoreIcon from "@mui/icons-material/Store";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";

export const NavbarItems = [
  {
    id: 0,
    icon:<i class='bx bx-line-chart'  style={{fontSize:'27px'}} ></i>,
    label: "Dashboard",
    requiredPermissions: ["Usuarios", "Dashboard"],
    subitems: [
      {
        label: "Gráficas",
        route: "/panel/dashboard",
        icon: (
          <i class='bx bxs-doughnut-chart' style={{ fontSize: "24px" }}></i>
        ),
        requiredPermissions: ["Usuarios", "Dashboard"],
      },
    ],
  },
  {
    id: 1,
    icon: <SettingsSuggestIcon />,
    label: "Configuración",
    requiredPermissions: ["Configuracion"],
    subitems: [
      {
        label: "Roles",
        route: "/configuracion/roles",
        icon: (
          <i className="bx bx-shield-quarter" style={{ fontSize: "24px" }}></i>
        ),
        requiredPermissions: ["Configuracion"],
      },
    ],
  },
  {
    id: 2,
    icon: <PeopleIcon />,
    label: "Usuarios",
    requiredPermissions: ["Usuarios", "Clientes", "Empleados"],
    subitems: [
      {
        label: "Administradores",
        route: "/usuarios/administradores",
        icon: (
          <i className="bx bxs-user-circle" style={{ fontSize: "24px" }}></i>
        ),
        requiredPermissions: ["Usuarios"],
      },
      {
        label: "Empleados",
        route: "/Empleados",
        icon: (
          <i className="bx bxs-user-badge" style={{ fontSize: "24px" }}></i>
        ),
        requiredPermissions: ["Empleados"],
      },
      {
        label: "Clientes",
        route: "/Clientes",
        icon: <PeopleIcon />,
        requiredPermissions: ["Clientes"],
      },
    ],
  },
  {
    id: 3,
    icon: <Shopping />,
    label: "Ventas",
    requiredPermissions: ["Ventas", "SalidaInsumos"],
    subitems: [
      {
        label: "Ventas",
        route: "/ventas",
        icon: <StoreIcon />,
        requiredPermissions: ["Ventas"],
      },
      {
        label: "Sallida insumos",
        route: "/Salida_Insumos",
        icon: <ExitToAppIcon />,
        requiredPermissions: ["SalidaInsumos"],
      },
    ],
  },
  {
    id: 4,
    icon: <BusinessIcon />,
    label: "Compras",
    requiredPermissions: ["Compras", "Proveedores"],
    subitems: [
      {
        label: "Compras",
        route: "/compras",
        icon: <ShoppingBagIcon />,
        requiredPermissions: ["Compras"],
      },
      {
        label: "Proveedores",
        route: "/compras/proveedores",
        icon: <Diversity2 />,
        requiredPermissions: ["Proveedores"],
      },
    ],
  },
  {
    id: 5,
    icon: <Calendar />,
    label: "Agendamiento",
    requiredPermissions: ["Agenda", "Servicios", "Adiciones", "Horario"],
    subitems: [
      {
        label: "Agenda",
        route: "/agendamiento",
        icon: <AccessTimeFilledIcon />,
        requiredPermissions: ["Agenda"],
      },
      {
        label: "Servicios",
        route: "/agendamiento/Servicios",
        icon: <BathtubIcon />,
        requiredPermissions: ["Servicios"],
      },
      {
        label: "Adiciones",
        route: "Adiciones",
        icon: <BathtubIcon />,
        requiredPermissions: ["Adiciones"],
      },
      {
        label: "No Disponibilidad",
        route: "/FechasTrabajadas",
        icon: <AutoDeleteIcon />,
        requiredPermissions: ["Horario"],
        // },{
        //   label: 'Inactivar Horas',
        //   route: '/InactivarHoras',
        //   icon: <HourglassDisabledIcon/>,
        //   requiredPermissions: ['Servicios'],
      },
    ],
  },
  {
    id: 6,
    icon: <InventoryIcon />,
    label: "Insumos",
    requiredPermissions: ["Insumos", "Categorias"],
    subitems: [
      {
        label: "Insumos",
        route: "/Insumos",
        icon: <CleanHandsIcon />,
        requiredPermissions: ["Insumos"],
      },
      {
        label: "Categorias",
        route: "/Insumos/Categorias",
        icon: <CategoryIcon />,
        requiredPermissions: ["Categorias"],
      },
    ],
  },
 
];
