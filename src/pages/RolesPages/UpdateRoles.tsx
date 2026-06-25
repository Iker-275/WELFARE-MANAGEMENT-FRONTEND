import { useParams, useNavigate } from "react-router-dom";
import RoleForm from "../../components/customforms/RolesForm";
import { useRoles } from "../../hooks/useRoles";



export default function UpdateRole(){



const {

id

}=useParams();



const navigate =
useNavigate();




const {

roles,

updateRole,

message

}=useRoles();

const role =
roles.find(
(r:any)=>
r.id===id
);

if(!role){

return(

<div>

Loading...

</div>

)

}

const handleUpdate =
async(data:{
name:string;

})=>{


const success =

await updateRole(

id!,

data

);

if(success){

navigate("/roles");
}
};


return(
<>
<RoleForm
mode="edit"
initialData={{

name:
role.name
}}

onSubmit={handleUpdate}
/>


{
message &&
<div className=" text-sm mt-4">
{message}
</div>
}
</>
);
}