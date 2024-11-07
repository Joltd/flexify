create table tenants(
    id uuid primary key,
    name text not null,
    application text not null,
    created_at timestamp,
    updated_at timestamp
);

create table tenant_users(
    id uuid primary key,
    active boolean not null default false,
    tenant_id uuid not null references tenants(id),
    user_id uuid not null references users(id)
);

alter table workspaces add column tenant uuid;