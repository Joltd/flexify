import { useEntityStore } from "@/lib/entity/store/entity-store";
import { Drawer, Stack } from "@mui/material";
import {
  CheckboxElement,
  FormContainer,
  TextFieldElement,
  useForm
} from "react-hook-form-mui";
import { useEffect } from "react";
import { DrawerHeader } from "@/components/common/DrawerHeader";
import { EnumFieldElement } from "@/components/entity/EnumFieldElement";
import { ReferenceFieldElement } from "@/components/entity/ReferenceFieldElement";
import { EntityFieldKind, EntityFieldMetadata } from "@/lib/entity/types";
import { sentenceCase } from "change-case";
import { Badge } from "@/components/common/Badge";
import { useClipboard } from "@/lib/common/clipboard";
import { JsonFieldElement } from "@/components/entity/JsonFieldElement";

export function Entity() {
  const {
    entityMetadata,
    entityVisible,
    setEntityVisible,
    entityList,
    entity,
    entityUpdate,
    entityDelete,
  } = useEntityStore()
  const form = useForm({})

  useEffect(() => {
    if (entity.data) {
      form.reset(entity.data)
    } else {
      form.reset({ _ignore: null })
    }
  }, [entity.data])

  const handleSave = () => {
    const body = form.getValues()
    entityUpdate.fetch({ body })
      .then(() => {
        entity.reset()
        entityList.fetch()
      })
  }

  const handleDelete = () => {
    entityDelete.fetch()
  }

  const handleClose = () => {
    entity.reset()
    setEntityVisible(false)
  }

  return <Drawer anchor="right" open={entityVisible} onClose={handleClose}>
    <FormContainer formContext={form} onSuccess={handleSave}>
      <Stack margin={4} spacing={2} width={400}>
        <DrawerHeader title={sentenceCase(entityMetadata?.name || "Entity")} secondAction="Delete" onSecondAction={entity.data?.id ? handleDelete : undefined} />
        <Stack spacing={2}>
          {entityMetadata?.fields?.map((field) => (
            <EntityField key={field.name} entity={entity.data} field={field} />
          ))}
        </Stack>
      </Stack>
    </FormContainer>
  </Drawer>
}

interface EntityFieldProps {
  entity: Record<string, any> | null
  field: EntityFieldMetadata
}

function EntityField({ entity, field }: EntityFieldProps) {
  const { copy } = useClipboard()

  if (field.kind === EntityFieldKind.ID) {
    let value = entity?.[field.name];
    return value ? <Badge label={value} onClick={() => copy(value)} /> : <></>
  }

  if (field.kind === EntityFieldKind.REFERENCE) {
    return <ReferenceFieldElement name={field.name} label={sentenceCase(field.name)} entity={field.entity} />
  }

  if (field.kind === EntityFieldKind.ENUM) {
    return <EnumFieldElement name={field.name} label={sentenceCase(field.name)} options={field.options} />
  }

  if (field.kind === EntityFieldKind.JSON) {
    return <JsonFieldElement name={field.name} label={sentenceCase(field.name)} />
  }

  if (field.kind === EntityFieldKind.BOOLEAN) {
    return <CheckboxElement name={field.name} label={sentenceCase(field.name)} />
  }

  if (field.kind === EntityFieldKind.NUMBER) {
    return <TextFieldElement name={field.name} label={sentenceCase(field.name)} type="number" />
  }

  return <TextFieldElement name={field.name} label={sentenceCase(field.name)} />

}