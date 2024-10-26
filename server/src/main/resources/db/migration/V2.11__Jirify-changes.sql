alter table branches add column hidden boolean default false;

alter table merge_requests add column url text not null;

alter table merge_requests add column external_status text not null;

alter table merge_requests add column hidden boolean default false;