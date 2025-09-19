import React from 'react'

const TableRow = ({ rowData, columns }) => {
  return (
    <tr>
      {columns.map(column => (
        <td key={column.key}>
          {rowData[column.key]}
        </td>
      ))}
    </tr>
  )
}

export default TableRow