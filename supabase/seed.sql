-- ============================================================================
-- RSVP Seed Data (House of the Dragon, for local/dev testing)
-- Run this in the Supabase SQL Editor after schema.sql.
-- Safe to re-run: it wipes and re-inserts all parties/guests.
-- ============================================================================

truncate table guests, wedding_parties cascade;

insert into wedding_parties (party_name) values
  ('The Targaryen Party'),
  ('The Hightower Party'),
  ('The Velaryon Party'),
  ('The Strong Party'),
  ('The Cole Party'),
  ('The Dragonriders');

insert into guests (party_id, first_name, last_name) values
  ((select id from wedding_parties where party_name = 'The Targaryen Party'), 'Rhaenyra', 'Targaryen'),
  ((select id from wedding_parties where party_name = 'The Targaryen Party'), 'Daemon', 'Targaryen'),

  ((select id from wedding_parties where party_name = 'The Hightower Party'), 'Alicent', 'Hightower'),
  ((select id from wedding_parties where party_name = 'The Hightower Party'), 'Otto', 'Hightower'),
  ((select id from wedding_parties where party_name = 'The Hightower Party'), 'Gwayne', 'Hightower'),

  ((select id from wedding_parties where party_name = 'The Velaryon Party'), 'Corlys', 'Velaryon'),
  ((select id from wedding_parties where party_name = 'The Velaryon Party'), 'Rhaenys', 'Targaryen'),
  ((select id from wedding_parties where party_name = 'The Velaryon Party'), 'Laenor', 'Velaryon'),
  ((select id from wedding_parties where party_name = 'The Velaryon Party'), 'Laena', 'Velaryon'),

  ((select id from wedding_parties where party_name = 'The Strong Party'), 'Harwin', 'Strong'),
  ((select id from wedding_parties where party_name = 'The Strong Party'), 'Larys', 'Strong'),

  ((select id from wedding_parties where party_name = 'The Cole Party'), 'Criston', 'Cole'),

  ((select id from wedding_parties where party_name = 'The Dragonriders'), 'Baela', 'Targaryen'),
  ((select id from wedding_parties where party_name = 'The Dragonriders'), 'Rhaena', 'Targaryen'),
  ((select id from wedding_parties where party_name = 'The Dragonriders'), 'Aemond', 'Targaryen'),
  ((select id from wedding_parties where party_name = 'The Dragonriders'), 'Helaena', 'Targaryen'),
  ((select id from wedding_parties where party_name = 'The Dragonriders'), 'Aegon', 'Targaryen');
