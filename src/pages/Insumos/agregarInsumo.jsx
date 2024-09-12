
import axios from 'axios';
import Swal from 'sweetalert2';
import CamposObligatorios from '../../components/consts/camposVacios';

const handleAddInsumo = async (formData, handleCloseModalAgregar, fetchInsumos) => {
    try {
        const { NombreInsumos, IdCategoria, Imagen } = formData;

        const camposObligatorios = ["NombreInsumos", "Imagen", "IdCategoria"];
        if (!CamposObligatorios(formData, camposObligatorios, "Por favor, complete todos los campos del insumo.")) {
            return;
        }
        const formDataToSend = new FormData();
        formDataToSend.append("NombreInsumos", NombreInsumos);
        formDataToSend.append("IdCategoria", IdCategoria);
        formDataToSend.append("Imagen", Imagen);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/insumos/guardarInsumo",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Respuesta del servidor:", response.data);

            const confirmation = await Swal.fire({
                title: "¿Estás seguro?",
                text: "¿Quieres agregar este insumo?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, agregar",
                cancelButtonText: "Cancelar",
            });

            if (confirmation.isConfirmed) {
                handleCloseModalAgregar();
                fetchInsumos();
                Swal.fire("Insumo agregado!", "", "success");
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error === 'El nombre del insumo ya está registrado en la base de datos.') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Insumo ya registrado',
                    text: 'El insumo ingresado ya está registrado en la base de datos.',
                });
            } else {
                console.error('Error al agregar insumo:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al agregar insumo',
                    text: 'Ocurrió un error al intentar agregar el insumo. Por favor, inténtelo de nuevo más tarde.',
                });
            }
        }
    } catch (error) {
        console.error('Error al agregar insumo:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.',
        });
    }
}

export default handleAddInsumo;
