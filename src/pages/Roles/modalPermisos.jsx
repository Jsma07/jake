import React from "react";
const ModalPermisos = ({ open, handleClose, permisos }) => {
  return (
    <>
      {" "}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          {" "}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-80">
            {" "}
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              {" "}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {" "}
                Permisos{" "}
              </h3>{" "}
              <button
                onClick={handleClose}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                {" "}
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {" "}
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>{" "}
                </svg>{" "}
              </button>{" "}
            </div>{" "}
            <div className="p-6 space-y-6">
              {" "}
              <ul id="permisoList" style={{ textAlign: "center" }}>
                {" "}
                {permisos && Array.isArray(permisos) ? (
                  permisos.map((permiso) => (
                    <li key={permiso.idPermiso}>{permiso.nombre}</li>
                  ))
                ) : (
                  <li>No hay permisos asignados</li>
                )}{" "}
              </ul>{" "}
            </div>{" "}
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              {" "}
              <button
                onClick={handleClose}
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {" "}
                Cerrar{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </>
  );
};
export default ModalPermisos;
