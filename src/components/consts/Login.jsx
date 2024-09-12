import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/ContextoUsuario";


const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // Estado para visibilidad de la contraseña

  const { login } = useContext(UserContext);

  const validacionContrasena = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validacionContrasena.test(contrasena)) {
      setError(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/iniciarSesion",
        {
          correo,
          contrasena,
        }
      );
      console.log("Respuesta del login:", response.data);

      const token = response.data.token;
      const userData = {
        ...response.data.user,
        token,
      };
      login(userData);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      if (userData.rolId === 4) {
        window.location.href = "/vistaInicio";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.mensaje);
      } else {
        console.error(
          "Error en el inicio de sesión:",
          error.response?.data?.mensaje || "Error en el servidor"
        );
        setError(error.response?.data?.mensaje || "Error en el servidor");
      }
    }
  };

  const validatePassword = (password) => {
    const conditions = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
    };

    return conditions;
  };

  const handleCorreoChange = (e) => {
    const correo = e.target.value.toLowerCase().trim(); // Convertir a minúsculas y eliminar espacios
    setCorreo(correo);
  };

  const handleContrasenaChange = (e) => {
    const contrasena = e.target.value.trim(); // Eliminar espacios
    setContrasena(contrasena);
  };

  const condicionesContrasena = validatePassword(contrasena);
  const todasCondicionesCumplidas = Object.values(condicionesContrasena).every(
    Boolean
  );

  return (
    <div
      style={{
        backgroundImage: "url('/fondo3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 bottom-0 leading-5 h-full w-full overflow-hidden"
    >
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-transparent rounded-3xl shadow-xl">
        <div className="absolute top-0 left-0 p-4">
          <img src="/jacke.png" alt="Logo" className="h-16 rounded-full" />
        </div>
        <div
          style={{
            borderRadius: "25px",
            boxShadow: "0 15px 20px rgba(0, 0, 0, 0.4)",
            backgroundColor: '#F2EBFF',
            border: '0.5px solid gray'
          }}
          className="relative bg-white max-w-md w-full rounded-3xl p-8 z-10"
        >
          <div className="mb-12 text-center">
            <img
              src="/jacke.png"
              alt="Logo"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h3 className=" text-2xl text-gray-800 flex items-center justify-center">
              <i className="bx bx-user-circle text-3xl mr-3"></i>
              Iniciar sesión
            </h3>
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div className="mb-4">
                <label
                  htmlFor="correo"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                >
                  <i
                    className="bx bx-envelope"
                    style={{ fontSize: "20px" }}
                  ></i>
                  Correo Electrónico:
                </label>
                <input
                  style={{ borderRadius: '20px' }}
                  id="correo"
                  className="w-full text-sm px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type="text"
                  placeholder="ejemplo@gmail.com"
                  value={correo}
                  onChange={handleCorreoChange}
                  required
                />
              </div>

              <div className="mb-4 relative">
                <label
                  htmlFor="contrasena"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                >
                  <i className="bx bx-lock" style={{ fontSize: "20px" }}></i>
                  Contraseña:
                </label>
                <input
                  style={{ borderRadius: '20px' }}
                  id="contrasena"
                  className="w-full text-sm px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-purple-400"
                  type={passwordVisible ? "text" : "password"} // Cambiar entre 'text' y 'password'
                  placeholder="************"
                  value={contrasena}
                  onChange={handleContrasenaChange}
                  onFocus={() => setPasswordTouched(true)}
                  required
                />
                <span
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {passwordVisible ? <i className='bx bx-low-vision' style={{marginTop:'25px',fontSize:'25px'}}></i> : <i className='bx bx-show-alt' style={{marginTop:'25px', fontSize:'25px'}}></i>}
                </span>
              </div>

              {passwordTouched && !todasCondicionesCumplidas && (
                <div className="text-sm">
                  <p
                    style={{
                      color: condicionesContrasena.length ? "green" : "red",
                    }}
                  >
                    Mínimo 8 caracteres
                  </p>
                  <p
                    style={{
                      color: condicionesContrasena.uppercase ? "green" : "red",
                    }}
                  >
                    Al menos una mayúscula
                  </p>
                  <p
                    style={{
                      color: condicionesContrasena.number ? "green" : "red",
                    }}
                  >
                    Al menos un número
                  </p>
                </div>
              )}

              <div className="mb-7 text-center">
                {error && <p className="text-red-500">{error}</p>}
              </div>

              <div>
                <button 
                  style={{ borderRadius: '20px' }}
                  type="submit" 
                  className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md py-3 px-4 flex items-center justify-center gap-2 mb-8"
                >
                  Enviar  <i className='bx bx-send' style={{ fontSize: '20px' }}></i>
                </button>
              </div>

              <p className="text-gray-400 text-center">
                ¿No tienes una cuenta?{" "}
                <a
                  href="/registrar"
                  className="text-sm text-purple-700 hover:text-purple-700"
                >
                  Regístrate
                </a>
              </p>
              <p className="text-gray-400 text-center">
                ¿Olvidaste tu contraseña?{" "}
                <a
                  href="/recuperarContrasena"
                  className="text-sm text-purple-700 hover:text-purple-700"
                >
                  Click aquí
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
