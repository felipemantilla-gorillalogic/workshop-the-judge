// ModalPortal.jsx - Componente para renderizar modales en el nivel root
import { createPortal } from 'react-dom';

const ModalPortal = ({ children }) => {
  // Crear un portal que renderice el contenido en el elemento con id "modal-root"
  // Si no existe este elemento, crearlo en el body
  let modalRoot = document.getElementById('modal-root');
  
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }
  
  return createPortal(children, modalRoot);
};

export default ModalPortal;