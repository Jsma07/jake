import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";
import "./index.css";
import App from "./App";
import Roles from "./pages/Roles/Roles";
import Admin from "./pages/Administrador/Administradores";
import Usuarios2 from "./pages/Usuarios2/Usuarios2";
import Ventas from "./pages/Ventas/Ventas";
import Verificacion from "./components/consts/VerificarCliente ";

import Cambiarcontraseña from "./components/consts/Cambiarcontraseña";

import Insumos from "./pages/Insumos/Insumos";
import Categorias from "./pages/Insumos/Categorias";
import Compras from "./pages/Compras/Compras";
import CrearCompra from "./pages/Compras/crearCompra";
import Agenda from "./pages/Agendamiento/Agenda";
import Login from "./components/consts/Login";
import Proveedores from "./pages/Compras/Proveedores";
import CrearCuenta from "./components/consts/Register";
import Servicios from "./pages/Agendamiento/Servicios/Servicios";
import Salida from "./pages/Salida_Insumos/Salida";
import Registrarsalida from "./pages/Salida_Insumos/Registrarsalida";
import Clientes from "./pages/Clientes/Clientes";
import Empleados from "./pages/Empleados/Empleados";
import Registrar from "./pages/Ventas/Registrar";
import InsumoDetalle from "./pages/Ventas/Detalles";
import Contendioitems from "./components/consts/VIewClients/contenido";
import VistaInicial from "./components/consts/VIewClients/vistaInicial";
import Adiciones from "./pages/Adiciones/ListarAdiciones";
import DetalleCompra from "./pages/Compras/DetalleCompra";
import { UserProvider } from "./context/ContextoUsuario";
import CrearCita from "./pages/Agendamiento/CrearCita";
import FechasTrabajo from './pages/Agendamiento/FechaTrabajo';
import Panel from './pages/Panel/dashboard';
// import InactivarHoras from "./pages/Agendamiento/InactivarHoras";
import Contrasena from "./components/consts/recuperarContrasena";
import PrivateRoute from "./context/verificarSesion";
import SolicitarCita from "./components/consts/VIewClients/solicitarCita";
import ListarCitas from "./components/consts/VIewClients/ListarCitas/ListarCitas";
import Codigo from "./pages/Clientes/Codigo";
import NuevaContrasena from "./pages/Clientes/nuevaContrasena"
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/recuperarContrasena" element={<Contrasena />} />
          <Route path="/codigo" element={<Codigo />} />
          <Route path="/nuevaContrasena" element={<NuevaContrasena />} />

          <Route path="/iniciarSesion" element={<Login />} />
          <Route path="/Registrar" element={<CrearCuenta />} />
          <Route path="/Catalogo" element={<Contendioitems />} />
          <Route path="/vistaInicio" element={<VistaInicial />} />
          <Route path="/solicitarCita" element={
            <PrivateRoute requiredPermissions={["AgendaCliente"]}>
            <SolicitarCita />
           </PrivateRoute>
            } />
          <Route path="/misCitas" element={
 <PrivateRoute requiredPermissions={["AgendaCliente"]}>
 <ListarCitas />
</PrivateRoute>
          }/>


        <Route path="/" element={<App />}>
        <Route
              index
              element={
                <Navigate to="/panel/dashboard" />
              }
            />
              <Route
              path="/panel/dashboard"
              element={
                <PrivateRoute requiredPermissions={["Dashboard"]}>
                  <Panel />
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracion/roles"
              element={
                <PrivateRoute requiredPermissions={["Configuracion"]}>
                  <Roles />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/Usuarios/Administradores"
              element={
                <PrivateRoute requiredPermissions={["Usuarios"]}>
                  <Admin />
                </PrivateRoute>
              }
            />
            <Route
              path="/ventas"
              element={
                <PrivateRoute requiredPermissions={["Ventas"]}>
                  <Ventas />
                </PrivateRoute>
              }
            />
            <Route path="/Adiciones" 
             element={
              <PrivateRoute requiredPermissions={["Adiciones"]}>
                <Adiciones />
              </PrivateRoute>
            }
            />
            <Route path="/compras" 
             element={
              <PrivateRoute requiredPermissions={["Compras"]}>
                <Compras />
              </PrivateRoute>
            }
            />
            <Route path="/compras/Proveedores" 
             element={
              <PrivateRoute requiredPermissions={["Proveedores"]}>
                <Proveedores />
              </PrivateRoute>
            }
            />
            <Route path="/compras/crearCompra" 
             element={
              <PrivateRoute requiredPermissions={["Compras"]}>
                <CrearCompra />
              </PrivateRoute>
            }
            />
            <Route
              path="/compras/DetalleCompra/:id"
              element={
                <PrivateRoute requiredPermissions={["Compras"]}>
                  <DetalleCompra />
                </PrivateRoute>
              }
            />
            <Route path="/Insumos/Categorias" 
             element={
              <PrivateRoute requiredPermissions={["Categorias"]}>
                <Categorias />
              </PrivateRoute>
            }
            />
            <Route path="/agendamiento" 
             element={
              <PrivateRoute requiredPermissions={["Agenda"]}>
                <Agenda />
              </PrivateRoute>
            }
            />
            <Route path="/FechasTrabajadas" element={
<PrivateRoute requiredPermissions={["Agenda"]}>
<FechasTrabajo />
</PrivateRoute>
            }/>

            <Route path="/Salida_Insumos" 
             element={
              <PrivateRoute requiredPermissions={["SalidaInsumos"]}>
                <Salida />
              </PrivateRoute>
            }
            />
            <Route path="/Registrarsalida" 
             element={
              <PrivateRoute requiredPermissions={["SalidaInsumos"]}>
                <Registrarsalida />
              </PrivateRoute>
            }
            />
            <Route path="/Clientes"
             element={
              <PrivateRoute requiredPermissions={["Clientes"]}>
                <Clientes />
              </PrivateRoute>
            }
            />
            <Route path="/Insumos" 
             element={
              <PrivateRoute requiredPermissions={["Insumos"]}>
                <Insumos />
              </PrivateRoute>
            }
            />
            <Route path="/agendamiento/Servicios" 
             element={
              <PrivateRoute requiredPermissions={["Servicios"]}>
                <Servicios />
              </PrivateRoute>
            }
            />
            <Route path="/Empleados" 
             element={
              <PrivateRoute requiredPermissions={["Empleados"]}>
                <Empleados />
              </PrivateRoute>
            }
            />
            <Route path="/RegistrarVentas" 
             element={
              <PrivateRoute requiredPermissions={["Ventas"]}>
                <Registrar />
              </PrivateRoute>
            }
            />
            <Route path="/Detalleventa/:id" 
             element={
              <PrivateRoute requiredPermissions={["Ventas"]}>
                <InsumoDetalle />
              </PrivateRoute>
            }
            />
           


            <Route path="/RegistrarAgendamiento" 
           element={
            <PrivateRoute requiredPermissions={["Agenda"]}>
              <CrearCita />
            </PrivateRoute>
          }
           />
          </Route>

          
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
