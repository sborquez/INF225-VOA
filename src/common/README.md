## Formato de mensajes de python hacia electron

Los siguientes mensajes son enviados desde python a electron utilizando simplemente prints
Cada mensaje lleva 3 o 2 argumentos separados por '\\t'.
### Mensajes de estado 
Son mensajes que indican el avance que lleva el script de python en calcular el resultado

    STATUS  Descripcion argumentos

#### Ejemplo
```python
print("STATUS", "Cargando CSV", args["csv"], sep="\t")
```
### Mensajes de error
Son mensajes enviados al encontrarse con errores en los datos o calculos
    
    ERROR descripcion  argumentos_que_causan_error

#### Ejemplo
```python
print("ERROR", "Formato del CSV invalido", args["csv"], sep="\t")
```

###} Mensaje de Resultado
Informa el resultado final.

    RESULT value

```python
    print("RESULT", value, sep="\t")
```