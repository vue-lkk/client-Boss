// 《1》引入客户端IO对象
import io from 'socket.io-client'

// 《2》连接服务器，得到代表连接的socket对象
const socket = io('ws://localhost:5000')
console.log('客户端连接到服务器端：socketio-client connected')

// 《3》发布事件sendMsg，向服务器端发送消息
socket.emit('sendMsg',{name:'Tom',data:Date.now()})
console.log('浏览器端--发送消息到--服务器',{name:'Tom',data:Date.now()})

// 《4》绑定订阅事件receiveMsg，接收服务器端发送过来的消息
socket.on('receiveMsg',function(data) {
    console.log('浏览器端--收到--服务器端的消息：',data)
})

// 《5》在src/index.js中引入
// import '../src/test/socket_test'