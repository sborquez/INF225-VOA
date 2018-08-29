# Valorización de Opciones y Acciones

## Requerimientos

* Node.js
* Node Package Manager (NPM)
* Python 3
* conda (for development)
* Módulos de Python:
  * numpy
  * pandas
  * pandas-datareader
  * beautifulsoup4
  * requests
  * matplotlib

## Uso

Mientras en el directorio raiz, ejecutar en el terminal:

```bash
# instalar dependencias
npm install
# instalar electron-packager globalmente
npm install electron-packager -g
```

Luego, para ejecutar la aplicación

```bash
npm start
```

Y, para compilar en un ejecutable:

```bash
# compilar para todas las plataformas
npm run package-all
# compilar para Windows
npm run package-win
# compilar para Linux
npm run package-linux
# compilar para OS X
npm run package-mac
```