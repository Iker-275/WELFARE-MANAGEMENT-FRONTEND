import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ComponentCard from "../common/ComponentCard";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Button from "../ui/button/Button";
import Label from "../form/Label";

import { usePermissions } from "../../hooks/usePermission";



export default function PermissionForm() {


  const {
    createPermission,
    loading,
    message,
    setMessage
  } = usePermissions();




  const [name, setName] = useState("");

  const [description, setDescription] = useState("");



  const [errors, setErrors] =
    useState<any>({});




 const navigate =useNavigate();

  const validate = () => {


    const newErrors:any = {};



    if (!name.trim()) {

      newErrors.name =
        "Permission name is required";

    }



    if (!description.trim()) {

      newErrors.description =
        "Permission description is required";

    }



    setErrors(newErrors);



    return Object.keys(newErrors).length === 0;


  };







  const submit = async () => {


    setMessage("");



    if (!validate()) return;





    const success =
      await createPermission({

        name:name.trim(),

        description:description.trim()

      });





    if(success){


      setName("");

      setDescription("");

      setErrors({});

 navigate("/permissions");
    }



  };






  return (


    <ComponentCard title="Create Permission">


      <div className="space-y-5">





        <div>


          <Label>
            Name
          </Label>



          <Input


            placeholder="Permission name"


            value={name}



            onChange={(e:any)=>{

              setName(e.target.value);

              setErrors({
                ...errors,
                name:""
              });

            }}


          />



          {
            errors.name && (

              <p className="mt-1 text-sm text-red-500">

                {errors.name}

              </p>

            )

          }



        </div>








        <div>


          <Label>
            Description
          </Label>




          <TextArea


            placeholder="Permission description"



            value={description}



            onChange={(value)=>{


              setDescription(value);



              setErrors({

                ...errors,

                description:""

              });



            }}


          />




          {
            errors.description && (

              <p className="mt-1 text-sm text-red-500">

                {errors.description}

              </p>

            )

          }



        </div>







        {
          message && (

            <div className="text-sm text-blue-600">

              {message}

            </div>

          )

        }





      </div>







      <div className="flex justify-end mt-6 pt-5 border-t">


        <Button


          onClick={submit}



          disabled={loading}



        >


          {
            loading
            ?
            "Creating..."
            :
            "Create Permission"

          }



        </Button>



      </div>






    </ComponentCard>


  );

}