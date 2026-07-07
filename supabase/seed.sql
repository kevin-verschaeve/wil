-- West in Lille — fixtures
-- Lessons and practical info based on the 2026-2027 planning
-- (westinlille.odoo.com / www.westinlille.fr), plus a demo festival edition.
--
-- Re-runnable: it first deletes the rows it seeds (which also cascades any
-- registrations attached to them), then inserts fresh data.

-- ---------- Reset seeded data ----------
delete from public.lessons where season = '2026-2027';
delete from public.info_pages where slug in ('lieux', 'inscriptions', 'association', 'contact', 'acces', 'billetterie', 'sur-place');
delete from public.editions where id = '11111111-1111-1111-1111-111111111111';

-- ---------- Cours de West Coast Swing, saison 2026-2027 ----------
insert into public.lessons (season, title, description, level, teacher_name, weekday, start_time, end_time, location, capacity, starts_on, ends_on) values
  -- Lundi — Salle Concorde
  ('2026-2027', 'WCS Débutant', 'Découverte du West Coast Swing : les fondamentaux, la connexion et les premiers passes. Aucun prérequis, pas besoin de venir accompagné·e.', 'beginner', 'Aure-Elise & Alexis', 1, '19:00', '20:00', 'Salle Concorde, Lille', null, '2026-09-14', '2027-06-14'),
  ('2026-2027', 'WCS Inter+', 'Pour danseurs et danseuses à l''aise avec les bases : variations, musicalité et jeu avec le partenaire.', 'intermediate', 'Sophie & Alexis', 1, '20:00', '21:00', 'Salle Concorde, Lille', null, '2026-09-14', '2027-06-14'),
  -- Lundi — Halle de glisse
  ('2026-2027', 'WCS Perf', 'Groupe perfectionnement : technique avancée, styling et travail chorégraphique.', 'advanced', 'Perrine & Matthieu', 1, '20:30', '21:30', 'Halle de glisse, Lille-Sud', null, '2026-09-14', '2027-06-14'),
  -- Mercredi — Mairie de quartier des Bois-Blancs
  ('2026-2027', 'WCS Intermédiaire', 'Consolidation des bases et nouveaux passes : timing, ancrage et improvisation.', 'intermediate', 'Apolline & Raphaël', 3, '19:30', '20:30', 'Mairie de quartier des Bois-Blancs, Lille', null, '2026-09-16', '2027-06-16'),
  -- Jeudi — Citi Club
  ('2026-2027', 'WCS Débutant', 'Découverte du West Coast Swing : les fondamentaux, la connexion et les premiers passes. Aucun prérequis, pas besoin de venir accompagné·e.', 'beginner', 'Stéphanie & Tom', 4, '20:10', '21:10', 'Citi Club, Lille', null, '2026-09-17', '2027-06-17'),
  ('2026-2027', 'WCS Intermédiaire', 'Consolidation des bases et nouveaux passes : timing, ancrage et improvisation.', 'intermediate', 'Stéphanie & Tom', 4, '21:15', '22:15', 'Citi Club, Lille', null, '2026-09-17', '2027-06-17'),
  -- Jeudi — Halle de glisse
  ('2026-2027', 'WCS Avancé', 'Niveau avancé : technique fine, connexion élastique et interprétation musicale.', 'advanced', 'Apolline & Raphaël', 4, '19:15', '20:15', 'Halle de glisse, Lille-Sud', null, '2026-09-17', '2027-06-17'),
  -- Dimanche — Halle de glisse
  ('2026-2027', 'WCS Débutant', 'Découverte du West Coast Swing : les fondamentaux, la connexion et les premiers passes. Aucun prérequis, pas besoin de venir accompagné·e.', 'beginner', 'Stéphanie & Fred', 7, '18:00', '19:00', 'Halle de glisse, Lille-Sud', null, '2026-09-20', '2027-06-20');

-- ---------- Infos pratiques ----------
insert into public.info_pages (slug, icon, sort_order, title_fr, title_en, body_fr, body_en) values
  ('lieux', 'location', 0, 'Les lieux des cours', 'Venues',
   'Les cours ont lieu dans quatre salles à Lille, toutes accessibles en métro 🤩' || E'\n\n'
     || 'Salle Concorde — cours du lundi (Débutant et Inter+).' || E'\n\n'
     || 'Halle de glisse (Lille-Sud) — cours du lundi (Perf), du jeudi (Avancé) et du dimanche (Débutant).' || E'\n\n'
     || 'Mairie de quartier des Bois-Blancs — cours du mercredi (Intermédiaire).' || E'\n\n'
     || 'Citi Club — cours du jeudi (Débutant et Intermédiaire).' || E'\n\n'
     || 'Les adresses détaillées et itinéraires sont sur www.westinlille.fr — vérifiez le lieu sur la fiche de votre cours, il change selon le créneau !',
   'Lessons take place in four venues across Lille, all reachable by metro 🤩' || E'\n\n'
     || 'Salle Concorde — Monday lessons (Beginner and Inter+).' || E'\n\n'
     || 'Halle de glisse (Lille-Sud) — Monday (Perf), Thursday (Advanced) and Sunday (Beginner) lessons.' || E'\n\n'
     || 'Mairie de quartier des Bois-Blancs — Wednesday lessons (Intermediate).' || E'\n\n'
     || 'Citi Club — Thursday lessons (Beginner and Intermediate).' || E'\n\n'
     || 'Detailed addresses and directions are on www.westinlille.fr — check the venue on your lesson''s page, it varies per time slot!'),
  ('inscriptions', 'ticket', 1, 'Inscriptions & tarifs', 'Registration & pricing',
   'Les inscriptions aux cours se font directement depuis l''application, onglet « Cours ».' || E'\n\n'
     || 'Les tarifs de la saison et les modalités (pass plusieurs cours, tarif réduit, cours d''essai) sont détaillés sur www.westinlille.fr.' || E'\n\n'
     || 'Une question ? Écrivez-nous à westinlille@gmail.com.',
   'Lesson registration happens right in the app, in the "Lessons" tab.' || E'\n\n'
     || 'Season pricing and options (multi-lesson passes, reduced rates, trial lesson) are detailed on www.westinlille.fr.' || E'\n\n'
     || 'Questions? Write to westinlille@gmail.com.'),
  ('association', 'people', 2, 'L''association', 'The association',
   'West in Lille, c''est l''association du West Coast Swing à Lille : des cours toute l''année pour tous les niveaux, des soirées pour danser et une communauté accueillante.' || E'\n\n'
     || 'Le West Coast Swing est une danse de couple moderne et improvisée, qui se danse sur (presque) toutes les musiques : pop, RnB, blues…',
   'West in Lille is the West Coast Swing association in Lille: year-round lessons for every level, social dance parties and a welcoming community.' || E'\n\n'
     || 'West Coast Swing is a modern, improvised partner dance that works with (almost) any music: pop, RnB, blues…'),
  ('contact', 'chatbubbles', 3, 'Contact', 'Contact',
   'Site web : www.westinlille.fr' || E'\n\n'
     || 'Facebook : /WestInLille' || E'\n\n'
     || 'Mail : westinlille@gmail.com',
   'Website: www.westinlille.fr' || E'\n\n'
     || 'Facebook: /WestInLille' || E'\n\n'
     || 'Email: westinlille@gmail.com');

-- ---------- Festival (demo edition, to adapt) ----------
insert into public.editions (id, name, year, starts_on, ends_on, is_current) values
  ('11111111-1111-1111-1111-111111111111', 'Festival West in Lille', 2027, '2027-05-14', '2027-05-16', true);

insert into public.stages (id, edition_id, name, color, sort_order) values
  ('21111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Grande salle', '#7C5CFC', 0),
  ('21111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Studio', '#00A97F', 1);

insert into public.artists (id, edition_id, name, style, bio) values
  ('31111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'DJ Westie', 'West Coast Swing', 'Sélections pop, RnB et blues taillées pour le West Coast Swing.'),
  ('31111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Duo invité', 'Show WCS', 'Couple de danseurs invités pour les shows et les cours du week-end.');

insert into public.activities (edition_id, stage_id, artist_id, title, description, category, starts_at, ends_at, capacity) values
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', '31111111-1111-1111-1111-111111111112', 'Cours toutes niveaux', 'Cours de West Coast Swing avec le duo invité.', 'workshop', '2027-05-15 14:00+02', '2027-05-15 15:30+02', 40),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111112', 'Show des invités', 'Démonstration du couple invité.', 'other', '2027-05-15 21:30+02', '2027-05-15 22:00+02', null),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111111', 'Soirée dansante', 'Social dance jusqu''au bout de la nuit avec DJ Westie.', 'dance', '2027-05-15 22:00+02', '2027-05-16 02:00+02', null),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111111', 'Soirée d''ouverture', 'Première soirée du festival.', 'dance', '2027-05-14 21:00+02', '2027-05-15 01:00+02', null);

insert into public.floorplans (id, edition_id, name, image_url) values
  ('41111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Plan du festival', null)
on conflict (id) do nothing;

delete from public.floorplan_pois where floorplan_id = '41111111-1111-1111-1111-111111111111';
insert into public.floorplan_pois (floorplan_id, name, description, icon, x, y) values
  ('41111111-1111-1111-1111-111111111111', 'Grande salle', 'Soirées et shows', 'musical-notes', 0.35, 0.30),
  ('41111111-1111-1111-1111-111111111111', 'Studio', 'Cours et ateliers', 'body', 0.70, 0.45),
  ('41111111-1111-1111-1111-111111111111', 'Accueil / Inscriptions', 'Entrée principale', 'ticket', 0.50, 0.90),
  ('41111111-1111-1111-1111-111111111111', 'Buvette', 'Boissons et snacks', 'restaurant', 0.20, 0.65),
  ('41111111-1111-1111-1111-111111111111', 'Vestiaires', '', 'shirt', 0.85, 0.75);
