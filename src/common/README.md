## Formato de mensajes de python hacia electron

Los siguientes mensajes son enviados desde python a electron utilizando simplemente prints
Cada mensaje lleva 3 o 2 argumentos separados por '\\t'.

Para abstraernos del print usaremos la clase Protocol, esta puede enviar tres tipos de mensajes

### Mensajes de estado 
Son mensajes que indican el avance que lleva el script de python en calcular el resultado

    STATUS  Descripcion argumentos

#### Ejemplo
```python
Protocol.sendStatus("Cargando CSV", args["csv"])
```
### Mensajes de error
Son mensajes enviados al encontrarse con errores en los datos o calculos
    
    ERROR descripcion  argumentos_que_causan_error

#### Ejemplo
```python
Protocol.sendError("Formato del CSV invalido", args["csv"])
```

### Mensaje de Resultado
Informa un resultado.

    RESULT value
#### Ejemplo

```python
Protocol.sendResult(value)
```