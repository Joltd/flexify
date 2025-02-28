import { create } from "zustand/index";
import { createFetchStore, FetchStoreState } from "@/lib/common/store/fetch-store";
import { entityAppUrls } from "@/lib/entity/urls";
import { observable } from "@/lib/common/store/store";
import { EntityListPage, EntityMetadata } from "@/lib/entity/types";
import * as changeCase from "change-case";
import { RuleGroupType } from "react-querybuilder";

interface EntityStoreState {
  entityMetadataList: FetchStoreState<EntityMetadata[]>
  entityMetadata: EntityMetadata | null
  setEntityMetadata: (entity: EntityMetadata | null) => void
  page: number
  setPage: (page: number) => void
  pageSize: number
  setPageSize: (pageSize: number) => void
  sort: string | null
  setSort: (sort: string | null) => void
  filterVisible: boolean
  setFilterVisible: (filterVisible: boolean) => void
  filter: RuleGroupType
  setFilter: (filter: RuleGroupType) => void
  clearFilter: () => void
  sortDirection: string | null
  setSortDirection: (sortDirection: string | null) => void
  entityVisible: boolean
  setEntityVisible: (entityVisible: boolean) => void
  entityList: FetchStoreState<EntityListPage>
  entity: FetchStoreState<Record<string, any>>
  entityUpdate: FetchStoreState<void>
  entityDelete: FetchStoreState<void>
}

export const useEntityStore = create<EntityStoreState>()((set, get) => {
  const entityMetadataList = createFetchStore<EntityMetadata[]>('GET', entityAppUrls.entityMetadata, { keepData: true })
  const entityList = createFetchStore<EntityListPage>('POST', entityAppUrls.entity, { keepData: true })
  const entity = createFetchStore<Record<string, any>>('GET', entityAppUrls.entityId)
  const updateEntity = createFetchStore<void>('PATCH', entityAppUrls.entity)
  const deleteEntity = createFetchStore<void>('DELETE', entityAppUrls.entityId)

  const defaultFilter = {
    combinator: 'AND',
    rules: [],
  }

  const setValue = (value: Partial<EntityStoreState>) => {
    set({ ...value })
    const body = {
      page: get().page,
      size: get().pageSize,
      filter: get().filter,
      sort: get().sort && get().sortDirection
        ? [{
          field: get().sort,
          direction: get().sortDirection
        }]
        : []
    }
    entityList.getState().updateBody(body)
  }

  const setEntityMetadata = (entityMetadata: EntityMetadata | null) => {
    if (!entityMetadata) {
      return
    }

    setValue({ entityMetadata })

    const entityName = changeCase.kebabCase(entityMetadata?.name)
    entityList.getState().updatePathParams({ entity: entityName })
    entity.getState().updatePathParams({ entity: entityName })
    updateEntity.getState().updatePathParams({ entity: entityName })
    deleteEntity.getState().updatePathParams({ entity: entityName })

    entityList.getState().fetch()
  }

  return {
    entityMetadataList: observable(entityMetadataList, set, 'entityMetadataList'),
    entityMetadata: null,
    setEntityMetadata,
    page: 0,
    setPage: (page: number) => setValue({ page }),
    pageSize: 25,
    setPageSize: (pageSize: number) => setValue({ pageSize }),
    filterVisible: false,
    setFilterVisible: (filterVisible: boolean) => set({ filterVisible }),
    filter: {...defaultFilter},
    setFilter: (filter: RuleGroupType) => setValue({ filter }),
    clearFilter: () => setValue({ filter: defaultFilter }),
    sort: null,
    setSort: (sort: string | null) => setValue({ sort }),
    sortDirection: null,
    setSortDirection: (sortDirection: string | null) => setValue({ sortDirection }),
    entityVisible: false,
    setEntityVisible: (entityVisible: boolean) => setValue({ entityVisible }),
    entityList: observable(entityList, set, 'entityList'),
    entity: observable(entity, set, 'entity'),
    entityUpdate: observable(updateEntity, set, 'entityUpdate'),
    entityDelete: observable(deleteEntity, set, 'entityDelete'),
  }
})
