create table merge_requests(
    id uuid primary key,
    external_id text not null,
    source_branch_id uuid not null references branches(id),
    target_branch_id uuid not null references branches(id)
);

alter table branches add column base boolean default false;