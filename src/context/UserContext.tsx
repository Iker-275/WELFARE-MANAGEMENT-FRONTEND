// import { createContext, useState, useEffect,ReactNode } from "react";
// import { userApi } from "../api/UserApi";
// import { User } from "../types/UserType";

// export const UserContext = createContext<UserContextType | undefined>(undefined);

// interface Props {
//   children: ReactNode;
// }

// // export const UserContext = createContext<any>(null);

// export const UserProvider = ({ children }: Props) => {
//    const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [message, setMessage] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await userApi.getUsers();
//       setUsers(res.data);
//     } catch {
//       setError("Failed to fetch users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateUser = async (id: string, data: any) => {
//     const res = await userApi.updateUser(id, data);
//     setMessage(res.message);
//     fetchUsers();
//   };

//   const deleteUser = async (id: string) => {
//     const res = await userApi.deleteUser(id);
//     setMessage(res.message);
//     fetchUsers();
//   };

//   const toggleUser = async (id: string) => {
//     const res = await userApi.toggleUser(id);
//     setMessage(res.message);
//     fetchUsers();
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <UserContext.Provider
//       value={{
//         users,
//         loading,
//         message,
//         error,
//         fetchUsers,
//         updateUser,
//         deleteUser,
//         toggleUser,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };