import { AvatarGroup } from "@mui/material";
import { emptyId } from "@/lib/common/types";
import { EmployeeAvatar } from "@/components/jirify/common/EmployeeAvatar";
import { useEffect } from "react";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import { jirifyUrls } from "@/lib/jirify/common/urls";
import { FieldRecord } from "@/lib/common/store/store";

export interface EmployeeFilterProps {
  workspace: string
  selected?: string[]
  onChange: (value: string[]) => void
}

export function EmployeeFilter({
  workspace,
  selected,
  onChange,
}: EmployeeFilterProps) {
  const employee = useFetchStore<FieldRecord[]>('GET', jirifyUrls.employee.field)

  useEffect(() => {
    if (!workspace) {
      return
    }
    employee.fetch({
      queryParams: { workspace: workspace }
    })

  }, [workspace])

  const handleSelect = (id: string) => {
    let newEmployees = selected?.filter((employee) => employee !== id) || []
    if (newEmployees.length === selected?.length) {
      newEmployees = [...selected, id]
    }
    onChange(newEmployees)
  }

  const isSelected = (value: string)=> {
    return selected?.some((employee) => employee === value)
  }

  return <AvatarGroup max={99}>
    {!!employee.data?.length && (
      <EmployeeAvatar
        size="large"
        selected={isSelected(emptyId)}
        onClick={() => handleSelect(emptyId)}
      />
    )}
    {employee.data?.map((employee) => (
      <EmployeeAvatar
        key={employee.id}
        name={employee.label}
        size="large"
        selected={isSelected(employee.id)}
        onClick={() => handleSelect(employee.id)}
      />
    ))}
  </AvatarGroup>
}