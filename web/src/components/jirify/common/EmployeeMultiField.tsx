import { Avatar, AvatarGroup } from "@mui/material";
import { useApi } from "@/lib/common/api";
import { SelectEmployee } from "@/lib/jirify/types";
import { API_URL } from "@/lib/urls";
import { useEffect, useState } from "react";
import { blue } from "@mui/material/colors";
import { emptyId } from "@/lib/common/types";

export interface EmployeeMultiFieldProps {
  workspace: string;
  onChange: (value: string[]) => void;
}

export function EmployeeMultiField({
  workspace,
  onChange,
}: EmployeeMultiFieldProps) {
  const employeeApi = useApi<SelectEmployee[]>(API_URL.jirify.common.employee.select, [])
  const [employees, setEmployees] = useState<Array<SelectEmployee | null>>([])

  useEffect(() => {
    if (!workspace) {
      return
    }
    employeeApi.get({
      queryParams: { workspace }
    })
  }, [workspace]);

  const handleSelect = (value: SelectEmployee | null) => {
    let newEmployees = employees.filter((employee) => employee?.id !== value?.id)
    if (newEmployees.length === employees.length) {
      newEmployees = [...employees, value]
    }
    setEmployees(newEmployees)
    onChange(newEmployees.map((employee) => employee?.id || emptyId))
  };

  const isSelected = (value: SelectEmployee | null)=> {
    return employees.some((employee) => employee?.id === value?.id)
  }

  return <AvatarGroup max={99}>
    {employeeApi.data.length > 0 && (
      <Avatar
        sx={{ width: 32, height: 32, cursor: 'pointer', border: isSelected(null) ? `2px solid ${blue[500]} !important` : null}}
        onClick={() => handleSelect(null)}
      />
    )}
    {employeeApi.data.map((employee) => (
      <Avatar
        key={employee.id}
        sx={{ width: 32, height: 32, cursor: 'pointer', border: isSelected(employee) ? `2px solid ${blue[500]} !important` : null }}
        onClick={() => handleSelect(employee)}
      >
        {employee.name[0].toUpperCase()}
      </Avatar>
    ))}
  </AvatarGroup>
}