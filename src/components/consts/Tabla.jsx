import React, { useState, useMemo } from "react";
import { Pagination, Box, useMediaQuery } from "@mui/material";

const TablePrueba = ({ title, columns, data, roles = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleRoleFilterChange = (event) => setSelectedRole(event.target.value);

  // Filtrar datos usando useMemo para optimizar el rendimiento
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesRole =
        selectedRole === "" || row.rolId === Number(selectedRole);
      const matchesSearch = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchesRole && matchesSearch;
    });
  }, [data, searchTerm, selectedRole]);

  // Paginación
  const currentRows = useMemo(() => {
    const indexOfLastRow = page * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return filteredData.slice(indexOfFirstRow, indexOfLastRow);
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = (event, value) => setPage(value);

  return (
    <section
     
    >
      <div
        className="fixed bg-white rounded-lg shadow-md"
        style={{
          padding: "5px",
          margin: "0 auto",
          borderRadius: "30px",
          marginTop: "20px",
          boxShadow: "0 4px 12px rgba(128, 0, 128, 0.5)",
          left: "82px",
          top: "70px",
          width: "calc(100% - 100px)",
          
        }}
      >
        <div className="bg-white rounded-lg p-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-3xl font-bold text-left">{title}</h4>

            <div className="flex items-center space-x-4">
              <div className="relative w-80">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Buscar"
                  aria-label="Buscar"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
              </div>

              {roles.length > 0 && (
                <div className="relative w-80">
                  <select
                    value={selectedRole}
                    onChange={handleRoleFilterChange}
                    className="block w-full p-4 pl-3 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filtrar por rol"
                  >
                    <option value="">Filtrar por rol</option>
                    {roles.map((role) => (
                      <option key={role.idRol} value={role.idRol}>
                        {role.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {isSmallScreen ? (
            <div className="grid grid-cols-1 gap-4">
              {currentRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="border rounded-lg p-4 shadow-md bg-white"
                >
                  {columns.map((column, colIndex) => (
                    <div key={colIndex} className="mb-2">
                      <strong>{column.headerName}: </strong>
                      {column.field === "rolId"
                        ? roles.find((role) => role.idRol === row[column.field])
                            ?.nombre || "Desconocido"
                        : column.renderCell
                        ? column.renderCell({ row })
                        : row[column.field]}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden bg-white shadow-md sm:rounded-lg">
              <div className="w-full overflow-x-auto">
                <table
                  key={JSON.stringify(currentRows)}
                  className="w-full table-auto text-sm text-center text-gray-500 border border-gray-200"
                >
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column.field}
                          className="px-6 py-3 text-center"
                          style={{ backgroundColor: "#FFE4FF", fontWeight: "bold", fontSize:'13px' }} // Add this line

                        >
                          {column.headerName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b hover:bg-gray-100">
                        {columns.map((column, colIndex) => (
                          <td
                            key={colIndex}
                            style={{color: '#616161'}}
                            className="px-6 py-3 text-center whitespace-nowrap"
                          >
                            {column.field === "rolId"
                              ? roles.find(
                                  (role) => role.idRol === row[column.field]
                                )?.nombre || "Desconocido"
                              : column.renderCell
                              ? column.renderCell({ row })
                              : row[column.field]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(filteredData.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </div>
      </div>
    </section>
  );
};

export default TablePrueba;
