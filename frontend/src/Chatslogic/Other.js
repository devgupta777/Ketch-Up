import { useEffect } from "react";
import { Chatstate } from "../Context/Contextprovider";


const Other = (currentuser,userarray) => {
   
    return userarray[0]?._id === currentuser?._id ? userarray[1].name : userarray[0].name   }

   export const OtherFull = (currentuser,userarray) => {
        return userarray[0]?._id  ===currentuser?._id ? userarray[1] : userarray[0]   }

export const isAvatar=(messages,m,i,userId)=>{
    return ((i=== 0 || messages[i-1].sender?._id !== m.sender?._id ) &&  m.sender?._id !== userId )
}  

export const isMargin=(messages,m,i,userId)=>{
    return i=== 0 || (messages[i-1].sender._id !== m.sender._id )
} 

export const isLeftMargin=(messages,m,i,userId)=>{
    if(m.sender._id ===userId)
    return "auto";
else if((i=== 0 || messages[i-1].sender._id !== m.sender._id) && m.sender._id !== userId )
return 0;
else
return "33px";
}
   
   export default Other;

  

