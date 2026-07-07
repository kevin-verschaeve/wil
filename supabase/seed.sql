-- West in Lille — fixtures
--
-- Two clearly separated worlds:
--   • Association: year-round West Coast Swing lessons + association info pages
--     (info pages with edition_id = null).
--   • Festival: the "Westy Welsh" edition, its programme, guest pros and
--     festival-scoped info pages (edition_id set to the edition).
--
-- The Westy Welsh programme below is a realistic placeholder (the source page
-- could not be fetched automatically) — adapt titles, dates, pros and passes
-- from westinlille.odoo.com/westy-welsh via the in-app admin.
--
-- Re-runnable: it first deletes the rows it seeds (which cascades any
-- registrations attached to them), then inserts fresh data.

-- ---------- Reset seeded data ----------
delete from public.lessons where season = '2026-2027';
delete from public.info_pages where slug in (
  'lieux', 'inscriptions', 'association', 'contact',           -- association
  'westy-welsh', 'westy-pass', 'westy-acces',                  -- festival
  'acces', 'billetterie', 'sur-place'                          -- legacy demo
);
delete from public.editions where id = '11111111-1111-1111-1111-111111111111';

-- ============================================================
-- ASSOCIATION — cours de West Coast Swing, saison 2026-2027
-- ============================================================
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

-- ---------- Pages d'infos de l'association (edition_id = null) ----------
insert into public.info_pages (edition_id, slug, icon, sort_order, title_fr, title_en, body_fr, body_en) values
  (null, 'lieux', 'location', 0, 'Les lieux des cours', 'Venues',
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
  (null, 'inscriptions', 'ticket', 1, 'Inscriptions & tarifs', 'Registration & pricing',
   'Les inscriptions aux cours se font directement depuis l''application, onglet « Cours ».' || E'\n\n'
     || 'Les tarifs de la saison et les modalités (pass plusieurs cours, tarif réduit, cours d''essai) sont détaillés sur www.westinlille.fr.' || E'\n\n'
     || 'Une question ? Écrivez-nous à westinlille@gmail.com.',
   'Lesson registration happens right in the app, in the "Lessons" tab.' || E'\n\n'
     || 'Season pricing and options (multi-lesson passes, reduced rates, trial lesson) are detailed on www.westinlille.fr.' || E'\n\n'
     || 'Questions? Write to westinlille@gmail.com.'),
  (null, 'association', 'people', 2, 'L''association', 'The association',
   'West in Lille, c''est l''association du West Coast Swing à Lille : des cours toute l''année pour tous les niveaux, des soirées pour danser et une communauté accueillante.' || E'\n\n'
     || 'Le West Coast Swing est une danse de couple moderne et improvisée, qui se danse sur (presque) toutes les musiques : pop, RnB, blues…' || E'\n\n'
     || 'Chaque année, l''association organise son festival : le Westy Welsh (voir l''onglet « Festival »).',
   'West in Lille is the West Coast Swing association in Lille: year-round lessons for every level, social dance parties and a welcoming community.' || E'\n\n'
     || 'West Coast Swing is a modern, improvised partner dance that works with (almost) any music: pop, RnB, blues…' || E'\n\n'
     || 'Every year the association runs its own festival: the Westy Welsh (see the "Festival" tab).'),
  (null, 'contact', 'chatbubbles', 3, 'Contact', 'Contact',
   'Site web : www.westinlille.fr' || E'\n\n'
     || 'Facebook : /WestInLille' || E'\n\n'
     || 'Mail : westinlille@gmail.com',
   'Website: www.westinlille.fr' || E'\n\n'
     || 'Facebook: /WestInLille' || E'\n\n'
     || 'Email: westinlille@gmail.com');

-- ============================================================
-- FESTIVAL — Westy Welsh (édition en cours)
-- Contenu à adapter depuis westinlille.odoo.com/westy-welsh
-- ============================================================
insert into public.editions (id, name, year, starts_on, ends_on, is_current) values
  ('11111111-1111-1111-1111-111111111111', 'Westy Welsh', 2027, '2027-03-19', '2027-03-21', true);

-- Salles du festival
insert into public.stages (id, edition_id, name, color, sort_order) values
  ('21111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Grande salle', '#7C5CFC', 0),
  ('21111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Studio', '#00A97F', 1);

-- Artistes invités (pros & DJs)
insert into public.artists (id, edition_id, name, style, bio) values
  ('31111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Guest Pros', 'West Coast Swing', 'Couple de pros invité pour les workshops et les shows du week-end. À compléter avec les vrais noms de l''édition.'),
  ('31111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'DJ Westy', 'WCS DJ', 'Aux platines des soirées : pop, RnB, blues et grooves pour danser jusqu''au bout de la nuit.');

-- Programme : workshops, socials et compétitions
insert into public.activities (edition_id, stage_id, artist_id, title, description, category, starts_at, ends_at, capacity) values
  -- Vendredi soir
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111112', 'Welcome party', 'Soirée d''ouverture du Westy Welsh — social dance et retrouvailles.', 'dance', '2027-03-19 21:00+01', '2027-03-20 02:00+01', null),
  -- Samedi — workshops
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', '31111111-1111-1111-1111-111111111111', 'Workshop Novice', 'Atelier niveau novice avec les pros invités.', 'workshop', '2027-03-20 10:30+01', '2027-03-20 11:45+01', 40),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', '31111111-1111-1111-1111-111111111111', 'Workshop Intermédiaire', 'Atelier niveau intermédiaire : musicalité et connexion.', 'workshop', '2027-03-20 12:00+01', '2027-03-20 13:15+01', 40),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', '31111111-1111-1111-1111-111111111111', 'Workshop Avancé', 'Atelier niveau avancé : technique et styling.', 'workshop', '2027-03-20 14:30+01', '2027-03-20 15:45+01', 40),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', null, 'Jack & Jill — Prélims', 'Préliminaires de la compétition Jack & Jill, tous niveaux.', 'talk', '2027-03-20 16:30+01', '2027-03-20 18:00+01', null),
  -- Samedi soir — gala
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111111', 'Show des pros', 'Démonstration des pros invités.', 'other', '2027-03-20 21:30+01', '2027-03-20 22:00+01', null),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111112', 'Gala night', 'La grande soirée du festival avec DJ Westy.', 'dance', '2027-03-20 22:00+01', '2027-03-21 04:00+01', null),
  -- Dimanche
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', '31111111-1111-1111-1111-111111111111', 'Workshop All-star', 'Atelier avancé/all-star pour finir le week-end en beauté.', 'workshop', '2027-03-21 11:00+01', '2027-03-21 12:15+01', 40),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', null, 'Jack & Jill — Finales', 'Finales de la compétition Jack & Jill et remise des prix.', 'talk', '2027-03-21 14:00+01', '2027-03-21 15:30+01', null),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111112', 'Farewell social', 'Dernière danse tous ensemble avant l''année prochaine.', 'dance', '2027-03-21 15:30+01', '2027-03-21 18:00+01', null);

-- Pages d'infos du festival (edition_id = Westy Welsh)
insert into public.info_pages (edition_id, slug, icon, sort_order, title_fr, title_en, body_fr, body_en) values
  ('11111111-1111-1111-1111-111111111111', 'westy-welsh', 'sparkles', 0, 'Le Westy Welsh', 'The Westy Welsh',
   'Le Westy Welsh, c''est le festival de West Coast Swing de West in Lille : un week-end de workshops avec des pros invités, de compétitions Jack & Jill et de soirées dansantes.' || E'\n\n'
     || 'Programme, line-up et infos pratiques sont dans cet onglet. Construisez votre week-end en ajoutant les activités à « Mon planning ».' || E'\n\n'
     || 'Programme prévisionnel — détails à confirmer sur www.westinlille.fr/westy-welsh.',
   'The Westy Welsh is West in Lille''s West Coast Swing festival: a weekend of workshops with guest pros, Jack & Jill competitions and social dance parties.' || E'\n\n'
     || 'Programme, lineup and practical info are in this tab. Build your weekend by adding activities to "My schedule".' || E'\n\n'
     || 'Provisional programme — details to be confirmed on www.westinlille.fr/westy-welsh.'),
  ('11111111-1111-1111-1111-111111111111', 'westy-pass', 'ticket', 1, 'Pass & tarifs', 'Passes & pricing',
   'Full Pass — accès à tous les workshops, compétitions et soirées du week-end.' || E'\n\n'
     || 'Party Pass — accès aux soirées uniquement (welcome party, gala night, farewell).' || E'\n\n'
     || 'Les tarifs et la billetterie sont sur www.westinlille.fr/westy-welsh.',
   'Full Pass — access to all workshops, competitions and parties of the weekend.' || E'\n\n'
     || 'Party Pass — parties only (welcome party, gala night, farewell).' || E'\n\n'
     || 'Pricing and tickets on www.westinlille.fr/westy-welsh.'),
  ('11111111-1111-1111-1111-111111111111', 'westy-acces', 'car', 2, 'Accès & hébergement', 'Getting there & staying',
   'Le festival se tient à Lille, accessible en métro et en train (gares Lille-Flandres et Lille-Europe).' || E'\n\n'
     || 'Des hôtels partenaires et des solutions de covoiturage sont proposés sur www.westinlille.fr/westy-welsh.',
   'The festival takes place in Lille, reachable by metro and train (Lille-Flandres and Lille-Europe stations).' || E'\n\n'
     || 'Partner hotels and carpooling options are listed on www.westinlille.fr/westy-welsh.');

-- Plan du festival
insert into public.floorplans (id, edition_id, name, image_url) values
  ('41111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Plan du festival', null)
on conflict (id) do nothing;

delete from public.floorplan_pois where floorplan_id = '41111111-1111-1111-1111-111111111111';
insert into public.floorplan_pois (floorplan_id, name, description, icon, x, y) values
  ('41111111-1111-1111-1111-111111111111', 'Grande salle', 'Soirées, shows et compétitions', 'musical-notes', 0.35, 0.30),
  ('41111111-1111-1111-1111-111111111111', 'Studio', 'Workshops', 'body', 0.70, 0.45),
  ('41111111-1111-1111-1111-111111111111', 'Accueil / Pass', 'Retrait des pass', 'ticket', 0.50, 0.90),
  ('41111111-1111-1111-1111-111111111111', 'Buvette', 'Boissons et snacks', 'restaurant', 0.20, 0.65),
  ('41111111-1111-1111-1111-111111111111', 'Vestiaires', '', 'shirt', 0.85, 0.75);
