import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Tüm sitelerin bağlanmasına izin ver (InfinityFree için şart)
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
    console.log(`Bir kullanıcı bağlandı: ${socket.id}`);

    // Video senkronizasyonu
    socket.on('video-komut', (data) => {
        socket.broadcast.emit('video-komut-al', data);
    });

    // WebRTC Ekran Paylaşımı Sinyalleşmesi
    socket.on('webrtc-offer', (offer) => {
        socket.broadcast.emit('webrtc-offer', offer);
    });

    socket.on('webrtc-answer', (answer) => {
        socket.broadcast.emit('webrtc-answer', answer);
    });

    socket.on('webrtc-candidate', (candidate) => {
        socket.broadcast.emit('webrtc-candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log(`Kullanıcı ayrıldı: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu çalışıyor port: ${PORT}`);
});