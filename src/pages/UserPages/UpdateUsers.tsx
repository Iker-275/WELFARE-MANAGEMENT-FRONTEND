
// import { useParams, useNavigate } from "react-router-dom";
// import UserForm from "../../components/customforms/UserForm";
// import { useUsers } from "../../hooks/useUser";

// export default function EditUser() {

//   const { id } = useParams();
//   const navigate = useNavigate();

//   const { users, updateUser, message, error } = useUsers();

//   const user = users.find((u) => u._id === id);

//   const handleUpdate = async (data: { role: string; active: boolean }) => {
//     await updateUser(id!, data);
//     navigate("/users");
//   };

//   if (!user) return <p>Loading...</p>;

//   return (
//     <>
//       <UserForm
//         mode="edit"
//         userId={user._id}
//         initialData={{
//           email: user.email,
//           role: user.role,
//           active: user.active,
//         }}
//         onSubmit={handleUpdate}
//       />

//       {message && (
//         <p className="text-green-600 mt-4">{message}</p>
//       )}

//       {error && (
//         <p className="text-red-600 mt-4">{error}</p>
//       )}
//     </>
//   );
// }