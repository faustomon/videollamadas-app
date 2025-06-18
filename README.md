# 📹 VideollamadasApp

Una aplicación de videollamadas desarrollada con WebRTC, Node.js y Socket.IO.

## 🌐 Demo en Vivo

🚀 **[Ver aplicación en vivo](https://tu-app.onrender.com)** (se actualizará después del deploy)

## 🚀 Características

- ✅ Videollamadas en tiempo real peer-to-peer
- 🎥 Control de cámara y micrófono
- 🖥️ Compartir pantalla
- 🏠 Salas de reunión con ID único
- 🎨 Interfaz moderna y responsiva
- 🔒 Comunicación segura y cifrada

## 📋 Requisitos

- Node.js 18 o superior
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Cámara y micrófono

## 🛠️ Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/videollamadas-app.git
   cd videollamadas-app
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar la aplicación:**
   ```bash
   npm start
   ```

4. **Abrir en el navegador:**
   - Ve a `http://localhost:3000`

## 📱 Cómo usar

### ✨ **Crear una nueva sala:**
1. Ingresa tu nombre
2. Haz clic en **"Crear Nueva Sala"** 
3. Comparte el ID de la sala con otros participantes

### 🚀 **Unirse a una sala existente:**
1. Ingresa tu nombre
2. Ingresa el ID de la sala
3. Haz clic en **"Unirse a Sala"**

### 🎮 **Controles durante la videollamada:**
- **🎥 Botón azul**: Activar/desactivar cámara
- **🎤 Botón verde**: Activar/desactivar micrófono  
- **🖥️ Botón naranja**: Compartir pantalla
- **☎️ Botón rojo**: Terminar llamada
- **📋 Copiar ID**: Copiar ID de sala al portapapeles

## 🚀 Deploy en Render (Gratuito)

Esta aplicación está configurada para desplegarse automáticamente en Render:

1. Fork este repositorio
2. Conecta tu cuenta de Render con GitHub
3. Crea un nuevo Web Service
4. Selecciona este repositorio
5. ¡Listo! Tu aplicación estará online

### Configuración automática:
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18.x
- **Port**: 3000

## 🏗️ Arquitectura

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Backend**: Node.js con Express
- **WebRTC**: Para comunicación peer-to-peer
- **Socket.IO**: Para señalización en tiempo real
- **STUN servers**: Para NAT traversal

## 🔧 Configuración avanzada

### Variables de entorno (opcionales):
```env
PORT=3000
NODE_ENV=production
```

### Cambiar puerto:
```bash
PORT=8080 npm start
```

## 📝 Notas Técnicas

- La aplicación usa servidores STUN públicos de Google
- Los datos de video/audio se transmiten directamente entre peers (P2P)
- No se almacenan grabaciones ni datos personales
- Compatible con la mayoría de navegadores modernos

## 🔒 Seguridad

- ✅ Todas las comunicaciones WebRTC están cifradas
- ✅ No se requiere registro de usuarios
- ✅ Los IDs de sala son temporales y únicos
- ✅ No se almacenan datos en el servidor
- ✅ HTTPS habilitado en producción

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Siéntete libre de:

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Crear un Pull Request

## 🐛 Reportar Issues

Si encuentras algún problema:
1. Verifica que tu navegador soporte WebRTC
2. Asegúrate de tener permisos de cámara/micrófono
3. Abre un issue en GitHub con detalles

## 📄 Licencia

MIT License - consulta el archivo [LICENSE](LICENSE) para más detalles.

---

**Hecho con ❤️ usando WebRTC y Node.js**

🌟 ¡Si te gusta el proyecto, déjanos una estrella en GitHub! 