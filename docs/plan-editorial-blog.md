# Plan editorial del blog · Humanika

**Cadencia:** 2 artículos al mes durante 4 meses, alternando las dos audiencias (empresas y entidades públicas).
**Objetivo:** atraer búsquedas con intención real, enlazar a las fichas y páginas que convierten, y ser citables por buscadores con IA.

## Reglas para cada artículo

Son las mismas del plan SEO y las valida `npm run seo:check` cuando el artículo entra al sitio.

- **Original, no genérico.** Cada artículo parte de experiencia propia: un caso, un proceso de la plataforma o una decisión de diseño. Google premia el contenido «no commodity» y advierte contra los resúmenes de lo que ya existe.
- **La respuesta va primero.** En las primeras 2 frases se dice qué es, para quién y qué resuelve. Eso es lo que citan los snippets y las respuestas de IA.
- **Títulos y descripciones:**
  - Título SEO de 30–60 caracteres, terminado en «| Humanika».
  - Meta descripción de 120–155 caracteres.
  - Un solo H1.
- **Escritura legible:** «usted», frases de 25 palabras como máximo, siglas definidas la primera vez (PQRSD, MGA, MCER) y subtítulos H2 que respondan preguntas.
- **Enlaces:** cada artículo enlaza al menos a 1 ficha de producto y a 1 página de audiencia (`/empresas` o `/entidades-publicas`).
- **Afirmaciones verificables:** solo capacidades que existen en la plataforma. No se mencionan LinkedIn Ads, detección de datos personales, residencia de datos ni cifras sin fuente.
- **Para publicar:**
  1. Crear `public/locales/es/<slug>.json` y `public/locales/en/<slug>.json`.
  2. Crear `src/features/article/data/<slug>.content.ts`.
  3. Añadir la entrada en `articles.registry.ts`, con fecha ISO.

  El sitemap, `llms.txt` y los datos estructurados (BlogPosting) se actualizan solos.
- **Después de publicar:** correr `npm run indexnow -- --send` para avisar a Bing.

## Calendario propuesto

| Mes | Audiencia | Tema y búsqueda principal | Título SEO (≤60) | Meta descripción (120–155) | Enlaza a | Experiencia propia que lo hace original |
|---|---|---|---|---|---|---|
| 1 | Entidades públicas | IA para formulación de proyectos MGA | Formulación de proyectos MGA con IA, paso a paso \| Humanika | Guía práctica para formular y revisar proyectos MGA con IA: árboles de problemas, metas del plan de desarrollo y documentos en plantillas oficiales. | `/productos/proyectos-e-inversion-publica` | Flujo real de la plataforma: chat y formulario sobre el mismo proyecto, autoría IA/persona con evidencia, biblioteca MGA |
| 1 | Empresas | Cómo medir un agente de IA | Cómo medir un agente de IA en producción \| Humanika | Qué métricas mirar cuando un agente de IA ya atiende personas: resolución, escalamiento, uso por canal, costo de los modelos y calidad de las respuestas. | `/plataforma`, `/empresas` | Las métricas del panel de supervisión (conversaciones por canal, resueltas/escaladas, costo por modelo) |
| 2 | Entidades públicas | Software de gestión de PQRSD | Qué es una PQRSD y cómo hacer su seguimiento \| Humanika | Qué es una PQRSD, qué plazos aplican y cómo un agente de IA ayuda a radicar, clasificar, asignar y vigilar vencimientos sin perder trazabilidad. | `/productos/gestion-pqrsd` | Recorrido de un caso real: radicación → clasificación → dependencia → alerta de vencimiento |
| 2 | Empresas | Copiloto de IA para equipos | Copiloto de IA para funcionarios: casos de uso \| Humanika | Cinco usos de un copiloto de IA para funcionarios: consultar normativa, resumir manuales y preparar borradores con referencias a las fuentes. | `/productos/copiloto-para-funcionarios` | Respuestas con referencias a la fuente y borradores para revisión humana |
| 3 | Entidades públicas | IA en el sector público con control humano | IA en entidades públicas con revisión humana \| Humanika | Cómo usar IA en entidades públicas sin perder el control: fuentes autorizadas, trazabilidad, roles y personas que revisan y deciden cada caso. | `/entidades-publicas`, `/plataforma` | Roles y permisos, auditoría, consentimiento por canal y escalamiento a operador |
| 3 | Ambas | Prueba de nivel de inglés adaptativa | Cómo funciona una prueba de inglés adaptativa \| Humanika | Cómo funciona una prueba de clasificación de inglés adaptativa: cinco habilidades, nivel MCER por habilidad y resultados confiables en menos tiempo. | `/productos/ensenanza-de-idiomas` | La CPT: 5 habilidades, nivel MCER por habilidad, resultados en PDF y revisión humana |
| 4 | Entidades públicas | Chatbot para atención ciudadana por WhatsApp | Chatbot de WhatsApp para atención ciudadana \| Humanika | Qué debe tener un chatbot de WhatsApp para atención ciudadana: información oficial, derivación a operadores, consentimiento y medición del servicio. | `/productos/atencion-ciudadana-digital` | Casos de WhatsApp a escala (Corona, Águila, Festival del Pollo) aplicados al servicio público |
| 4 | Entidades públicas | Análisis de pliegos con IA | Cómo revisar pliegos de contratación con IA \| Humanika | Revise pliegos y anexos con IA: identifique requisitos técnicos y documentales, detecte cambios por adendas y arme la matriz con referencias. | `/productos/asistente-de-contratacion-publica` | Matriz de requisitos con referencias verificables y marcado de cambios por adendas |

## Medición (mensual)

- **Google Search Console:** impresiones y clics por artículo, consultas que lo activan e informe de rendimiento en funciones de IA generativa.
- **Bing Webmaster Tools:** informe AI Performance, con las citas en Copilot.
- **Ajustes:** si un artículo tiene muchas impresiones y CTR bajo, se reescriben su título y su descripción; si no aparece en 8 semanas, se revisa la intención de búsqueda.
