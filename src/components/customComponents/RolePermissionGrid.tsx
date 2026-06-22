
interface Props {

    permissions: any[];

    selectedPermissions: string[];

    onChange:
    (
        ids: string[]
    ) =>
        void;

}



export default function RolePermissionGrid({

    permissions,

    selectedPermissions,

    onChange


}: Props) {






    const togglePermission = (
        id: string
    ) => {


        let updated = [

            ...selectedPermissions

        ];



        if (updated.includes(id)) {


            updated =
                updated.filter(
                    item =>
                        item !== id
                );


        }
        else {


            updated.push(id);


        }



        onChange(updated);



    };









    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">


            {
                permissions.map(permission => (
                    <div
                        key={permission.id}
                        className="border rounded-xl p-4 flex items-start gap-3 bg-white">
                        <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)} />
                        <div>


                            <p className="font-medium">
                                {permission.name}
                            </p>


                            <p className="text-sm text-gray-500">
                                {permission.description}
                            </p>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}