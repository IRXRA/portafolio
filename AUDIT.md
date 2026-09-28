# Auditoría técnica y UI/UX

## Hallazgos principales

1. **HTML excesivamente pesado**: el documento incluía un SVG decorativo de miles de nodos y más de 1.400 líneas, elevando el coste de parseo y dificultando mantenimiento.
2. **Animación continua por canvas**: dos superficies se renderizaban con `requestAnimationFrame`; aunque había optimizaciones, el coste no estaba justificado para un portafolio y añadía complejidad, consumo y puntos de fallo.
3. **CSS fragmentado pero no verdaderamente sistemático**: más de 3.000 líneas entre componentes, ilustraciones, animaciones y responsive, con valores repetidos y múltiples reglas específicas difíciles de escalar.
4. **Datos privados en frontend**: el correo receptor estaba en HTML, configuración JavaScript y documentación; cualquier visitante o bot podía leerlo.
5. **Lógica de contacto acoplada a UI**: el módulo generaba enlaces, iconos, endpoint y estados en una sola unidad, mezclando presentación, configuración y transporte.
6. **Tipado no verificable**: el código estaba modularizado, pero sin verificación estática estricta. Errores de nulabilidad/DOM podían llegar a runtime.
7. **Carga visual alta**: el relato hídrico era distintivo, pero competía con la propuesta profesional y reducía jerarquía, especialmente en móvil.
8. **Mensajes largos y repetitivos**: varias secciones explicaban ideas similares (datos, agua, decisiones) sin priorizar evidencia ni lectura ejecutiva.
9. **Formulario demasiado extenso**: demasiados campos para un primer contacto aumentaban fricción y ocupaban un bloque visual desproporcionado.
10. **Build poco expresivo**: copiaba archivos sin validar privacidad, configuración del formulario o contrato de despliegue.

## Refactor aplicado

- Diseño editorial-tech más sobrio, con jerarquía clara, contraste AA y componentes coherentes.
- Hero centrado en propuesta de valor + evidencia técnica, con visual SVG ligero y sin loop de canvas.
- Reducción drástica del DOM y eliminación de animaciones continuas.
- Design tokens para color, espaciado, radios, sombras y layout.
- Breakpoints simples y layout fluido para desktop, tablet y móvil.
- Contacto reducido a WhatsApp, LinkedIn y un formulario de baja fricción.
- Correo receptor eliminado del código fuente. Endpoint invisible inyectable por variable de entorno.
- JavaScript separado por responsabilidad: DOM, navegación, interacciones y contacto.
- `// @ts-check` + `jsconfig.json` en modo `strict`.
- Checks de build para IDs, ARIA, enlaces externos, recursos faltantes y exposición de datos privados.
- Respeto de `prefers-reduced-motion`, foco visible y navegación por teclado.
