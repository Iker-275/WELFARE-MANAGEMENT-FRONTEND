import { useContext } from "react";

import { ImportContext } from "../context/ImportContext";

export const useImports = () => {

  const context =
    useContext(ImportContext);

  if (!context) {
    throw new Error(
      "useImports must be used inside ImportProvider"
    );
  }

  return context;
};




//import preview table
// <table>
//   <thead>
//     <tr>
//       <th>Row</th>

//       {preview.columns.map((column) => (
//         <th key={column}>
//           {column}
//         </th>
//       ))}

//       <th>Status</th>
//       <th>Errors</th>
//     </tr>
//   </thead>

//   <tbody>
//     {preview.rows.map((row) => (
//       <tr key={row.rowNumber}>

//         <td>
//           {row.rowNumber}
//         </td>

//         {preview.columns.map((column) => (
//           <td key={column}>
//             {String(
//               row.data[column] ?? ""
//             )}
//           </td>
//         ))}

//         <td>
//           {row.valid
//             ? "Valid"
//             : "Invalid"}
//         </td>

//         <td>
//           {row.errors.length > 0
//             ? row.errors.map(
//                 (error, index) => (
//                   <div key={index}>
//                     {typeof error === "string"
//                       ? error
//                       : error.message}
//                   </div>
//                 )
//               )
//             : "—"}
//         </td>

//       </tr>
//     ))}
//   </tbody>
// </table>

//summary

// <div>
//   <span>Total Rows</span>
//   <strong>
//     {summary.totalRows}
//   </strong>
// </div>

// <div>
//   <span>Valid Rows</span>
//   <strong>
//     {summary.validRows}
//   </strong>
// </div>

// <div>
//   <span>Invalid Rows</span>
//   <strong>
//     {summary.invalidRows}
//   </strong>
// </div>

// <div>
//   <span>Status</span>
//   <strong>
//     {summary.ready
//       ? "Ready to import"
//       : "Cannot import"}
//   </strong>
// </div>