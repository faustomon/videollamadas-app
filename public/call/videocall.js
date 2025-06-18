class VideollamadasApp {
    constructor() {
        this.socket = io();
        this.localStream = null;
        this.remoteStream = null;
        this.peerConnection = null;
        this.currentRoom = null;
        this.currentUser = null;
        this.isVideoEnabled = true;
        this.isAudioEnabled = true;
        
        this.initializeElements();
        this.setupEventListeners();
        this.setupSocketListeners();
    }

    initializeElements() {
        // Pantallas
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.callScreen = document.getElementById('call-screen');
        
        // Elementos de formulario
        this.usernameInput = document.getElementById('username');
        this.roomIdInput = document.getElementById('room-id');
        this.createRoomBtn = document.getElementById('create-room');
        this.joinRoomBtn = document.getElementById('join-room');
        
        // Videos
        this.localVideo = document.getElementById('local-video');
        this.remoteVideo = document.getElementById('remote-video');
        
        // Controles
        this.toggleVideoBtn = document.getElementById('toggle-video');
        this.toggleAudioBtn = document.getElementById('toggle-audio');
        this.shareScreenBtn = document.getElementById('share-screen');
        this.endCallBtn = document.getElementById('end-call');
        this.copyRoomIdBtn = document.getElementById('copy-room-id');
        
        // Información
        this.currentRoomSpan = document.getElementById('current-room');
        this.currentUserSpan = document.getElementById('current-user');
        this.statusMessages = document.getElementById('status-messages');
    }

    setupEventListeners() {
        this.createRoomBtn.addEventListener('click', () => {
            this.createRoom();
        });

        this.joinRoomBtn.addEventListener('click', () => {
            this.joinRoom();
        });

        this.toggleVideoBtn.addEventListener('click', () => {
            this.toggleVideo();
        });

        this.toggleAudioBtn.addEventListener('click', () => {
            this.toggleAudio();
        });

        this.shareScreenBtn.addEventListener('click', () => {
            this.shareScreen();
        });

        this.endCallBtn.addEventListener('click', () => {
            this.endCall();
        });

        this.copyRoomIdBtn.addEventListener('click', () => {
            this.copyRoomId();
        });

        // Permitir unirse con Enter
        this.roomIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.joinRoom();
            }
        });

        this.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.createRoom();
            }
        });
    }

    setupSocketListeners() {
        this.socket.on('user-connected', (userId) => {
            this.showMessage(`Usuario ${userId} se conectó`, 'success');
            this.createPeerConnection();
            this.createOffer();
        });

        this.socket.on('user-disconnected', (userId) => {
            this.showMessage(`Usuario ${userId} se desconectó`, 'info');
            if (this.remoteVideo.srcObject) {
                this.remoteVideo.srcObject = null;
            }
        });

        this.socket.on('offer', async (offer, userId) => {
            await this.handleOffer(offer, userId);
        });

        this.socket.on('answer', async (answer, userId) => {
            await this.handleAnswer(answer);
        });

        this.socket.on('ice-candidate', async (candidate, userId) => {
            await this.handleIceCandidate(candidate);
        });
    }

    generateRoomId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    async createRoom() {
        const username = this.usernameInput.value.trim();
        if (!username) {
            this.showMessage('Por favor ingresa tu nombre', 'error');
            return;
        }

        const roomId = this.generateRoomId();
        this.currentRoom = roomId;
        this.currentUser = username;
        
        await this.startCall();
    }

    async joinRoom() {
        const username = this.usernameInput.value.trim();
        const roomId = this.roomIdInput.value.trim();
        
        if (!username) {
            this.showMessage('Por favor ingresa tu nombre', 'error');
            return;
        }
        
        if (!roomId) {
            this.showMessage('Por favor ingresa el ID de la sala', 'error');
            return;
        }

        this.currentRoom = roomId;
        this.currentUser = username;
        
        await this.startCall();
    }

    async startCall() {
        try {
            // Obtener medios del usuario
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            
            this.localVideo.srcObject = this.localStream;
            
            // Cambiar a pantalla de llamada
            this.welcomeScreen.classList.add('hidden');
            this.callScreen.classList.remove('hidden');
            
            // Actualizar información
            this.currentRoomSpan.textContent = this.currentRoom;
            this.currentUserSpan.textContent = this.currentUser;
            
            // Unirse a la sala
            this.socket.emit('join-room', this.currentRoom, this.currentUser);
            
            this.showMessage('¡Conectado a la sala!', 'success');
            
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
            this.showMessage('Error al acceder a la cámara o micrófono', 'error');
        }
    }

    createPeerConnection() {
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };

        this.peerConnection = new RTCPeerConnection(configuration);

        // Agregar stream local
        this.localStream.getTracks().forEach(track => {
            this.peerConnection.addTrack(track, this.localStream);
        });

        // Manejar stream remoto
        this.peerConnection.ontrack = (event) => {
            this.remoteStream = event.streams[0];
            this.remoteVideo.srcObject = this.remoteStream;
        };

        // Manejar candidatos ICE
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.socket.emit('ice-candidate', event.candidate, this.currentRoom);
            }
        };
    }

    async createOffer() {
        try {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            this.socket.emit('offer', offer, this.currentRoom);
        } catch (error) {
            console.error('Error al crear oferta:', error);
        }
    }

    async handleOffer(offer, userId) {
        try {
            this.createPeerConnection();
            await this.peerConnection.setRemoteDescription(offer);
            
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            
            this.socket.emit('answer', answer, this.currentRoom);
        } catch (error) {
            console.error('Error al manejar oferta:', error);
        }
    }

    async handleAnswer(answer) {
        try {
            await this.peerConnection.setRemoteDescription(answer);
        } catch (error) {
            console.error('Error al manejar respuesta:', error);
        }
    }

    async handleIceCandidate(candidate) {
        try {
            await this.peerConnection.addIceCandidate(candidate);
        } catch (error) {
            console.error('Error al agregar candidato ICE:', error);
        }
    }

    toggleVideo() {
        this.isVideoEnabled = !this.isVideoEnabled;
        const videoTrack = this.localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = this.isVideoEnabled;
        }
        
        this.toggleVideoBtn.classList.toggle('disabled', !this.isVideoEnabled);
        this.toggleVideoBtn.innerHTML = this.isVideoEnabled ? 
            '<i class="fas fa-video"></i>' : 
            '<i class="fas fa-video-slash"></i>';
    }

    toggleAudio() {
        this.isAudioEnabled = !this.isAudioEnabled;
        const audioTrack = this.localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = this.isAudioEnabled;
        }
        
        this.toggleAudioBtn.classList.toggle('disabled', !this.isAudioEnabled);
        this.toggleAudioBtn.innerHTML = this.isAudioEnabled ? 
            '<i class="fas fa-microphone"></i>' : 
            '<i class="fas fa-microphone-slash"></i>';
    }

    async shareScreen() {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });
            
            const videoTrack = screenStream.getVideoTracks()[0];
            const sender = this.peerConnection.getSenders().find(s => 
                s.track && s.track.kind === 'video'
            );
            
            if (sender) {
                await sender.replaceTrack(videoTrack);
            }
            
            this.localVideo.srcObject = screenStream;
            
            videoTrack.onended = () => {
                this.localVideo.srcObject = this.localStream;
                if (sender) {
                    sender.replaceTrack(this.localStream.getVideoTracks()[0]);
                }
            };
            
            this.showMessage('Compartiendo pantalla', 'success');
        } catch (error) {
            console.error('Error al compartir pantalla:', error);
            this.showMessage('Error al compartir pantalla', 'error');
        }
    }

    endCall() {
        // Detener streams
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        
        // Cerrar conexión peer
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        
        // Limpiar videos
        this.localVideo.srcObject = null;
        this.remoteVideo.srcObject = null;
        
        // Volver a pantalla de bienvenida
        this.callScreen.classList.add('hidden');
        this.welcomeScreen.classList.remove('hidden');
        
        // Limpiar inputs
        this.usernameInput.value = '';
        this.roomIdInput.value = '';
        
        this.showMessage('Llamada terminada', 'info');
    }

    copyRoomId() {
        navigator.clipboard.writeText(this.currentRoom).then(() => {
            this.showMessage('ID de sala copiado al portapapeles', 'success');
        }).catch(() => {
            this.showMessage('Error al copiar ID de sala', 'error');
        });
    }

    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `status-message ${type}`;
        messageElement.textContent = message;
        
        this.statusMessages.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 4000);
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new VideollamadasApp();
}); 