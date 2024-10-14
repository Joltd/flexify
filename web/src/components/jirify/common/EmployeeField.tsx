import { Autocomplete, TextField } from "@mui/material";
import { useApi } from "@/lib/common/api";
import { SelectEmployee } from "@/lib/jirify/types";
import { API_URL } from "@/lib/urls";
import { useEffect, useState } from "react";

export interface EmployeeFieldProps {
  workspace: string;
  value?: string;
  onChange: (value: string | null) => void;
}

export function EmployeeField({
  workspace,
  value,
  onChange,
}: EmployeeFieldProps) {
  const employeeApi = useApi<SelectEmployee[]>(API_URL.jirify.common.employee.select, [])
  const [employee, setEmployee] = useState<SelectEmployee | null>(null)

  useEffect(() => {
    employeeApi.get({
      queryParams: { workspace }
    })
  }, []);

  useEffect(() => {
    const employee = employeeApi.data
      .find((employee) => employee.id === value) || null
    setEmployee(employee)
  }, [employeeApi.data]);

  const handleSelect = (event: any, value: SelectEmployee | null) => {
    setEmployee(value)
    onChange(value?.id || null)
  };

  return <Autocomplete
    options={employeeApi.data}
    renderInput={(props) => <TextField label="Employee" {...props} />}
    value={employee}
    onChange={handleSelect}
    getOptionLabel={(option) => option.name}
  />
}