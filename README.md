# Macros 2.0 ✍️

Otra forma de contar macros: **escribís lo que comiste como lo decís** y la app lo entiende.

> “200 g de nalga, 2 huevos y una banana” · “1 taza de arroz cocido con 150 de pollo” · “milanesa al horno con ensalada completa”

**👉 App: https://juancjose.github.io/macros-2.0/**

- Parser en español rioplatense, 100% en el navegador: cantidades (números, “dos”, “medio kilo”, “1/2”, “una taza y media”), unidades (g, kg, ml, taza, cda, cdita, feta, unidad, vaso, lata), nombres con errores de tipeo (“pechga de poyo”, “merlusa”) y pistas de cocción (“a la plancha”, “crudo”, “al horno”).
- Cada alimento queda como un chip editable (gramos, crudo/cocido, cambiar alimento).
- 24 platos fitness argentinos armados con alimentos de la tabla.
- **¿Qué me falta hoy?**: según tus objetivos y lo que comiste, sugiere alimentos y gramos para cerrar el día.
- Registro diario por comida + historial de 14 días + backup JSON. PWA, funciona offline.

## Datos
223 alimentos con valores reales de **USDA FoodData Central – SR Legacy** (mismo dataset verificado que [macros-ar](https://github.com/juancjose/macros-ar)). Las porciones (taza, unidad, feta) salen de las medidas de USDA; si un alimento no tiene esa medida, el chip lo marca con ⚠️ para que pongas los gramos.

## Tests
`node tests.js` → suite de frases del parser.
