
import { PrismaClient } from "@prisma/client";
let prismaInstance=null;
function getPrismaInstacne()
{
    if(!prismaInstance)
    {
        prismaInstance=new PrismaClient();
    }
    return prismaInstance
}

export default getPrismaInstacne;