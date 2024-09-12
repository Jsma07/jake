import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DetalleCompra = () => {
  const { id } = useParams();
  const [detalleCompra, setDetalleCompra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetalleCompra = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/detallecompras/${id}`);
        setDetalleCompra(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching DetalleCompra:', error);
        setError('Error fetching DetalleCompra');
        setLoading(false);
      }
    };

    fetchDetalleCompra();
  }, [id]);

  const generarPDFCompra = () => {
    if (detalleCompra.length === 0 || !detalleCompra[0].compra) {
      console.error('detalleCompra no tiene la estructura esperada:', detalleCompra);
      return;
    }
  
    const compra = detalleCompra[0];
    const doc = new jsPDF();
    const logoImg = "/jacke.png";
  
    // Encabezado: Logo y Nombre de la Aplicación
    doc.addImage(logoImg, "JPEG", 20, 10, 30, 30);
    doc.setFontSize(16);
    doc.text("Jake Nails", 60, 25);
  
    // Línea separadora
    doc.line(20, 45, 190, 45);
  
    // Fecha y hora de generación del PDF
    const fecha = new Date().toLocaleDateString("es-CO");
    const hora = new Date().toLocaleTimeString("es-CO");
    doc.setFontSize(12);
    doc.text(`Fecha del reporte: ${fecha}`, 140, 20);
    doc.text(`Hora del reporte: ${hora}`, 140, 30);
  
    // Datos de la Compra
    doc.setFontSize(12);
    const title = "Datos de la Compra";
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    const x = (pageWidth - textWidth) / 2; // Calcular la posición X para centrar
    doc.text(title, x, 55);
    
    doc.text(`Fecha: ${compra.compra.fecha_compra}`, 20, 65);
    doc.text(`Descuento: ${compra.compra.descuento_compra}`, 20, 75);
    doc.text(`IVA: ${compra.compra.iva_compra}`, 20, 85);
    doc.text(`Subtotal: ${compra.compra.subtotal_compra}`, 20, 95);
    doc.text(`Total: ${compra.compra.total_compra}`, 20, 105);
    doc.text(`Estado: ${compra.compra.estado_compra}`, 20, 115);
  
    // Título de la tabla
    const tableTitle = "Información del Detalle de los Insumos";
    const tableTitleWidth = doc.getTextWidth(tableTitle);
    const tableTitleX = (pageWidth - tableTitleWidth) / 2;
    doc.setFontSize(12);
    doc.text(tableTitle, tableTitleX, 125);
  
    // Tabla de Insumos
    let y = 135; // Posición inicial para la tabla
    const headers = ["Nombre Insumo", "Precio Unitario", "Cantidad", "Precio Total"];
    const data = compra.insumos.map((insumo) => [
      insumo.NombreInsumos,
      insumo.PrecioUnitario,
      insumo.cantidad_insumo,
      insumo.totalValorInsumos,
    ]);
  
    // Utilizamos autoTable para generar la tabla
    doc.autoTable({
      startY: y,
      head: [headers],
      body: data,
      theme: "grid", // Cambia a 'grid' para tener líneas visibles
      styles: {
        cellPadding: 5,
        valign: 'middle',
        halign: 'center', // Centrar el contenido de las celdas
      },
      headStyles: {
        fillColor: [255, 255, 255], // Color de fondo de los encabezados (blanco)
        textColor: [0, 0, 0], // Color del texto de los encabezados (negro)
        fontSize: 12,
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Color de fondo de las celdas del cuerpo (blanco)
        textColor: [0, 0, 0], // Color del texto de las celdas del cuerpo (negro)
        fontSize: 12,
      },
      margin: { top: 10 }, // Margen superior para la tabla
    });
  
    // Guardar el PDF con un nombre específico
    doc.save(`compra_${compra.idCompra}.pdf`);
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!detalleCompra || detalleCompra.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6">
      <div
        style={{
          paddingTop: "40px",
          margin: "0 auto",
          borderRadius: "30px",
          marginTop: "20px",
          boxShadow: "0 4px 12px rgba(128, 0, 128, 0.25)",
          position: "fixed",
          top: "80px",
          left: "100px",
          width: "calc(63% - 100px)",
          padding: "20px",
        }}
      >
    <h1 className="text-2xl font-bold mb-6">Detalle de compras</h1>
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-6">
      {detalleCompra.map((compra, index) => (
        <div key={index}>
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: compra.insumos.length >= 3 ? "275px" : "auto",
            }}
          >
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 text-center">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Imagen</th>
                  <th scope="col" className="px-6 py-3">Insumo</th>
                  <th scope="col" className="px-6 py-3">Precio Unitario</th>
                  <th scope="col" className="px-6 py-3">Cantidad</th>
                  <th scope="col" className="px-6 py-3">Precio Total</th>
                </tr>
              </thead>
              <tbody>
                {compra.insumos.map((insumo, insumoIndex) => {
                  // Encuentra el detalle correspondiente al insumo
                  const detalle = compra.detallesCompra 
                    ? compra.detallesCompra.find(
                        (detalle) => detalle.IdInsumo === insumo.IdInsumos
                      )
                    : null;

                  const precioUnitario = detalle ? detalle.precio_unitario : insumo.PrecioUnitario;
                  const cantidadInsumo = detalle ? detalle.cantidad_insumo : insumo.cantidad_insumo;
                  const totalValorInsumos = detalle ? detalle.totalValorInsumos : insumo.totalValorInsumos; // Usa 0 como valor por defecto

                  return (
                    <tr
                      key={insumoIndex}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-center"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        <img
                          src={`http://localhost:5000${insumo.imagen}`}
                          alt="Imagen"
                          style={{
                            maxWidth: "100%",
                            width: "3rem",
                            height: "3rem",
                            borderRadius: "50%",
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 flex items-center space-x-4">
                        <span className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                          {insumo.NombreInsumos}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        {precioUnitario}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        {cantidadInsumo}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        {totalValorInsumos}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>


      <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "15px",
            }}
          >
            <div
              className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-12 mt-2 mb-3 mx-2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <a href="/compras">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  style={{
                    fontSize: "25px",
                  }}
                >
                  <i className="bx bx-arrow-back"></i>
                </button>
              </a>
              <button
                type="button"
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                style={{ fontSize: "20px", marginLeft: "10px" }}
                onClick={generarPDFCompra}
              >
                <i className="bx bxs-file-pdf"> PDF</i>
              </button>
            </div>
          </div>

        <div
          style={{
            paddingTop: "10px",
            margin: "0 auto",
            borderRadius: "30px",
            marginTop: "20px",
            boxShadow: "0 4px 12px rgba(128, 0, 128, 0.3)",
            position: "fixed",
            right: "20px",
            top: "80px",
            width: "calc(40% - 100px)",
            padding: "20px",
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Resumen de la Compra</h2>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {detalleCompra.map((compra, index) => (
                  <React.Fragment key={index}>
                    <li className="py-4 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-gray-500"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.75h7.5m-12 12.25h16.5m-16.5 0h16.5M3 8.25l6 5.25 6-5.25"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-800">Fecha:</p>
                        <p className="text-sm text-gray-600">
                          {compra.compra.fecha_compra}
                        </p>
                      </div>
                    </li>
                    <li className="py-4 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-gray-500"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h19.5m-19.5 0h19.5m-18 18h16.5m-16.5 0h16.5"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-800">Descuento:</p>
                        <p className="text-sm text-gray-600">
                          {compra.compra.descuento_compra}
                        </p>
                      </div>
                    </li>
                    <li className="py-4 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-gray-500"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.75h7.5m-12 12.25h16.5m-16.5 0h16.5M3 8.25l6 5.25 6-5.25"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-800">IVA:</p>
                        <p className="text-sm text-gray-600">
                          {compra.compra.iva_compra}
                        </p>
                      </div>
                    </li>
                    <li className="py-4 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-gray-500"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.75h7.5m-12 12.25h16.5m-16.5 0h16.5M3 8.25l6 5.25 6-5.25"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-800">Total:</p>
                        <p className="text-sm text-gray-600">
                           {compra.compra.total_compra}
                        </p>
                      </div>
                    </li>
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleCompra;