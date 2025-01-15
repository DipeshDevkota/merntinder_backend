const socket= require('socket.io')

const initializeSocket = (server)=>{
const io = socket(server,{
    cors:{
        origin:" http://localhost:5173",
    }
})


io.on("connection",(socket)=>{

    //now you can perform different events 
    socket.on("joinChat",()=>{

    });

    socket.on("sendMessage",()=>{

    });

    socket.on("disconnect",()=>{
        
    })

})
}

module.exports=initializeSocket;