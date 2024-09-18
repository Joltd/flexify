create table workspaces(
    id uuid primary key,
    name text not null,
    kind text not null,
    task_tracker jsonb,
    user_id uuid not null references users(id)
);

create table employees(
    id uuid primary key,
    external_id text not null,
    name text not null,
    me boolean not null default false,
    workspace_id uuid not null references workspaces(id)
);

create table repositories(
    id uuid primary key,
    workspace_id uuid not null references workspaces(id)
);

create table branches(
    id uuid primary key,
    key text not null,
    repository_id uuid not null references repositories(id)
);

create table sprints(
    id uuid primary key,
    key text not null,
    external_id text not null,
    updated_at timestamp,
    workspace_id uuid not null references workspaces(id)
);

create table tasks(
    id uuid primary key,
    key text not null,
    external_id text not null,
    summary text not null,
    url text not null,
    status text,
    external_status text,
    priority int,
    updated_at timestamp,
    workspace_id uuid not null references workspaces(id),
    assignee_id uuid references employees(id)
);

create table sprint_tasks(
    id uuid primary key,
    external_status text,
    estimation int default 0,
    updated_at timestamp,
    sprint_id uuid not null references sprints(id),
    task_id uuid not null references tasks(id)
);
