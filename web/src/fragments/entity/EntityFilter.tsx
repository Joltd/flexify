import { Drawer, IconButton, Stack } from "@mui/material";
import { QueryBuilderMaterial } from "@react-querybuilder/material";
import { ActionWithRulesAndAddersProps, ActionWithRulesProps, QueryBuilder } from "react-querybuilder";
import { useEntityStore } from "@/lib/entity/store/entity-store";
import { sentenceCase } from "change-case";
import { DrawerHeader } from "@/components/common/DrawerHeader";
import { FilterValueEditor } from "@/components/entity/FilterValueEditor";
import { Add, Clear, PlaylistAdd } from "@mui/icons-material";
import { EntityFieldOperator } from "@/lib/entity/types";

export function EntityFilter() {
  const { entityMetadata, filterVisible, setFilterVisible, filter, setFilter, clearFilter, entityList } = useEntityStore()

  const operators = [
    { name: EntityFieldOperator.EQUALS, value: EntityFieldOperator.EQUALS, label: '=' },
    { name: EntityFieldOperator.GREATER, value: EntityFieldOperator.GREATER, label: '>' },
    { name: EntityFieldOperator.GREATER_EQUALS, value: EntityFieldOperator.GREATER_EQUALS, label: '>=' },
    { name: EntityFieldOperator.LESS, value: EntityFieldOperator.LESS, label: '<' },
    { name: EntityFieldOperator.LESS_EQUALS, value: EntityFieldOperator.LESS_EQUALS, label: '<=' },
    { name: EntityFieldOperator.LIKE, value: EntityFieldOperator.LIKE, label: 'like' },
    { name: EntityFieldOperator.IN_LIST, value: EntityFieldOperator.IN_LIST, label: 'in' },
    { name: EntityFieldOperator.IS_NULL, value: EntityFieldOperator.IS_NULL, label: 'is null' },
  ];

  const fields = entityMetadata?.fields?.map((field) => ({
    name: field.name,
    label: sentenceCase(field.name),
    kind: field.kind,
    operators: operators.filter(operator => field.operators.includes(operator.name)),
    entity: field.entity,
    values: field.options,
  }))

  const handleApplyFilter = () => {
    entityList.fetch()
  }

  const handleClearFilter = () => {
    clearFilter()
  }

  return <Drawer anchor="right" open={filterVisible} onClose={() => setFilterVisible(false)}>
    <Stack margin={4} spacing={2} width={400}>
      <DrawerHeader title="Filter" action="Apply" onAction={handleApplyFilter} secondAction="Clear" onSecondAction={handleClearFilter} />
      <QueryBuilderMaterial>
        <QueryBuilder
          fields={fields}
          query={filter || undefined}
          onQueryChange={setFilter}
          controlElements={{
            valueEditor: FilterValueEditor,
            addRuleAction: AddRuleAction,
            addGroupAction: AddGroupAction,
            removeRuleAction: RemoveAction,
            removeGroupAction: RemoveAction,
          }}
          combinators={[
            { name: 'AND', value: 'AND', label: 'and' },
            { name: 'OR', value: 'OR', label: 'or' },
          ]}
          operators={operators}
          showNotToggle
        />
      </QueryBuilderMaterial>
    </Stack>
  </Drawer>
}

export function AddGroupAction({ disabled, handleOnClick }: ActionWithRulesAndAddersProps) {
  return <IconButton disabled={disabled} onClick={handleOnClick}>
    <PlaylistAdd />
  </IconButton>
}

export function AddRuleAction({ disabled, handleOnClick }: ActionWithRulesAndAddersProps) {
  return <IconButton disabled={disabled} onClick={handleOnClick}>
    <Add />
  </IconButton>
}

export function RemoveAction({ disabled, handleOnClick }: ActionWithRulesProps) {
  return <IconButton disabled={disabled} onClick={handleOnClick} className="rule-remove">
    <Clear />
  </IconButton>
}
