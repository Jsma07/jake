import React, { useState, useEffect } from "react";
import { Modal, Typography, Button, Divider } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css"; // Asegúrate de que Tailwind CSS esté importado

const ModalAgregarAdicion = ({
  open,
  handleClose,
  title = "",
  adiciones,
  setAdiciones,
}) => {
  const [formData, setFormData] = useState({
    NombreAdiciones: "",
    Precio: "",
    Img: null,
  });

  const [precioError, setPrecioError] = useState(false);
  const [nombreError, setNombreError] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prevData) => ({
        ...prevData,
        Img: file,
      }));
    } else {
      toast.error("Por favor, selecciona un archivo de imagen.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "NombreAdiciones") {
      const isValidName = /^[a-zA-Z0-9\s]+$/.test(value);
      setNombreError(!isValidName);
    }

    if (name === "Precio") {
      const isValidPrice = /^[0-9]+$/.test(value);
      setPrecioError(!isValidPrice);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    return () => {
      if (formData.Img) {
        URL.revokeObjectURL(formData.Img);
      }
    };
  }, [formData.Img]);

  const handleAddAdicion = async () => {
    const { NombreAdiciones, Precio } = formData;

    const existeAdicion = adiciones.some(
      (adicion) => adicion.NombreAdiciones === NombreAdiciones
    );

    if (existeAdicion) {
      toast.error("Ya existe una adición con ese nombre");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/Jackenail/AddAdicion",
        {
          NombreAdiciones,
          Precio,
        }
      );

      setAdiciones((prev) => [...prev, response.data]);
      handleClose();
      toast.success("Adición agregada correctamente");
    } catch (error) {
      toast.error("Error al agregar la adición");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const precio = Number(formData.Precio);
    const nombre = formData.NombreAdiciones;

    if (precio < 5000 || isNaN(precio) || !Number.isInteger(precio)) {
      setPrecioError(true);
      toast.error("El precio debe ser un número entero mayor o igual a 5000.");
      return;
    }

    if (nombreError) {
      toast.error("El nombre solo puede contener letras y números.");
      return;
    }

    const existeAdicion = adiciones.some(
      (adicion) => adicion.NombreAdiciones === nombre
    );
    if (existeAdicion) {
      toast.error("Ya existe una adición con ese nombre");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("NombreAdiciones", nombre);
      formDataToSend.append("Precio", precio);
      if (formData.Img) {
        formDataToSend.append("Img", formData.Img);
      }

      const response = await axios.post(
        "http://localhost:5000/Jackenail/Registraradiciones",
        formDataToSend
      );

      setAdiciones((prevAdiciones) => [...prevAdiciones, response.data]);

      setFormData({
        NombreAdiciones: "",
        Precio: "",
        Img: null,
      });

      setPrecioError(false);
      setNombreError(false);
      handleClose();
      toast.success("Adición guardada correctamente");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Error al enviar el formulario. Por favor, inténtelo de nuevo."
      );
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white text-black rounded-lg shadow-lg p-6 max-w-lg w-full relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 text-gray-700 hover:text-gray-900 transition"
          >
            <CloseIcon />
          </button>
          <Typography variant="h6" gutterBottom className="text-center">
            {title || "Agregar Adición"}
          </Typography>
          <Divider className="mb-4" />
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="font-semibold">Nombre:</span>
              <input
                type="text"
                name="NombreAdiciones"
                value={formData.NombreAdiciones}
                onChange={handleInputChange}
                required
                className={`w-full p-3 border border-gray-300 rounded-md transition ${
                  nombreError ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {nombreError && (
                <p className="text-red-500 text-sm mt-1">
                  El nombre solo puede contener letras y números.
                </p>
              )}
            </label>
            <label className="flex flex-col">
              <span className="font-semibold">Precio:</span>
              <input
                type="number"
                name="Precio"
                value={formData.Precio}
                onChange={handleInputChange}
                required
                className={`w-full p-3 border border-gray-300 rounded-md transition ${
                  precioError ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {precioError && (
                <p className="text-red-500 text-sm mt-1">
                  El precio debe ser un número entero mayor o igual a 5000.
                </p>
              )}
            </label>
            <label className="flex flex-col">
              <span className="font-semibold">Imagen:</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md transition"
              />
              {formData.Img && (
                <img
                  src={URL.createObjectURL(formData.Img)}
                  alt="Vista previa"
                  className="mt-2 w-32 h-32 object-cover rounded-md border border-gray-300"
                />
              )}
            </label>
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="px-6 py-2"
              >
                Guardar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAgregarAdicion;
