import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import NavbarClient from "./Navbarclient";
import Footer from "./Footer";
import Catalogo from "./contenido";

const VistaInicial = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/Catalogo'); 
  };

  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [summerCollectionRef, summerCollectionInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  const [product1Ref, product1InView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  const [product2Ref, product2InView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  const [product3Ref, product3InView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  const [product4Ref, product4InView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/masagendados');
        setProductos(response.data); 
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div>
      <NavbarClient />

      <header id="header-hero">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={headerInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, type: "spring", stiffness: 300 }}
        >
          <div className="header-bg">
            <img
              src="https://muchosnegociosrentables.com/wp-content/uploads/2017/10/manicura-haciendo-arreglo-de-manos-2.jpg"
              alt="header-image"
            />
          </div>
          <div className="header-content">
            <h2>
              <span className="bienvenidos-style">
                BIENVENIDOS A UN MUNDO LLENO DE ESTILO.
              </span>
            </h2>
            <br />
            <p className="description">
              Servicios de manicure con estilos únicos y modernos, diseñados
              para resaltar tu belleza y personalidad.
            </p>
            <br></br>
            <button className="button" type="button" onClick={handleButtonClick}>
              <p>
                <i className="bx bxs-right-arrow-circle"></i> Ver servicios
              </p>
            </button>
          </div>
        </motion.div>
      </header>

      <section id="summer-collection">
        <motion.div
          ref={summerCollectionRef} 
          className="container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={summerCollectionInView ? { opacity: 1, scale: 1 } : {}} 
          transition={{ duration: 0.8 }}
        >
          <div className="sc-content">
            <h1>Elegancia en Cada Uña</h1>
            <p className="description">
              Ofrecemos una amplia gama de tratamientos, desde manicuras
              clásicas hasta las últimas tendencias en nail art, utilizando
              productos de alta calidad para garantizar que tus uñas luzcan
              impecables y saludables. En Jake Nails encontrarás servicios
              personalizados que se adaptan a tus gustos y necesidades,
              proporcionando una experiencia de manicure que embellece tus manos
              y te permite relajarte.
            </p>
          </div>
          <motion.div
            className="sc-media"
            whileHover={{ scale: 1.05 }} // Escala la imagen al pasar el cursor
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="sc-media-bg">
              <img
                src="https://cuponassets.cuponatic-latam.com/backendPe/uploads/imagenes_descuentos/106889/4cb1e2bb9c7a6c4aac8a04eb61bcd5398cc5a2c4.XL2.jpg"
                alt="sc-image"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="features">
        <div className="container">
          <div className="feature">
            <i className="bx bxs-star"></i>
            <h3>Calidad Premium</h3>
            <p>
              Ofrecemos los mejores productos para tus uñas, garantizando un
              acabado impecable y duradero. Nuestra selección está diseñada para
              brindar resultados profesionales y una experiencia de manicure
              inigualable.
            </p>
          </div>
          <div className="feature">
            <i className="bx bxs-like"></i>
            <h3>Clientes Satisfechos</h3>
            <p>
              {" "}
              La satisfacción de nuestros clientes es lo más importante para
              nosotros. Nos esforzamos por entender sus necesidades y ofrecer un
              servicio personalizado que garantice una experiencia excelente y
              resultados que superen sus expectativas.
            </p>
          </div>
          <div className="feature">
            <i className="bx bxs-bulb"></i>
            <h3>Innovación y Tendencias</h3>
            <p>
              Nos actualizamos constantemente con las técnicas y tendencias más
              recientes en manicure. Ofrecemos servicios innovadores para que tu
              manicure sea moderno y esté al día con las últimas modas en
              belleza.
            </p>
          </div>
        </div>
      </section>

      <section id="products">
        <div className="container">
          <div className="products-header">
            <h2 ref={headerRef}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                Técnicas de uñas más populares
              </motion.div>
            </h2>
            <p>Estas son las técnicas más populares de nuestro negocio.</p>
          </div>

          {productos.map((producto, index) => (
            <div key={producto.IdServicio} className={`product product-${index + 1}`}>
              <motion.figure
                ref={
                  index === 0
                    ? product1Ref
                    : index === 1
                    ? product2Ref
                    : index === 2
                    ? product3Ref
                    : product4Ref
                }
                initial={{ opacity: 0, y: 20 }}
                animate={
                  (index === 0 && product1InView) ||
                  (index === 1 && product2InView) ||
                  (index === 2 && product3InView) ||
                  (index === 3 && product4InView)
                    ? { opacity: 1, y: 0 }
                    : {}
                }
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <img
                  src={`http://localhost:5000${producto.ImgServicio}`|| 'default-image-url.jpg'}
                  alt={producto.Nombre_Servicio}
                />
                <figcaption>{producto.Nombre_Servicio}</figcaption>
                <figcaption>
                  {new Intl.NumberFormat('es-CO', { 
                    style: 'currency', 
                    currency: 'COP',
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0  
                  }).format(producto.Precio_servicio)}
                </figcaption>
              </motion.figure>
            </div>
          ))}
        </div>
      </section>
      <br /><br />
      
     | <Footer />
    </div>
  );
};

export default VistaInicial;
