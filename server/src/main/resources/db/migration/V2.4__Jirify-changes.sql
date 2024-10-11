create table task_branches(
    id uuid primary key,
    task_id uuid not null references tasks(id),
    branch_id uuid not null references branches(id)
);