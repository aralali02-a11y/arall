import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => {
    console.log(`Kullanıcı bağlandı: ${socket.id}`);

    // Herkesi standart "sinema-odasi"na dahil edelim
    socket.join('sinema-odasi');

    // Video senkronizasyonu
    socket.on('video-komut', (data) => {
        socket.to('sinema-odasi').emit('video-komut-al', data);
    });

    // WebRTC Sinyalleşmesi (Odadaki diğer kişiye ilet)
    socket.on('webrtc-offer', (offer) => {
        socket.to('sinema-odasi').emit('webrtc-offer', offer);
    });

    socket.on('webrtc-answer', (answer) => {
        socket.to('sinema-odasi').emit('webrtc-answer', answer);
    });

    socket.on('webrtc-candidate', (candidate) => {
        socket.to('sinema-odasi').emit('webrtc-candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log(`Kullanıcı ayrıldı: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu çalışıyor port: ${PORT}`);
});