'use client';
import {
  Autocomplete, Fab,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField
} from "@mui/material";
import { useEntityStore } from "@/lib/entity/store/entity-store";
import { useEffect } from "react";
import { Entity } from "@/fragments/entity/Entity";
import { EntityFilter } from "@/fragments/entity/EntityFilter";
import { FilterAlt } from "@mui/icons-material";
import { Box } from "@mui/system";
import { EntityFieldKind, EntityFieldMetadata } from "@/lib/entity/types";
import { Badge } from "@/components/common/Badge";
import { useClipboard } from "@/lib/common/clipboard";
import AddIcon from "@mui/icons-material/Add";

export function EntityList() {
  const {
    entityMetadataList,
    entityMetadata,
    setEntityMetadata,
    page,
    setPage,
    pageSize,
    setPageSize,
    setFilterVisible,
    setEntityVisible,
    entityList,
    entity,
    entityDelete,
  } = useEntityStore()

  useEffect(() => {
    entityMetadataList.fetch()
  }, []);

  const onEntitySelect = (id: string) => {
    setEntityVisible(true)
    entityDelete.updatePathParams({ id })
    entity.fetch({ pathParams: { entity: entityMetadata?.name, id } })
  }

  const onEntityCreate = () => {
    entity.reset()
    setEntityVisible(true)
  }

  return <>
    <Stack margin={4} spacing={2}>
      <Stack direction="row" alignItems="center">
        <Autocomplete
          renderInput={(props) => (
            <TextField label="Entity" {...props} />
          )}
          getOptionLabel={(option) => option.name}
          options={entityMetadataList.data || []}
          value={entityMetadata}
          onChange={(_, value) => setEntityMetadata(value)}
          sx={{ width: 300 }}
        />
        <Box sx={{ flexGrow: 1 }} />
        {entityMetadata && (
          <>
            <IconButton color="primary" size="large" onClick={onEntityCreate}>
              <AddIcon />
            </IconButton>
            <IconButton color="primary" size="large" onClick={() => setFilterVisible(true)}>
              <FilterAlt />
            </IconButton>
          </>
        )}
      </Stack>
      {entityMetadata && entityList.data && (
        <>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {entityMetadata.fields.map((field) => (
                    <TableCell key={field.name}>
                      <TableSortLabel>
                        {field.name}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {entityList.data.data.map((e, index) => (
                  <TableRow key={index} selected={e.id === entity.data?.id} onClick={() => onEntitySelect(e.id)}>
                    {entityMetadata.fields.map((field) => (
                      <TableCell key={field.name}>
                        <EntityField entity={e} field={field} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={entityList.data.total}
            onPageChange={(_, page) => setPage(page)}
            page={page}
            onRowsPerPageChange={(event) => setPageSize(+event.target.value)}
            rowsPerPage={pageSize}
            labelRowsPerPage={null}
          />
        </>
      )}
    </Stack>
    <Entity />
    <EntityFilter />
  </>
}

interface EntityFieldProps {
  entity: Record<string, any>
  field: EntityFieldMetadata
}

function EntityField({ entity, field }: EntityFieldProps) {
  const { copy } = useClipboard()

  const value = entity[field.name]

  if (!value) {
    return <Badge label="Empty" />
  }

  if (field.kind === EntityFieldKind.ID) {

    return <Badge label="ID" tooltip={value} onClick={() => copy(value)}/>

  }

  if (field.kind === EntityFieldKind.JSON) {

    const json = JSON.stringify(value, null, 2)
    const tooltip = <Stack whiteSpace="pre-wrap">{json}</Stack>
    return <Badge label="JSON" tooltip={tooltip} onClick={() => copy(json)} />

  }

  if (field.kind === EntityFieldKind.REFERENCE) {

    return <Badge label={value.label} tooltip={value.id} onClick={() => copy(value.id)} />

  }

  if (field.kind === EntityFieldKind.BOOLEAN) {
    return <Badge label={value ? "Yes" : "No"} />
  }

  return <>{value}</>
}