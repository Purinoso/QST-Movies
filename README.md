# QST-Movies
Aplicación de Angular con conexión a una API en Grails.

Pasos para la ejecución del programa.
1) Desde la línea de comandos, ejecutar:
   psql createdb qst-movies
2) Desde el directorio raíz de la aplicación de Grails (qst-movies-api), ejecutar:
   grails run-app
3) Desde el directorio raíz de la aplicación de Angular (qst-movies), ejecutar:
   a) npm i
   b) ng serve

En caso de no realizar el paso 2 correctamente, desde el FrontEnd se mostrará una SnackBar con un mensaje indicando que no se realizó la conexión correctamente con la base de datos.
