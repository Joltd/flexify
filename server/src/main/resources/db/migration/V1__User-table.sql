create table users(
    id uuid primary key,
    login text not null,
    password text not null,
    deleted boolean not null default false,
    applications jsonb not null default '[]'
)