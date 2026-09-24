import { useMemo, useState } from 'react';

export function useTabla(datos, opciones = {}) {
  const { campoBusqueda = null, porPaginaInicial = 10 } = opciones;

  const [busqueda, setBusqueda] = useState('');
  const [porPagina, setPorPagina] = useState(porPaginaInicial);
  const [paginaActual, setPaginaActual] = useState(1);

  // Filtrar
  const datosFiltrados = useMemo(() => {
    if (!datos) return [];
    if (!busqueda.trim() || !campoBusqueda) return datos;

    const texto = busqueda.toLowerCase();
    return datos.filter((item) => {
      const valor = item[campoBusqueda];
      return String(valor || '').toLowerCase().includes(texto);
    });
  }, [datos, busqueda, campoBusqueda]);

  // Resetear página cuando cambia la búsqueda o el tamaño
  useMemo(() => {
    setPaginaActual(1);
  }, [busqueda, porPagina]);

  // Cortar por página
  const datosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * porPagina;
    return datosFiltrados.slice(inicio, inicio + porPagina);
  }, [datosFiltrados, paginaActual, porPagina]);

  return {
    datosPaginados,
    totalFiltrado: datosFiltrados.length,
    busqueda,
    setBusqueda,
    porPagina,
    setPorPagina,
    paginaActual,
    setPaginaActual,
  };
}