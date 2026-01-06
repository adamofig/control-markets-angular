# Creación de Un Agente Especializado con una tarea.

Interactuar con el Mundo moderno es Comunicarse Efectivamente con la IA. 
por lo que debes ser muy conciente del siguiente concepto o estas perdido.

**La ingeniería de prompts:** es el arte de comunicarte efectivamente con modelos de lenguaje grandes (LLM). Piensa en ello como tener un asistente virtual disponible 24/7 en tu computadora, listo para ejecutar tareas repetitivas con consistencia y calidad.

La intención es que la AI haga algún trabajo por ti. La analogía es pensar que tienes un asistente en la vida real sentado en tu casa, en tu computadora, y le pides que se ponga a redactar algo para ti, y lo repita al otro día y al otro día, y así cada vez que lo necesites.

Esta guía te enseñará a crear **flujos de trabajo automatizados** usando un caso práctico: una taquería que necesita contenido constante para redes sociales.

### **🌮 Guía de Ingeniería de Prompts: De Básico a Profesional**

**Escenario:** Eres dueño de una taquería y necesitas aumentar tu clientela. La solución es mayor visibilidad en redes sociales, pero esto requiere **contenido constante y de calidad**.

**Ventaja de los agentes de IA:** No tienes uno, sino infinitos asistentes especializados. Cada uno puede adoptar una personalidad, rol o expertise específica según tus necesidades.

**Tu trabajo crucial:** es **definir la tarea correctamente**. Lamentablemente no puede ser vaga y pobre como *"haz contenido para mi taquería"*. 

> Enfatizo “Definir la tarea correctamente”
> 

Para lograrlo recomiendo lo siguiente

- Escribe en **Markdown** y que tu resultado sea **Markdown**
- Probarlo con varias combinaciones,  siempre agregando más información.
- Pedirle a la AI que te explique como mejorarlo o que lo mejore directamnete.
- Pedirle a la AI que te haga las preguntas para que agregues esa información

Ahora veamos un ejemplo de como podrían ser los prompts. 

## ❌ Prompt Malo (Vago y Sin Contexto)

`Escribe un post sobre tacos al pastor para Instagram.`

**¿Por qué falla?**

- No tiene contexto del negocio
- No especifica tono o audiencia
- No da detalles únicos de TU taquería
- Resultado genérico que cualquier taquería podría usar

---

## ✅ Prompt Profesional (Específico y Contextualizado)

### Contexto de tu negocio

`# CONTEXTO
Eres el creador de contenido para "Tacos El Trompo Dorado", 
una taquería familiar en la Ciudad de México que se especializa 
en tacos al pastor auténticos desde hace 25 años.

# TU MISIÓN
Crear un post educativo e inspiracional para Instagram que 
explique por qué nuestros tacos al pastor son superiores, 
enfocándote en la conexión entre técnica tradicional y sabor.

# ELEMENTOS ÚNICOS DE NUESTRO NEGOCIO
- Usamos carne de cerdo marinada 24 horas en adobo familiar secreto
- Nuestro trompo vertical se cocina con leña de mezquite y carbón
- El maestro taquero tiene 30 años de experiencia
- Cortamos la carne directamente del trompo al momento del pedido
- La grasa que cae del trompo baña constantemente la carne de abajo, 
  creando capas de sabor
- Usamos piña natural que carameliza con el calor del trompo
- Tortillas hechas a mano en el momento

# TONO Y ESTILO
- Apasionado pero educativo
- Cercano y auténtico, no pretencioso
- Usa storytelling, no solo hechos
- Celebra la tradición sin sonar anticuado

# FORMATO DESEADO
- Título llamativo (máximo 8 palabras)
- Post principal: 150-200 palabras
- 3-5 hashtags relevantes
- Call-to-action al final

# ÁNGULO ESPECÍFICO
Enfócate en la ciencia y el arte detrás del trompo: cómo la 
rotación constante, el calor vertical, y la auto-marinación con 
su propia grasa crean un sabor imposible de replicar en una plancha.`

## Ejemplo de salida.

Aqui es opcional pero muy muy poderoso cuando se usa bien. porque en el ejemplo viene oculto  el lenguaje. 

Observa una comparación de las primeras 2 frases con lenguage distinto. 

### AI Promedio

¿Por qué los tacos al pastor saben diferente en cada taquería? 

Mientras el trompo gira, algo mágico sucede: la grasa derretida cae como lluvia sobre las capas inferiores de carne.

### Mexicano Coloquial

La neta, no todos los tacos al pastor son iguales. Y no es mamada.

El pedo está en el trompo, al girar la grasita cae y esa madre hace que  las capas de hasta abajo están más jugosas. 

### Influencer de Polanco.

Ok, tengo que confesar algo,  yo solo iba a taquería "nice” tipo con mezcal artezanal… pero una amiga me enseñó esto y cambio mi vida. 

La carne gira en ese trompo gigante que se ve increíble en stories “by the way” y mientras eso pasa los jugos van cayendo y marinando todo OMG por eso es tan deli! 

Ahora si un ejemplo final, digamos mas neutral. sin parecer AI de como debe responder. 

```jsx
# EJEMPLO DE FORMATO DESEADO

---
**TÍTULO:** [Máximo 8 palabras, debe captar atención]

**CUERPO DEL POST:**
[Párrafo 1: Hook emocional o dato sorprendente - 2-3 líneas]

[Párrafo 2: Storytelling o explicación técnica - 3-4 líneas]

[Párrafo 3: Conexión con el cliente y cierre - 2-3 líneas]

**HASHTAGS:** #hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5

**CALL-TO-ACTION:** [Frase que invite a la acción específica]
```

**TÍTULO:** Los Tacos Que Me Tienen Enganchado

**CUERPO DEL POST:**

No sé ustedes, pero yo ya probé un chingo de taquerías y siempre regreso aquí. ¿Por qué? Porque estos tacos sí saben como deben saber.

El truco está en cómo hacen las cosas. La carne lleva marinándose todo un día antes de que llegue al trompo, con un adobo que llevan haciendo igual desde hace 25 años. Mientras gira, la grasa va escurriendo y bañando toda la carne de abajo—ahí es donde está el sabor cabrón. Le ponen piña arriba que se va quemando despacito y suelta un toque dulce bien rico. Y usan leña de mezquite, entonces todo tiene ese sabor ahumado que no encuentras en cualquier lado.

Don Raúl, el maestro taquero, sabe perfectamente de qué parte cortar según lo que pidas. Lleva 30 años en esto. Te corta el taco al momento, lo pone en tortilla recién hecha, y ya. Así sí da gusto comer.

**HASHTAGS:**
#TacosAlPastor #CDMX #Tacos #ComidaMexicana #TacoTime

**CALL-TO-ACTION:**
Si andas por la zona, párate. Vale totalmente la pena. Llega con hambre porque vas a querer repetir orden. 🌮

### Listo una vez que aprendiste a crear un buen prompt ahora si vamos a crear una tarea y un agente.

## Creación del agente.

Cuando tienes una tarea, cualquier agente puede desempeñar la tarea, pero para este caso, crearemos un agente apasionado y conocedor del tema, con un toque polémico (estrategia efectiva en redes sociales actuales).

Imagen visual. 

Para el caso ficticio y porque en Control Markets los agentes pueden ser lo que quieran. 

Nuestro empleado sera un mapache moderno apasionado por los tacos, Es importarle darle una foto, que también puedes generar con AI. 

La identidad visual te ayuda a:

- Distinguir entre múltiples agentes
- Asociar personalidades con tareas específicas
- Identificar qué agente desempeña mejor cada trabajo

![racoon tacos.png](attachment:1696e0d4-21cf-42b3-b689-c78092717463:racoon_tacos.png)

### Crear nuevo Agente

![image.png](attachment:be4479ad-73ed-4fa6-a2c5-b88100ae6845:image.png)

Dentro de la app crear nuevo agente, 

Esto nos va a llevar a una interfaz, algo complicada por ahora, porque hay muchas opciones por seleccionar, pero tranquilo, solo hay que configurar unas secciones. 

Recorta la imagen,  de preferencia que la cara de tu personaje quede en el centro.

![image.png](attachment:009de8b2-e9fe-4a1e-b00b-3edd2b777da6:image.png)

1. Dale un nombre a la tarjeta de agente “El Mapache Taquero”
2. Ponle el idioma, es Inglés por default
3. Dale un nombre a tu Agente al Personaje “Raconsito”
4. Carga una imagén y recortala a su cara

Y una vez configurado ya lo puedes guardar. 

### Listo ahora vamos a crear la tarea.

Haz click en la tareas y crea una nueva. 

![image.png](attachment:b77d117c-1004-4826-8e17-512abc3d6a2f:image.png)

Las tareas al igual que todo se reconode por su imagen, asi con un taco diferente puedes empezar a reconocer tus variaciones. 

- Post de Intagram.
- Script de Youtube
- Markerting

Etc.

Luego simplemente agrega el prompt. 

### Creación del flujo

Hay que ir a la sección del flujo. 

![image.png](attachment:5a77550b-68a8-4414-88e3-cc3046692c86:image.png)

Aqui en Agents vamos a agregar a el agente. utiliza el buscardor por nombre para que sea más facil. 

En task vamos a agregar la tarea que creaste.

y simplemente es conectar. 

Luego ejecutar con el buton azul o todo el flujo. 

![image.png](attachment:597e8911-9be9-4190-8998-bc740e1daac5:image.png)

La tarea tiene bastantes niveles de inteligencia, rápido, balanceado y inteligente. 

Cado uno consume más tiempo y poder de computo, pero teoricamente regresan un mejor resultado. 

Recomiendo siempre usar rápido o balancedo. 

### Conclusiones.