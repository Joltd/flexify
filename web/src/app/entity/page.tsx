'use client';
import { EntityList } from "@/fragments/entity/EntityList";
import { Suspense } from "react";
import { TextField } from "@mui/material";

export default function Page() {
  // const [query, setQuery] = useState<RuleGroupType>({ combinator: 'and', rules: [] })
  //
  // const fields = [
  //   { name: "test", label: "Test", type: "reference" }
  // ]

  return <Suspense>
    <EntityList />


    {/*<QueryBuilderMaterial >*/}
    {/*  <QueryBuilder*/}
    {/*    fields={fields}*/}
    {/*    query={query}*/}
    {/*    onQueryChange={setQuery}*/}
    {/*  />*/}
    {/*</QueryBuilderMaterial>*/}
  </Suspense>
}
