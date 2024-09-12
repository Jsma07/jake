import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalAdiciones from "../../components/consts/Modalventas";
import Swal from "sweetalert2";
import ServicioSeleccionado from "../../components/consts/SeleccionServicios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Fab from "@mui/material/Fab";

const Registrar = () => {
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [adicionSeleccionada, setAdicionSeleccionada] = useState([]);
  const [adiciones, setAdiciones] = useState([]);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [fechaFactura, setFechaFactura] = useState("");
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  const abrirModal = () => {
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/jackenail/Listar_Empleados"
        );

        // Filtrar empleados para incluir solo aquellos con estado 1 y rol 2
        const empleadosFiltrados = response.data.filter(
          (empleado) => empleado.Estado === 1 && empleado.IdRol === 2
        );

        setEmpleados(empleadosFiltrados);
      } catch (error) {
        console.error("Error al obtener los datos de empleados:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/servicios");
      // Filtrar servicios para incluir solo aquellos con estado 1
      const serviciosFiltrados = response.data.filter(
        (servicio) => servicio.EstadoServicio === 1
      );
      setServicios(serviciosFiltrados);
    } catch (error) {
      console.error("Error fetching servicios:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/jackenail/Listar_Clientes"
        );

        // Filtrar clientes para incluir solo aquellos con estado 1
        const clientesFiltrados = response.data.filter(
          (cliente) => cliente.Estado === 1
        );

        setClientes(clientesFiltrados);
      } catch (error) {
        console.error("Error al obtener los datos de clientes:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const today = new Date();

    // Fecha mínima: 3 días antes del día actual
    const minDateValue = new Date();
    minDateValue.setDate(today.getDate() - 3);
    const minDateStr = minDateValue.toISOString().split("T")[0];

    // Fecha máxima: el día actual
    const maxDateStr = today.toISOString().split("T")[0];

    setMaxDate(maxDateStr);
    setMinDate(minDateStr);
  }, []);

  useEffect(() => {
    const fetchAdiciones = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/Jackenail/Listarventas/adiciones"
        );
        setAdiciones(response.data);
      } catch (error) {
        console.error("Error al obtener las adiciones:", error);
      }
    };

    fetchAdiciones();
  }, []);

  useEffect(() => {
    const calcularTotal = () => {
      const precioServicio = servicioSeleccionado
        ? parseInt(servicioSeleccionado.Precio_Servicio) * 1000
        : 0; // Convertir a número y manejar valores nulos

      const subtotalAdiciones = adicionSeleccionada.reduce(
        (acc, item) => acc + parseFloat(item.Precio), // Convertir a número
        0
      );

      const subtotalCalculado = subtotalAdiciones + precioServicio;
      console.log(subtotalCalculado);
      const totalConDescuento = subtotalCalculado - descuento;
      console.log(totalConDescuento);

      // Eliminando el cálculo del IVA
      setSubtotal(subtotalCalculado);
      setTotalGeneral(totalConDescuento);
    };

    calcularTotal(); // Llamar inicialmente
  }, [servicioSeleccionado, adicionSeleccionada, descuento]);

  const handleServicioChange = (e) => {
    const servicioId = parseInt(e.target.value);
    const servicio = servicios.find((s) => s.IdServicio === servicioId);
    setServicioSeleccionado(servicio);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const servicioElement = event.target.Servicio;
    const empleadoElement = event.target.Empleado;
    const clienteElement = event.target.Cliente;
    const fechaElement = event.target.fecha;
    const descuentoElement = event.target.Descuento;

    if (
      !servicioElement ||
      !empleadoElement ||
      !clienteElement ||
      !fechaElement ||
      !descuentoElement
    ) {
      console.error("Uno o más campos del formulario no están definidos.");
      return;
    }

    const idServicio = parseInt(servicioElement.value);
    const idEmpleado = parseInt(empleadoElement.value);
    const idCliente = parseInt(clienteElement.value);
    const fecha = fechaElement.value;
    const descuento = parseFloat(descuentoElement.value);

    // Asegúrate de que subtotal y totalGeneral estén definidos y calculados
    const ventaData = {
      idServicio,
      idEmpleado,
      IdCliente: idCliente,
      // Eliminando el campo Iva
      Subtotal: subtotal.toFixed(2),
      Fecha: fecha,
      Descuento: descuento,
      Total: totalGeneral.toFixed(2),
      Estado: 1,
    };

    console.log("Datos de la venta:", ventaData);

    try {
      // Registrar la venta
      const ventaResponse = await axios.post(
        "http://localhost:5000/Jackenail/RegistrarVenta",
        ventaData
      );

      console.log("adicionSeleccionada:", adicionSeleccionada);
      console.log("ventaResponse:", ventaResponse);

      const detallesVentaData = adicionSeleccionada.map((adicion) => ({
        Idventa: ventaResponse.data.idVentas,
        IdAdiciones: adicion.IdAdiciones,
      }));

      // Registrar los detalles de venta en una sola solicitud
      const detallesResponse = await axios.post(
        "http://localhost:5000/Jackenail/Detalleregistrar",
        {
          Idventa: ventaResponse.data.idVentas,
          IdAdiciones: detallesVentaData.map((d) => d.IdAdiciones),
        },
        {
          headers: {
            "Content-Type": "application/json", // Asegúrate de usar application/json
          },
        }
      );

      console.log(
        "Detalles de venta registrados con éxito:",
        detallesResponse.data
      );

      // Mostrar notificación de éxito y redireccionar
      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Venta registrada con éxito",
        showConfirmButton: false,
        timer: 1500,
      });

      window.location.href = "/ventas";
    } catch (error) {
      console.error(
        "Error al registrar la venta:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    const obtenerFechaActual = () => {
      const fecha = new Date();
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      const fechaFormateada = fecha.toLocaleDateString("es-ES", options);
      setFechaFactura(fechaFormateada);
    };

    obtenerFechaActual();

    // Actualizar la fecha cada segundo (opcional)
    const intervalo = setInterval(() => {
      obtenerFechaActual();
    }, 1000);

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalo);
  }, []);

  const eliminarAdicion = (idAdicion) => {
    // Filtra las adiciones para eliminar la seleccionada
    const nuevasAdiciones = adicionSeleccionada.filter(
      (adicion) => adicion.IdAdiciones !== idAdicion
    );
    setAdicionSeleccionada(nuevasAdiciones);
  };

  return (
    <section className="content">
      <div
        style={{
          paddingTop: "40px", // Ajuste el padding superior para dar espacio al título
          margin: "0 auto",
          borderRadius: "30px",
          marginTop: "20px",
          boxShadow: "0 4px 12px rgba(128, 0, 128, 0.25)",
          position: "fixed",
          top: "80px",
          left: "100px",
          width: "calc(38% - 100px)",
          padding: "20px",
        }}
      >
        <h1 className="text-2xl font-bold mb-6">Gestión de Ventas</h1>
        <form
          action=""
          name="formulario"
          id="formulario"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div className="form-group mb-4">
            <label
              htmlFor="Servicios"
              className="block text-sm font-medium text-gray-700"
            >
              Servicios
            </label>
            <div className="relative">
              <input type="hidden" name="idventa" id="idventa" />
              <select
                name="Servicio"
                id="Servicio"
                className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
                onChange={handleServicioChange}
                required
              >
                <option value="">Seleccione un Servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio.IdServicio} value={servicio.IdServicio}>
                    <p>
                      {" "}
                      {servicio.Nombre_Servicio +
                        " " +
                        servicio.Precio_Servicio}
                    </p>
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="Empleado">Empleado</label>
            <select
              name="Empleado"
              id="Empleado"
              className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un Empleado</option>
              {empleados.map((empleado) => (
                <option key={empleado.IdEmpleado} value={empleado.IdEmpleado}>
                  {empleado.Nombre} {empleado.Apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="Cliente">Cliente</label>
            <select
              name="Cliente"
              id="Cliente"
              className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un Cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.IdCliente} value={cliente.IdCliente}>
                  {cliente.Nombre} {cliente.Apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                name="fecha"
                className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
                value={fechaFactura}
                disabled
                True
              />
            </div>
            <div>
              <label
                htmlFor="Descuento"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Descuento
              </label>
              <input
                type="number"
                id="Descuento"
                className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
                placeholder="Descuento"
                name="Descuento"
                value={descuento}
                onChange={(e) => setDescuento(parseFloat(e.target.value))}
                required
              />
            </div>
          </div>

          <Fab
            aria-label="add"
            style={{
              border: "0.5px solid grey",
              backgroundColor: "#94CEF2",
              position: "fixed",
              bottom: "16px",
              right: "16px",
              zIndex: 1000,
              cursor: "pointer",
            }}
            type="submit"
          >
            <i class="bx bxs-cart-add" style={{ fontSize: "1.8rem" }}></i>
          </Fab>
        </form>
      </div>

      <div
        style={{
          paddingTop: "10px",
          margin: "0 auto",
          borderRadius: "30px",
          marginTop: "20px",
          boxShadow: "0 4px 12px rgba(128, 0, 128, 0.3)",
          position: "fixed",
          right: "20px", // Alineado a la derecha
          top: "80px",
          width: "calc(65% - 100px)",
          padding: "20px", // Agregado espacio interior para separar los elementos
        }}
      >
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <h3
            style={{ textAlign: "left", fontSize: "23px", fontWeight: "bold" }}
          >
            Factura de venta
          </h3>
        </div>

        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <p>Fecha: {fechaFactura}</p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          <div>Img</div>
          <div>Nombre Adicion</div>
          <div>Precio Adicion</div>
          <div>Acciones</div>
        </div>

        {adicionSeleccionada.map((adicion, index) => (
          <div
            key={index}
            style={{ marginBottom: "10px", position: "relative" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <img
                  src={`http://localhost:5000${adicion.Img}`}
                  alt={adicion.NombreAdiciones}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              </div>
              <div>{adicion.NombreAdiciones}</div>
              <div>${adicion.Precio.toFixed(2)}</div>
              <div
                style={{
                  cursor: "pointer",
                  color: "red",
                  fontSize: "20px",
                  marginLeft: "10px",
                }}
                onClick={() => eliminarAdicion(adicion.IdAdiciones)}
              >
                <i className="bx bx-trash"></i>
              </div>
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: "40px",
            borderTop: "1px solid #ccc",
            paddingTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <div style={{ fontWeight: "bold", marginRight: "20px" }}>
              TOTAL:
            </div>
            <div>{totalGeneral.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ fontWeight: "bold", marginRight: "20px" }}>
              Descuento aplicado:
            </div>
            <div>{descuento.toFixed(2)}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-12 mt-2 mb-3 mx-2">
            <button
              type="button"
              className="bg-pink-200 hover:bg-black-300 focus:ring-4 focus:outline-none focus:ring-black-300 dark:focus:ring-black-800 shadow-lg shadow-black-500/50 dark:shadow-lg dark:shadow-black-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={abrirModal}
              style={{
                alignSelf: "flex-end",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ShoppingCartIcon />{" "}
            </button>
          </div>
        </div>
      </div>

      <div>
        <ModalAdiciones
          open={modalAbierto}
          handleClose={cerrarModal}
          title="Selecciona Adiciones"
          adiciones={adiciones}
          setAdicionesSeleccionadas={setAdicionSeleccionada}
          adicionesSeleccionadas={adicionSeleccionada}
        />
      </div>
    </section>
  );
};
export default Registrar;
