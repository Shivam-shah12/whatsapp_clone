import getPrismaInstance from "../utils/PrismaClient.js";
import fs from "fs"

export const addMessage=async (req,res,next)=>{
    try {
        const prisma=getPrismaInstance()
        // const [message,from,to]=req.body;
        const { message, from, to } = req.body;
        // console.log(message);
        // console.log("from : "+from);
        // console.log("to : "+to);
       
        if(message && from && to)
        {
            const newMessages=await prisma.messages.create({
                data:{
                    message,
                    sender:{connect:{id:parseInt(from)}},
                    receiver:{connect:{id:parseInt(to)}},
                    messageStatus:"send"
                },
                include:{sender:true,receiver:true}
            });
            return res.status(201).send({message:newMessages});
        }
        return res.status(400).send("From,to and Message is required")
    } catch (error) {
        console.log(error)
    }
}

export const getMessage=async(req,res,next)=>{
    try {
        const prisma=getPrismaInstance();
        const {from,to}=req.params;
        // console.log(from)
        // console.log(to)
        const messages=await prisma.messages.findMany({
            where:{
                OR:[
                    {
                        senderId:parseInt(from),
                        receiverId:parseInt(to),
                    },
                    {
                        senderId:parseInt(to),
                        receiverId:parseInt(from)
                    }
                ]
            },
            orderBy:{
                id:"asc"
            }
        });
        const unreadMessages=[];
        // console.log(unreadMessages,to);
        messages.forEach((message,index)=>{
            console.log("in the loop "+message,index);
            console.log(message.messageStatus)
            if(message.messageStatus!=="read" && 
            message.receiverId===parseInt(to))
            {
                // console.log("yes");
                messages[index].messageStatus="read";
                unreadMessages.push(message.id);
                // console.log(unreadMessages)
            }
        });

        await prisma.messages.updateMany({
            where:{
                id:{in:unreadMessages},
            },
            data:{
                messageStatus:"read"
            },
        })
        return res.status(200).json({messages})
    } catch (error) {
        console.log(error)
    }
}

export const addDocumentMessage=async(req,res,next)=>{
    console.log("Document api Calls")
    try {
        if(req.file)
        {
            const data=Date.now();
            let fileName="uploads/document/"+data+req.file.originalname;
            fs.renameSync(req.file.path,fileName);
            const prisma=getPrismaInstance();
            const {from,to}=req.query;
            if(from && to)
            {
                const newMessages=await prisma.messages.create({
                    data:{
                        message:fileName,
                        sender:{connect:{id:parseInt(from)}},
                        receiver:{connect:{id:parseInt(to)}},
                        type:"document"
                    },
                })
                return res.status(201).json({newMessages,signal:"successfully save and send the image"});
            }
            return res.status(400).json("from && to are required");
        }
        
        return res.status(400).json("Documents is required");
        

    } catch (error) {
        console.error(error);
    }
}


export const addImageMessage=async(req,res,next)=>{
    try {
        if(req.file)
        {
            const data=Date.now();
            let fileName="uploads/images/"+data+req.file.originalname;
            fs.renameSync(req.file.path,fileName);
            const prisma=getPrismaInstance();
            const {from,to}=req.query;
            if(from && to)
            {
                const newMessages=await prisma.messages.create({
                    data:{
                        message:fileName,
                        sender:{connect:{id:parseInt(from)}},
                        receiver:{connect:{id:parseInt(to)}},
                        type:"image"
                    },
                });
                return res.status(201).json({newMessages,signal:"successfully save and send the image"});
            }
            return res.status(400).json("from && to are required");
        }
        return res.status(400).json("Image is required");
        
    } catch (error) {
        console.error(error);
        
    }
}


export const addAudioMessage=async(req,res,next)=>{
    try {
        if (req.file) {
        //   console.log(req.file);
    
          // Set the Content-Type header based on the file type
          res.set('Content-Type', 'audio/mpeg');
    
          const data = Date.now();
          const fileName = 'uploads/recordings/' + req.file.originalname;
          fs.renameSync(req.file.path, fileName);
    
          const prisma = getPrismaInstance();
          const { from, to } = req.query;
        //   console.log(fileName);
    
          if (from && to) {
            const newMessages = await prisma.messages.create({
              data: {
                message: fileName,
                sender: { connect: { id: parseInt(from) } },
                receiver: { connect: { id: parseInt(to) } },
                type: 'audio'
              },
            });
    
            return res.status(201).json({ newMessages, signal: 'Successfully saved and sent the audio' });
          }
    
          return res.status(400).json("From and to are required");
        }
    
        return res.status(400).json("Audio file is required");
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    };
   
    export const getInitialContactswithMessages = async (req, res, next) => {
        try {
            const userId = parseInt(req.params.from);
            const prisma = getPrismaInstance();
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    sentMessages: {
                        include: {
                            receiver: true,
                            sender: true,
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                    },
                    receivedMessages: {
                        include: {
                            receiver: true,
                            sender: true,
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                    },
                },
            });
    
            const messages = [...user.sentMessages, ...user.receivedMessages];
            messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
            const users = new Map();
            const messageStatusChange = [];
            
            messages.forEach((msg) => {
                const isSender = msg.senderId === userId;
                const calculatedId = isSender ? msg.receiver.id : msg.sender.id;
    
                if (msg.messageStatus === "sent") {
                    messageStatusChange.push(msg.id);
                }
    
                const {
                    id,
                    type,
                    message,
                    messageStatus,
                    createdAt,
                    sender,
                    receiver,
                } = msg;
    
                if (!users.has(calculatedId)) {
                    let user = {
                        messageId: id,
                        type,
                        message,
                        messageStatus,
                        createdAt,
                        senderId: sender.id,
                        receiverId: receiver.id,
                    };
    
                    if (isSender) {
                        user = { ...user, ...receiver, totalUnreadMessages: 0 };
                    } else {
                        user = {
                            ...user,
                            ...sender,
                            totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
                        };
                    }
    
                    users.set(calculatedId, user);
                } else if (messageStatus !== "read" && !isSender) {
                    const existingUser = users.get(calculatedId);
                    users.set(calculatedId, {
                        ...existingUser,
                        totalUnreadMessages: existingUser.totalUnreadMessages + 1,
                    });
                }
            });
    
            if (messageStatusChange.length) {
                await prisma.messages.updateMany({
                    where: {
                        id: { in: messageStatusChange },
                    },
                    data: {
                        messageStatus: "delivered",
                    },
                });
            }
    
            // console.log(users);
            return res.status(200).json({
                users: Array.from(users.values()),
            });
        } catch (error) {
            next(error);
        }
    };
    