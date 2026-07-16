// Empuja eventos a la capa de datos de Google Tag Manager (dataLayer).
// GTM ya está inicializado en _app.tsx; aquí solo publicamos eventos que se
// disparan por interacciones del usuario (clics, envío de formulario, etc.).

export type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

// Seguro en SSR: sin `window` (build/servidor) no hace nada.
export const pushDataLayer = (event: DataLayerEvent): void => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
};
