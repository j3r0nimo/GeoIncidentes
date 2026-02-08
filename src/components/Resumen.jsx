/*        Resumen.jsx. Componente de React 
          que muestra un resumen textual de los incidentes visibles actualmente, 
          mostrando el desglose (detalle), 
          el número total de incidentes (total) 
          y el total de fatalidades (fallecidos).
*/

export default function Resumen({ total, fallecidos, detalle }) {
  return (
    <div className="summary">
      <div dangerouslySetInnerHTML={{ __html: detalle }} />
      <br />
      Incidentes: <strong>{total}</strong><br /> 
      Fallecidos: <strong>{fallecidos}</strong>
    </div>
  );
}
