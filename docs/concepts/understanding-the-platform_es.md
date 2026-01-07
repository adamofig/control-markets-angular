# Entendiendo la Plataforma

**Control Markets** es una suite de herramientas diseñadas para automatizar tareas creativas y repetitivas mediante flujos de trabajo inteligentes.

La pieza central de la plataforma es el **Creative FlowBoard** (Tablero Creativo de Flujos). Entender cómo funcionan estos flujos es esencial para dominar la herramienta.

## Secciones de la Plataforma

La plataforma se organiza en varias secciones clave (algunas en etapa Alpha/WIP):

*   **Home (Inicio)**: Un resumen de tus actividades y flujos ejecutados recientemente. *(En desarrollo)*.
*   **Flujos**: El corazón del sistema. Aquí accedes al **Creative FlowBoard** para diseñar y ejecutar tus procesos.
*   **Agentes**: Gestiona tus personalidades de IA. Puedes definir sus rasgos y voces para usarlos en cualquier flujo.
*   **Tareas**: Biblioteca de instrucciones y acciones preconfiguradas que los agentes pueden ejecutar.
*   **Resultados**: Un historial centralizado de las salidas de tus flujos. También puedes verlos directamente en el tablero mediante los nodos de salida.
*   **Fuentes**: Gestiona el conocimiento y contexto (textos, referencias) que alimentarás a tus flujos.
*   **Análisis**: Funcionalidad para analizar videos, extraer información y tomar inspiración. *(En desarrollo)*.
*   **Video Projects**: Herramienta para la creación de videos completos generados por IA. *(En desarrollo)*.

## Funcionamiento General

### Espacios de Trabajo
Cada usuario tiene su propio espacio de ejecución. Sin embargo, Control Markets soporta la creación de **Organizaciones**, lo que permite que múltiples usuarios colaboren en un mismo espacio, compartiendo flujos, agentes y resultados.

### Creative FlowBoard
Para comenzar, simplemente crea un nuevo flujo en la sección correspondiente. 
*   **Agregar Nodos**: En la parte superior del tablero encontrarás botones para añadir los nodos más comunes. Al hacer clic, el nodo aparecerá en el centro del tablero.
*   **Nodos Avanzados**: Existe un botón específico para desplegar la biblioteca completa de nodos disponibles.

### Tipos de Nodos (Categorías por Color)
*   **🟢 Verde (Entrada)**: Nodos que proveen información o identidad, como Agentes, Assets y Fuentes.
*   **🟠 Naranja (Procesamiento)**: Nodos que ejecutan acciones, como Tareas, generación de Audio y Video.
*   **🔵 Azul (Salida)**: Son los resultados generados por los nodos de procesamiento. No se crean manualmente, sino que aparecen como resultado de una ejecución.

## Cómo Conectar Nodos
La magia ocurre al conectar los nodos. Simplemente arrastra la "manija" (punto de conexión) de un nodo y suéltala en la de otro.

Los nodos son inteligentes y cambian su comportamiento según sus conexiones:
*   **Audio + Agente**: El nodo de audio generará el contenido usando la voz específica del agente conectado.
*   **Tarea + Agente**: La tarea no solo se ejecuta, sino que adopta la personalidad y tono del agente. Incluso puedes chatear directamente con el agente sobre esa tarea específica.
