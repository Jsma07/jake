import React from 'react';

const DashboardCard = ({ title, count, iconClass, onClick }) => {
    return (
        <div style={{ 
            backgroundColor: '#fff7e5', 
            color: 'black', 
            padding: '15px', 
            borderRadius: '12px', 
            width: '200px', // Tamaño fijo para hacerla cuadrada
            height: '100px', // Mismo tamaño de ancho para mantener la forma cuadrada
            textAlign: 'center', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
            transform: 'translateY(-10px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            position: 'relative',
            left: '40px',
        }}
        onClick={onClick}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Aumenta el tamaño al pasar el ratón
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <div style={{ 
                backgroundColor: '#EFD4F5',
                width: '45px', 
                height: '45px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: '100%',
                position: 'absolute', 
                border: '1px solid rgba(0, 0, 0, 0.2)',
                left: '10px' 
            }}>
                <i className={iconClass} style={{ fontSize: '1.5rem', color: 'black' }}></i>
            </div>        
            <div style={{ marginLeft: '45px' }}>
                <p style={{ fontSize: '1.5rem', margin: '0' }}>{title}</p>
                <h2 style={{ fontSize: '1.5rem', margin: '0' }}>{count}</h2>
            </div>
        </div>
    );
};

export default DashboardCard;
