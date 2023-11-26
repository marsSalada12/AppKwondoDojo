

// Funcion que revisara que los campos de un objeto tengan el tamaño deseado
// data -> es el objeto a revisar
// field -> es un array con las key del objeto a revisar
// Es el tamaño minimo que deben de tener, por defecto es 3
export function checkLenghtData(data, keys, len = 3) {
    try {

        // La funcion "every" nos ayudara a revisar que cada "key" del objeto "data" cumpla con el tamaño 
        const cumpleLength = keys.every(key => data[key].length >= len);

        // Retorna si si cumple o si no cumple con el tamaño
        return cumpleLength;
    }
    catch (error) {

        console.log('Algo fue mal ->', error)
        return false
    }
}