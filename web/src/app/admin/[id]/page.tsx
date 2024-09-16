import { AdminDetailPage } from "@/fragments/admin/AdminDetailPage";

export interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  return <AdminDetailPage id={params.id} />
}