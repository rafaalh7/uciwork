# Hook useSearch

Implementación de un hook personalizado para búsquedas en tiempo real con filtrado eficiente.

## Uso
```jsx
const { 
  searchTerm, 
  setSearchTerm, 
  filteredResults, 
  isSearching, 
  isEmpty 
} = useSearch({
  data: Array,      // Datos a buscar
  searchKeys: Array, // Campos a buscar (ej: ['name', 'email'])
  debounceTime: Number // Opcional (default: 300ms)
});



Documentación del Componente
Propiedades
Propiedad	Tipo	Por defecto	Descripción
data	Array	[]	Datos a buscar
searchKeys	Array	[]	Campos para buscar (ej: ['nombre', 'email'])
placeholder	String	'Buscar...'	Texto placeholder del input
debounceTime	Number	300	Tiempo en ms para el debounce
onSelectItem	Function	undefined	Callback al seleccionar un resultado (recibe el item seleccionado)
