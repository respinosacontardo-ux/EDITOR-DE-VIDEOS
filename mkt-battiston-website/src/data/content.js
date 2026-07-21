export const WHATSAPP_LINK =
  'https://wa.me/5493856456014?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20MKT%20BATTISTON'

export const whatsappLinkFor = (software) =>
  `https://wa.me/5493856456014?text=${encodeURIComponent(
    `Hola, quiero información sobre ${software} de MKT BATTISTON`
  )}`

export const NAV_LINKS = [
  { label: 'INICIO', href: '#inicio' },
  { label: 'VENTAJAS', href: '#ventajas' },
  { label: 'SOFTWARES', href: '#youtube' },
  { label: 'CONTACTO', href: '#contacto' },
]

export const HERO = {
  eyebrow: 'Únicos en Latinoamérica',
  headline: 'MKT BATTISTON',
  subheadline:
    'Software de automatización con Inteligencia Artificial para redes sociales',
  body:
    'Tener nuestros softwares es como tener un equipo de marketing completo trabajando para tu negocio 24/7. Capturá clientes, enviá mensajes masivos, subí contenido y gestioná múltiples cuentas — todo con IA.',
  stats: [
    { value: 24, suffix: '/7', label: 'Operación' },
    { value: 100, suffix: '%', label: 'Automatizado' },
    { value: 5, suffix: '+', label: 'Softwares' },
  ],
}

export const VENTAJAS = {
  eyebrow: 'Por qué elegirnos',
  heading: 'Ventajas de MKT BATTISTON',
  subtext:
    'Automatizá, escalá y dominá las redes sociales de tu negocio con tecnología única en la región.',
  cards: [
    {
      kicker: '10x más rápido',
      title: 'Ahorra Tiempo',
      description:
        'Automatizá tareas repetitivas y dedicá tu tiempo a hacer crecer tu negocio.',
      icon: 'clock',
    },
    {
      kicker: '80% menos costo',
      title: 'Ahorra Dinero',
      description:
        'Reemplazá horas de trabajo manual y equipos enteros por software inteligente.',
      icon: 'coin',
    },
    {
      kicker: '100% automatizado',
      title: 'Presencia 24/7',
      description:
        'Tus redes trabajan por vos todo el día, todos los días, sin descanso.',
      icon: 'infinity',
    },
    {
      kicker: 'N°1 en Latinoamérica',
      title: 'Únicos en LATAM',
      description:
        'Tecnología exclusiva que no vas a encontrar en ningún otro lugar de la región.',
      icon: 'trophy',
    },
  ],
}

export const SOFTWARES = [
  {
    id: 'youtube',
    name: 'Software de YouTube',
    tagline: 'Automatización completa para YouTube',
    accent: '#FF0000',
    visual: 'youtube',
    bullets: [
      'Gestión centralizada de múltiples cuentas',
      'Publicación automática de videos',
      'Siembra de vistas, me gusta y comentarios',
    ],
    specs: [
      {
        category: 'Gestión de cuentas y canales',
        items: [
          'Gestión centralizada de múltiples cuentas de YouTube',
          'Inicio de sesión automático y verificación de estado de cuentas',
          'Administración de canales desde un solo panel',
          'Cambio de avatar, banner y datos del canal en forma masiva',
        ],
      },
      {
        category: 'Publicación de videos',
        items: [
          'Publicación automática de videos en múltiples cuentas',
          'Programación de subidas con horarios personalizados',
          'Títulos, descripciones y etiquetas personalizados por video',
          'Publicación de Shorts y videos largos',
        ],
      },
      {
        category: 'Funciones de siembra',
        items: [
          'Siembra automática de vistas en videos',
          'Siembra de me gusta desde múltiples cuentas',
          'Suscripciones automáticas a canales',
          'Reproducción con tiempos de visualización configurables',
        ],
      },
      {
        category: 'Comentarios y datos',
        items: [
          'Publicación automática de comentarios personalizados',
          'Respuestas automáticas a comentarios',
          'Extracción de datos de videos y canales',
          'Reportes de actividad y resultados de cada cuenta',
        ],
      },
    ],
  },
  {
    id: 'tikpro',
    name: 'TikPro',
    tagline: 'Automatización profesional para TikTok',
    accent: '#22D3EE',
    visual: 'tiktok',
    bullets: [
      'Gestión masiva de cuentas TikTok',
      'Interacción automática: auto-deslizar y comentar',
      'Funciones de siembra (seeding)',
    ],
    specs: [
      {
        category: 'Gestión masiva de cuentas',
        items: [
          'Administración de cientos de cuentas TikTok en simultáneo',
          'Inicio de sesión y verificación automática de cuentas',
          'Actualización masiva de perfiles: foto, nombre y biografía',
          'Organización de cuentas por grupos y etiquetas',
        ],
      },
      {
        category: 'Interacción con la cuenta',
        items: [
          'Auto-deslizar el feed simulando comportamiento humano',
          'Me gusta y comentarios automáticos en videos',
          'Seguimiento y dejar de seguir cuentas automáticamente',
          'Visualización de historias y perfiles',
        ],
      },
      {
        category: 'Siembra (seeding)',
        items: [
          'Siembra de vistas, me gusta y compartidos en tus videos',
          'Comentarios masivos personalizados con IA',
          'Guardado y favoritos automáticos',
          'Impulso de videos propios desde múltiples cuentas',
        ],
      },
      {
        category: 'Funciones virales',
        items: [
          'Publicación automática de videos en múltiples cuentas',
          'Programación de contenido con horarios óptimos',
          'Duetos y participación en tendencias',
          'Uso de hashtags y sonidos virales',
        ],
      },
      {
        category: 'Datos y otras funciones',
        items: [
          'Extracción de datos de usuarios y videos',
          'Filtrado de audiencias por intereses',
          'Reportes detallados de cada acción',
          'Integración con proxies para máxima seguridad',
        ],
      },
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Pro',
    tagline: 'Marketing automatizado en WhatsApp',
    accent: '#25D366',
    visual: 'whatsapp',
    bullets: [
      'Envío masivo de mensajes a números',
      'Gestión de grupos y comunidades',
      'Canales de difusión con administración',
    ],
    specs: [
      {
        category: 'Envío de mensajes',
        items: [
          'Envío masivo de mensajes a listas de números',
          'Mensajes personalizados con nombre y variables',
          'Envío de texto, imágenes, videos y documentos',
          'Velocidad de envío configurable para evitar bloqueos',
        ],
      },
      {
        category: 'Grupos y comunidades',
        items: [
          'Creación y administración masiva de grupos',
          'Agregado automático de miembros a grupos',
          'Envío de mensajes a todos tus grupos',
          'Gestión de comunidades desde un solo panel',
        ],
      },
      {
        category: 'Canales de difusión',
        items: [
          'Creación de canales de difusión',
          'Publicación automática en canales',
          'Administración de suscriptores',
          'Estadísticas de alcance por canal',
        ],
      },
      {
        category: 'Sembrado automático',
        items: [
          'Reacciones automáticas a mensajes y estados',
          'Visualización automática de estados',
          'Interacción programada con contactos',
          'Calentamiento de números nuevos',
        ],
      },
      {
        category: 'Historial y privacidad',
        items: [
          'Historial completo de mensajes enviados',
          'Reportes de entregas y respuestas',
          'Protección de números con rotación inteligente',
          'Copias de seguridad de contactos y chats',
        ],
      },
    ],
  },
  {
    id: 'facebook',
    name: 'Software de Facebook',
    tagline: 'Automatización inteligente para Facebook',
    accent: '#1877F2',
    visual: 'facebook',
    bullets: [
      'Gestión automática de cuentas',
      'Publicación automática en perfil y grupos',
      'Interacción con newsfeed y fanpages',
    ],
    specs: [
      {
        category: 'Gestión de cuentas',
        items: [
          'Administración de múltiples cuentas de Facebook',
          'Inicio de sesión automático y verificación de estado',
          'Organización de cuentas por categorías',
          'Detección y recuperación de cuentas con problemas',
        ],
      },
      {
        category: 'Actualizar información',
        items: [
          'Cambio masivo de foto de perfil y portada',
          'Actualización de nombre, biografía y datos personales',
          'Configuración de privacidad automática',
          'Completado de perfiles para mayor confianza',
        ],
      },
      {
        category: 'Publicación',
        items: [
          'Publicación automática en el perfil',
          'Publicación masiva en grupos de Facebook',
          'Publicación en fanpages administradas',
          'Programación de contenido con texto, imágenes y videos',
        ],
      },
      {
        category: 'Interacción automática',
        items: [
          'Me gusta y reacciones automáticas en el newsfeed',
          'Comentarios automáticos personalizados',
          'Compartir publicaciones automáticamente',
          'Interacción con fanpages y grupos',
        ],
      },
      {
        category: 'Interacción con amigos',
        items: [
          'Envío automático de solicitudes de amistad',
          'Aceptación automática de solicitudes',
          'Mensajes de bienvenida a nuevos amigos',
          'Interacción con publicaciones de amigos',
        ],
      },
      {
        category: 'Sincronización y seguridad',
        items: [
          'Sincronización de datos entre cuentas',
          'Uso de proxies para proteger cada cuenta',
          'Simulación de comportamiento humano',
          'Copias de seguridad automáticas',
        ],
      },
    ],
  },
  {
    id: 'instagram',
    name: 'Software de Instagram',
    tagline: 'Dominá Instagram con IA',
    accent: '#E1306C',
    visual: 'instagram',
    bullets: [
      'Gestión automática de cuentas',
      'Publicación automática en el perfil',
      'Interacción con feed, Reels y DMs',
    ],
    specs: [
      {
        category: 'Gestión de cuentas',
        items: [
          'Administración de múltiples cuentas de Instagram',
          'Inicio de sesión automático y verificación de estado',
          'Actualización masiva de perfiles: foto, nombre y biografía',
          'Organización de cuentas por grupos',
        ],
      },
      {
        category: 'Publicación',
        items: [
          'Publicación automática de fotos y videos en el perfil',
          'Publicación de historias automática',
          'Programación de contenido con horarios personalizados',
          'Descripciones y hashtags generados con IA',
        ],
      },
      {
        category: 'Interacción automática',
        items: [
          'Me gusta y comentarios automáticos en el feed',
          'Seguimiento y dejar de seguir automático',
          'Envío de mensajes directos (DMs) masivos',
          'Respuestas automáticas a mensajes y comentarios',
        ],
      },
      {
        category: 'Instagram Reels',
        items: [
          'Publicación automática de Reels',
          'Interacción con Reels: vistas, me gusta y comentarios',
          'Siembra de reproducciones en tus Reels',
          'Uso de audios y tendencias virales',
        ],
      },
      {
        category: 'Otras características',
        items: [
          'Extracción de seguidores de la competencia',
          'Filtrado de audiencias por intereses',
          'Reportes detallados de actividad',
          'Integración con proxies para máxima seguridad',
        ],
      },
    ],
  },
]

export const COMPARISON = {
  eyebrow: '¿No sabés cuál elegir?',
  heading: 'Encontrá tu software ideal',
  subtext: 'Un resumen rápido según dónde está tu audiencia.',
  rows: [
    {
      id: 'instagram',
      software: 'Software de Instagram',
      red: 'Instagram',
      ideal: 'Marcas, emprendedores e influencers',
      foco: 'Crecimiento de perfil, Reels y DMs',
    },
    {
      id: 'facebook',
      software: 'Software de Facebook',
      red: 'Facebook',
      ideal: 'Negocios locales y ventas en grupos',
      foco: 'Publicación masiva en grupos y fanpages',
    },
    {
      id: 'whatsapp',
      software: 'WhatsApp Pro',
      red: 'WhatsApp',
      ideal: 'Ventas directas y atención a clientes',
      foco: 'Mensajes masivos, grupos y canales',
    },
    {
      id: 'tikpro',
      software: 'TikPro',
      red: 'TikTok',
      ideal: 'Contenido viral y audiencias jóvenes',
      foco: 'Gestión masiva y funciones virales',
    },
    {
      id: 'youtube',
      software: 'Software de YouTube',
      red: 'YouTube',
      ideal: 'Creadores de contenido y video marketing',
      foco: 'Publicación de videos y siembra',
    },
  ],
}

export const FINAL_CTA = {
  heading: 'Automatizá tus redes sociales hoy',
  subtext:
    'Contanos qué negocio tenés y te ayudamos a elegir el software ideal, sin compromiso.',
  button: 'Quiero hablar con un asesor',
}

export const FOOTER = {
  tagline: 'Software de automatización con IA para redes sociales',
  copyright: '© 2026 MKT BATTISTON. Todos los derechos reservados.',
}
