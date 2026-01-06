# Cómo Crear una Tarea

Antes de construir tus flujos de automatización, es esencial entender los tres conceptos principales que impulsan cada interacción en Control Markets: **Tareas**, **Agentes** y **Fuentes**.

---

## 1. ¿Qué es una Tarea?

Una **Tarea** es más que un simple mensaje para ChatGPT. Piénsalo como un **conjunto de instrucciones guardado y reutilizable** que puedes orquestar dentro de un flujo de trabajo más grande. En lugar de escribir la misma solicitud repetidamente, la defines una vez como una Tarea.

### Creando una Gran Tarea (Prompt Engineering)

Para obtener resultados de alta calidad de la IA, tu Tarea debe seguir estos tres principios básicos:

#### 🎯 Instrucciones Concisas
Indica claramente lo que quieres lograr. Evita la ambigüedad. Utiliza verbos directos (ej. "Resume este artículo", "Genera 5 posts para redes sociales").

#### 📝 Formato Markdown
Siempre instruye a la IA para que use Markdown. Esto asegura que la salida esté estructurada y sea legible. Específicamente:
- Usa **tablas** para comparar datos.
- Usa **encabezados** para la jerarquía.
- Usa **citas** para extractos o aspectos importantes.

#### 💡 Proporciona Ejemplos (Few-Shot)
Esta es la forma más poderosa de guiar a la IA. Incluir un "Ejemplo de Salida" en tu prompt es más efectivo que cualquier explicación larga. Muéstrale a la IA exactamente cómo se ve el trabajo "terminado".

---

## 2. El Rol del Agente Personificado

Un **Agente** es efectivamente la "persona" asignada para realizar la Tarea. 

- **Personalidad**: ¿Tu escritor suena como un ejecutivo corporativo o como un influencer creativo de la Generación Z?
- **Experiencia**: ¿La tarea está siendo manejada por un especialista en SEO o por un asesor legal?

Al conectar un Agente a una Tarea, la IA deja de sentirse como un chatbot genérico y comienza a entregar contenido con una voz de marca consistente y profundidad profesional.

---

## 3. El Poder de las Fuentes (Contexto)

Incluso con instrucciones claras, la IA puede volverse repetitiva si carece de datos frescos. Aquí es donde entran las **Fuentes**.

Las **Fuentes** proporcionan la "inspiración" o los "datos" que la Tarea necesita para trabajar.
- **Fuentes Estáticas**: Documentos, PDFs o activos fijos.
- **Fuentes Dinámicas**: Nodos conectados en el lienzo que pasan datos en tiempo real.

Al variar las Fuentes diariamente, aseguras que tu Tarea genere contenido único y consciente del contexto cada vez que se ejecute.

---

## 🚀 Paso a Paso Rápido

1.  **Selecciona un Nodo de Tarea**: En la parte superior selecciona un `TaskNode` y este se agregara al tablero.
2.  **Doble Clic para Configurar**: Abre la vista de detalles y cambia a la pestaña de **Formulario (Form)**.
3.  **Define la Lógica**: Ingresa tu nombre, prompt y selecciona el formato de salida.
4.  **Conecta Agentes y Fuentes**: Une los manejadores `izquierdo` o `superior` de tu Tarea a los nodos de entrada correspondientes.
5.  **Ejecutar y Verificar**: Haz clic en el botón "Run" en la barra de herramientas de acciones para ver tu resultado en la pestaña de **Detalles**.
