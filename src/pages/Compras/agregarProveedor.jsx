
import axios from 'axios';
import Swal from 'sweetalert2';
import CamposObligatorios from '../../components/consts/camposVacios';


const handleAddProveedor = async (formData, handleCloseModalAgregar, fetchProveedores) => {
    try {
      const { NIT, correo_proveedor, telefono_proveedor, empresa_proveedor } = formData;
      const response = await axios.get('http://localhost:5000/api/proveedores');
      const proveedores = response.data;
      const proveedorExistenteNIT = proveedores.find(proveedor => proveedor.NIT === NIT);
      const proveedorExistenteCorreo = proveedores.find(proveedor => proveedor.correo_proveedor === correo_proveedor);
      const proveedorExistenteTelefono = proveedores.find(proveedor => proveedor.telefono_proveedor === telefono_proveedor);
      const proveedorExistenteEmpresa = proveedores.find(proveedor => proveedor.empresa_proveedor === empresa_proveedor);
  
      const camposObligatorios = ['NIT','nombre_proveedor', 'correo_proveedor', 'telefono_proveedor', 'direccion_proveedor', 'empresa_proveedor'];

      if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos del proveedor.')) {
        return;
      }

      if (proveedorExistenteNIT) {
        window.Swal.fire({
          icon: 'warning',
          title: 'NIT ya registrado',
          text: 'El NIT de la empresa ingresado ya está registrado para otro proveedor.',
        });
        return;
      }
      
      const nit = formData['NIT'];
      if (NIT.length < 9 || NIT.length > 10) {
        window.Swal.fire({
          icon: 'error',
          title: 'NIT de la empresa inválido',
          text: 'Por favor, asegúrate de que el NIT de la empresa tenga minimo 9 dígitos.',
        });
        return;
      }
     
    const telefono = formData['telefono_proveedor'];
      if (telefono.length !== 10) {
        window.Swal.fire({
          icon: 'error',
          title: 'Teléfono inválido',
          text: 'Por favor, asegúrate de que el número de teléfono tenga 10 dígitos.',
        });
        return;
      }

      if (proveedorExistenteCorreo) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Correo ya registrado',
          text: 'El correo electrónico ingresado ya está registrado para otro proveedor.',
        });
        return;
      }
  
      if (proveedorExistenteTelefono) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Teléfono ya registrado',
          text: 'El número de teléfono ingresado ya está registrado para otro proveedor.',
        });
        return;
      }

      if (proveedorExistenteEmpresa) {
        window.Swal.fire({
          icon: 'warning',
          title: 'Empresa ya registrada',
          text: 'La empresa ingresada ya está registrado para otro proveedor.',
        });
        return;
      }

      const confirmation = await window.Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres agregar este proveedor?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
      });

      if (confirmation.isConfirmed) {
        formData.estado_proveedor = 1;
        await axios.post('http://localhost:5000/api/proveedores/guardarProveedor', formData);
        handleCloseModalAgregar();
        fetchProveedores();
        window.Swal.fire('¡Proveedor agregado!', '', 'success');
      }
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
    }

  };
  export default handleAddProveedor;
