// import { ReactNode } from "react";

// // Props for Table
// interface TableProps {
//   children: ReactNode; // Table content (thead, tbody, etc.)
//   className?: string; // Optional className for styling
// }

// // Props for TableHeader
// interface TableHeaderProps {
//   children: ReactNode; // Header row(s)
//   className?: string; // Optional className for styling
// }

// // Props for TableBody
// interface TableBodyProps {
//   children: ReactNode; // Body row(s)
//   className?: string; // Optional className for styling
// }

// // Props for TableRow
// interface TableRowProps {
//   children: ReactNode; // Cells (th or td)
//   className?: string; // Optional className for styling
// }

// // Props for TableCell
// interface TableCellProps {
//   children: ReactNode; // Cell content
//   isHeader?: boolean; // If true, renders as <th>, otherwise <td>
//   className?: string; // Optional className for styling
// }

// // Table Component
// const Table: React.FC<TableProps> = ({ children, className }) => {
//   return <table className={`min-w-full  ${className}`}>{children}</table>;
// };

// // TableHeader Component
// const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
//   return <thead className={className}>{children}</thead>;
// };

// // TableBody Component
// const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
//   return <tbody className={className}>{children}</tbody>;
// };

// // TableRow Component
// const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
//   return <tr className={className}>{children}</tr>;
// };

// // TableCell Component
// const TableCell: React.FC<TableCellProps> = ({
//   children,
//   isHeader = false,
//   className,
// }) => {
//   const CellTag = isHeader ? "th" : "td";
//   return <CellTag className={` ${className}`}>{children}</CellTag>;
// };

// export { Table, TableHeader, TableBody, TableRow, TableCell };

import {
  ReactNode,
} from "react";

import type {
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";


// ---------------------------------------------
// Table
// ---------------------------------------------

interface TableProps {
  children: ReactNode;
  className?: string;
}

const Table = ({
  children,
  className = "",
}: TableProps) => {

  return (
    <table
      className={`min-w-full ${className}`}
    >
      {children}
    </table>
  );
};


// ---------------------------------------------
// Table Header
// ---------------------------------------------

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

const TableHeader = ({
  children,
  className = "",
}: TableHeaderProps) => {

  return (
    <thead
      className={className}
    >
      {children}
    </thead>
  );
};


// ---------------------------------------------
// Table Body
// ---------------------------------------------

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

const TableBody = ({
  children,
  className = "",
}: TableBodyProps) => {

  return (
    <tbody
      className={className}
    >
      {children}
    </tbody>
  );
};


// ---------------------------------------------
// Table Row
// ---------------------------------------------

interface TableRowProps
  extends HTMLAttributes<HTMLTableRowElement> {

  children: ReactNode;
}

const TableRow = ({
  children,
  className = "",
  ...props
}: TableRowProps) => {

  return (
    <tr
      className={className}
      {...props}
    >
      {children}
    </tr>
  );
};


// ---------------------------------------------
// Table Cell
// ---------------------------------------------

type TableCellProps =
  | ({
      isHeader: true;
      children: ReactNode;
    } & ThHTMLAttributes<HTMLTableCellElement>)
  | ({
      isHeader?: false;
      children: ReactNode;
    } & TdHTMLAttributes<HTMLTableCellElement>);


const TableCell = ({
  children,
  isHeader = false,
  className = "",
  ...props
}: TableCellProps) => {

  if (isHeader) {

    return (
      <th
        className={className}
        {...props}
      >
        {children}
      </th>
    );
  }

  return (
    <td
      className={className}
      {...props}
    >
      {children}
    </td>
  );
};


export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
};