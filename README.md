# Portafolio 3D -Adrian Penagos 24914
[Publicado con GithubPages](https://adrian-24914.github.io/3D_Portfolio/)

## Reflexión

### ¿A qué tipo de audiencia está dirigido?

El portafolio está dirigido más a empresas de videojuegos, empresas de desarrollo 3D, y cualquier persona del mundo tecnológico que valore la creatividad y lo técnico de igual manera. No es un portafolio corporativo, ni está pensado para convencer a grandes empresas que sé hacer CRUDs. Está pensado para alguien que abra el link, vea una escena 3D interactiva inspirada en Dorohedoro, y piense "Este tipo hace cosas raras pero cool". 

Mi apuesta es clara: Si la audiencia correcta lo ve, va a entender de inmediato el nivel de dedicación que requiere modelar todos los assets desde cero, integrarlos en una escena web funcional, y en cima que sea navegable. Si la audiencia equivocada lo ve, probablemente no le importe y eso está bien. 

### ¿Qué tecnologías elegí y por qué? 

**Three.js (WebGL)** Es la tecnología central del proyecto. Querái construir una experiencia en 3D dentro del navegador, y Three.js es la librería más completa y documentada para hacer justo eso. No la había usado antes, así que implicaba aprender desde cero mientras construía todo, lo cual fue el reto principal del proyecto. Elegirlo fue una decisión deliberada que me sacó de mi zona de comfort. 

**GSAP** Lo usé para manejar todas las animaciones de los objetos. El salto de Caiman, los personajes secundarios e incluso el ciclo de colores de las luces. Podría haber manejado las animaciones de manera manual dentro de Three.js pero GSAP hizo que las animaciones fueran más limpias, predecibles y fáciles de realizar. Me ayudó bastante a reducir la carga de animar todo. 

**Vanilla JS y HTML/CSS** Sin frameworks. El proyecto no necesita de gestión de estados complejos ni componentes reutilizables. Una escena 3D con un modal fue lo que manejé con el JS puro, y creo que añadir un framework habría hacho que se creara más fricción entre mis metas. 

**Blender** Aunque no sea una tecnología WEB, todos los assets 3D fueron modelados por mi y es parte integral del proyecto. Creo que intentar encontrar assets genérico habría quitado de la experiencia en lugar de mejorarla. Más con el estilo específico que buscaba. 

### ¿Qué tecnología decidí no usar y por qué?

**Vite** Lo vimos en el curso y entiendo su utilidad para proyectos con módulos complejos y varias dependencias. No quita que para que este proyecto, configurar un bundle iba a añadir una capa de complejidad que no necesitaba. Three.js se puede importar directo desde un CDN con import maps, GSAP también y el proyecto no tiene un pipeline de build que justifique un bundler. Preferí mantener el setup simple para enfocar mi energía en lo que me importaba realmente, la escena y la experiencia. Si es proyecto creciera a múltiples escenas o dependencias más pesadas, sí consideraría usar Vite. 

**React** Lo descarté porque creo que es mejor cuando se utiliza para una UI compleja, estado compartido entre componentes, y muchas interacciones. En el proyecto, el único elemento de UI real es un modal. Además, integrar React con Three.js implicaba usar librerías como React Three Fiber, lo que habría significado para mim aprender dos capas de abstracción al mismo tiempo, cuando mi foco era dominar Three.js directamente. Habría sido complejo*2

### ¿Dónde me arriesgué y dónde la jugué seguro?

Me arriesgué en modelar todos los assets desde cero en blender. Fue la desición que más tiempo me consumió y al inicio el resultado era incierto. Si los modelos quedaban mal o alejados de mi visión, la experiencia visual se caía. También creo que me arriesgué al elegir Three.js como tecnología central sin haberla usado antes, aprendiendo mientras construía. 

La jugué seguro en la arquitectura del código. Vanilla JS, un solo archivo principal. Cuando tengo una tecnología neuva, que ya me exige bastante, no creo que sea el momento de experimentar también con patrones de arquitectura complejos. Mantener el código simple creo que me permitió generar más rápido los resultados que quería. 

## Si tuviera otra semana, ¿qué mejoraría?

Principalmente, dos cosas, el primero sería el apartado de proyectos. Ahorita es solo un modal con texto y un link de Github. Me gustaría que al darle click al objeto aparecieran los proyectos representados como objetos en 3D dando una idea de cómo funcionan. Y el segundo sería tal vez mejorar el rendimiento para dispositivos móviles. La escena no está casi para nada optimizada. Con más tiempo trabajaría en una versión del '.glb' con menos polígonos y también agregaría controles táctiles. 