# Añadir Fuentes

Las fuentes son módulos de contenido basado en texto que proporcionan el contexto esencial para tus agentes. Actúan como la "base de conocimientos" para tus tareas.

> [!NOTE]
> Actualmente, las fuentes deben proporcionarse manualmente como texto. La extracción automática desde la web u otros archivos externos aún no está soportada.

## ¿Por qué usar Fuentes?

Crear una fuente la hace reutilizable en diferentes **Flujos**. Esto garantiza la consistencia y ahorra tiempo. Puedes gestionar las fuentes de dos maneras:
1.  **Creative FlowBoard**: Añádelas directamente mientras diseñas tu flujo.
2.  **Sección de Fuentes**: Gestiona y organiza todos tus activos de conocimiento en un solo lugar.

## Conectar Fuentes a Tareas

Una vez añadida una fuente, normalmente se conecta a un **Nodo de Tarea**. Esto proporciona el contexto técnico o el material de referencia que la IA necesita para ejecutar la tarea con precisión.

### Mejores Prácticas: Encontrar el Equilibrio
Aunque puedes conectar un número ilimitado de fuentes a un solo Nodo de Tarea, ten cuidado con la **saturación de información**:
*   **Demasiados datos** pueden provocar alucinaciones en el modelo (LLM).
*   **Fuentes contradictorias** confundirán a la IA, resultando en una toma de decisiones deficiente.
*   **Eficiencia**: Busca un contexto de alta calidad y relevancia en lugar de volumen.

## El Resultado
La IA procesa la tarea sintetizando las fuentes conectadas. El resultado suele ser:
*   Contenido redactado para publicaciones o artículos.
*   Entrada para nodos posteriores (por ejemplo, un guion de video para un Nodo VideoGen o un guion de audio).

Las fuentes son una forma sencilla pero potente de fundamentar la creatividad de tu IA en datos reales.
