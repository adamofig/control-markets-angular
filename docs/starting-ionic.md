### What to do? 

Ionic adds a web layers, 

En este documento se describe que hacer para publicar y tu app con Ionic, utilizando la startup template. 

### Entiende Como vas a desarrollar 

### Ionic Vs Capacitor? 

urd es ellel puente, el enteoorno de ejecuci​ón para que se convierntta en aplicaci​'ón web.

Ionic agrega además una capa de UI, son componentes  diseñados para tener una buena experiencia movil 

Asi que exitien 2 Librerías CLI: y cada una tiene sus mejoras, para desarrollador he notado que a veces conviene usar una y a veces otra. 

Obiamente si el comando inicia con cap, es capacitor, si no puede iniciar con ionic cap [comando] es de ionic. 

### Primer comando util   

`ionic cap run android -l --external`

ejecuta el proyecto en android, -l es live que si cambias el código refresca automaticamente y --external para correr  en emulador o telephono. 

Instalar y firmar el apk: 

npm run android:dev

Necesitas hacer esto para que la autentificación con google sea valida. 

### Problemas no reconociendo android? 

`adb devices -l`



Este problema me sucede todo el tiempo, siento que no es estable. 

Reiniciar el telefono casi siempre funciona. 

quitar los permisos de debug y volverlos a poner. 