-- West in Lille — fixtures
--
-- Two clearly separated worlds:
--   • Association: year-round West Coast Swing lessons + association info pages
--     (info pages with edition_id = null).
--   • Festival: the "Westy Welsh" edition, its programme, guest pros and
--     festival-scoped info pages (edition_id set to the edition).
--
-- The Westy Welsh content comes from westinlille.odoo.com/westy-welsh
-- (edition 2026, 29–31 May, Btwin Village). The detailed workshop timetable
-- and prices are published as images on the site — the workshop times below
-- are provisional placeholders to refine via the in-app admin.
--
-- Re-runnable: it first deletes the rows it seeds (which cascades any
-- registrations attached to them), then inserts fresh data.

-- ---------- Reset seeded data ----------
delete from public.lessons where season = '2026-2027';
delete from public.info_pages where slug in (
  'lieux', 'inscriptions', 'association', 'contact',                                          -- association
  'westy-welsh', 'westy-niveaux', 'westy-pass', 'westy-acces', 'westy-resto', 'westy-loger',  -- festival
  'acces', 'billetterie', 'sur-place'                                                         -- legacy demo
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
-- FESTIVAL — Westy Welsh 2026 (édition en cours)
-- « The Event lillois 100% social WCS » — 29 au 31 mai 2026, Btwin Village
-- ============================================================
insert into public.editions (id, name, year, starts_on, ends_on, is_current) values
  ('11111111-1111-1111-1111-111111111111', 'Westy Welsh', 2026, '2026-05-29', '2026-05-31', true);

-- Les 2 salles du Btwin Village (espace de soirée de plus de 800 m², climatisé)
insert into public.stages (id, edition_id, name, color, sort_order) values
  ('21111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Grande salle', '#7C5CFC', 0),
  ('21111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Salle 2', '#00A97F', 1);

-- Le pro staff : 2 couples de champions
insert into public.artists (id, edition_id, name, style, bio) values
  ('31111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Ken & Bryn', 'Champions US — vibe hiphop', 'Top 2 à l''US Open, Ken et Bryn sont connus pour leur vibe hiphop et détendue, ainsi que leur précision technique et leur très riche interprétation musicale 😍 Plein d''humour et très accessibles, ce duo très rarement présent en France va nous en mettre plein les yeux et plein le cœur.'),
  ('31111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Joao & Savana', 'Technique & shows', 'On ne peut plus s''en passer : leur énergie, leur bonne humeur, leur complicité font partie de la recette à succès du Westy Welsh. Attendez-vous à des cours remplis de technique et de bienveillance, à des shows incroyables et à des chorés toujours plus renversantes 😊');

-- Programme (horaires prévisionnels — le planning détaillé par niveau est à
-- affiner dans l'admin à partir du programme officiel publié sur le site)
insert into public.activities (edition_id, stage_id, artist_id, title, description, category, starts_at, ends_at, capacity) values
  -- Vendredi 29 mai
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', '31111111-1111-1111-1111-111111111111', 'Intensif « Mets du HipHop dans ton WCS » — Follower avec Bryn', '1h30 avec votre championne pour apprendre à placer des mouvements de hiphop dans vos basics de WCS. Inscription sans partenaire.', 'workshop', '2026-05-29 18:30+02', '2026-05-29 20:00+02', 30),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111111', 'Intensif « Mets du HipHop dans ton WCS » — Leader avec Ken', '1h30 avec votre champion pour apprendre à placer des mouvements de hiphop dans vos basics de WCS. Inscription sans partenaire.', 'workshop', '2026-05-29 18:30+02', '2026-05-29 20:00+02', 30),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', null, 'Soirée du vendredi', '100% social dancing pour lancer le week-end — jusqu''à 3h du matin !', 'dance', '2026-05-29 21:00+02', '2026-05-30 03:00+02', null),
  -- Samedi 30 mai — cours par niveau (créneaux prévisionnels)
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111111', 'Cours Niveau 1 & 2', 'Workshops avec Ken & Bryn et Joao & Savana — 5h30 de cours par niveau sur le week-end.', 'workshop', '2026-05-30 10:00+02', '2026-05-30 13:00+02', null),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', '31111111-1111-1111-1111-111111111112', 'Cours Niveau 3, 4 & Nov/Inter', 'Workshops avec les deux couples de champions — technique, musicalité et styling.', 'workshop', '2026-05-30 10:00+02', '2026-05-30 13:00+02', null),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111112', 'Atelier « Choré fun leader & follow styling »', 'L''atelier chorégraphie du week-end, fun et ouvert à tous les niveaux du stage.', 'workshop', '2026-05-30 14:30+02', '2026-05-30 16:00+02', null),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', '31111111-1111-1111-1111-111111111111', 'Cours par niveau — après-midi', 'Suite des workshops par niveau avec le pro staff.', 'workshop', '2026-05-30 16:15+02', '2026-05-30 18:15+02', null),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', null, 'Dîner traiteur — Saveurs et Chefs', 'Le restaurant vient à nous ! Notre traiteur Rémy régale nos papilles avec une sélection de plats. Maximum 100 places, au Btwin Village.', 'other', '2026-05-30 20:00+02', '2026-05-30 21:30+02', 100),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111112', 'Soirée du samedi — avec shows !', 'La grande soirée du Westy Welsh : shows de Ken & Bryn et de Joao & Savana, social dancing jusqu''à 4h !', 'dance', '2026-05-30 21:30+02', '2026-05-31 04:00+02', null),
  -- Dimanche 31 mai
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', '31111111-1111-1111-1111-111111111111', 'Cours par niveau — dimanche', 'Derniers workshops du week-end avec le pro staff.', 'workshop', '2026-05-31 11:00+02', '2026-05-31 13:30+02', null),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', null, 'Soirée du dimanche — farewell', 'Dernière danse tous ensemble pour clore le week-end (16h-18h).', 'dance', '2026-05-31 16:00+02', '2026-05-31 18:00+02', null);

-- Pages d'infos du festival (edition_id = Westy Welsh)
insert into public.info_pages (edition_id, slug, icon, sort_order, title_fr, title_en, body_fr, body_en) values
  ('11111111-1111-1111-1111-111111111111', 'westy-welsh', 'sparkles', 0, 'Bienvenue au Westy Welsh 2026', 'Welcome to Westy Welsh 2026',
   '🔥 Votre stage lillois 100% West Coast Swing, du 29 au 31 mai 2026, organisé par West in Lille !' || E'\n\n'
     || '😍 2 couples de champions : Ken & Bryn et Joao & Savana.' || E'\n\n'
     || '👨‍🎓 5 niveaux, un atelier de « choré fun leader et follow styling », 5h30 de cours par niveau !' || E'\n\n'
     || '💃 3 soirées : vendredi (jusqu''à 3h), samedi (jusqu''à 4h avec shows !), dimanche (16h-18h) — horaires prévisionnels.' || E'\n\n'
     || '😎 Un nouveau lieu : 2 salles pour un espace de soirée de plus de 800 m², climatisé et DANS Lille 🤩' || E'\n\n'
     || 'Du 100% social dancing pour profiter à 100% de votre week-end et découvrir notre belle ville en même temps !' || E'\n\n'
     || '🔥 NOUVEAU : intensifs « Mets du HipHop dans ton WCS » le vendredi soir — inscris-toi sans partenaire à l''intensif follower avec Bryn ou leader avec Ken !' || E'\n\n'
     || 'Inscriptions : formulaire en ligne sur westinlille.odoo.com/westy-welsh (bouton « Je m''inscris à l''event ! »).',
   '🔥 Your 100% West Coast Swing weekend in Lille, 29–31 May 2026, organised by West in Lille!' || E'\n\n'
     || '😍 2 couples of champions: Ken & Bryn and Joao & Savana.' || E'\n\n'
     || '👨‍🎓 5 levels, a fun "leader & follow styling" choreo workshop, 5.5 hours of classes per level!' || E'\n\n'
     || '💃 3 parties: Friday (until 3am), Saturday (until 4am with shows!), Sunday (4–6pm) — provisional times.' || E'\n\n'
     || '😎 A new venue: 2 rooms, an air-conditioned 800 m² party space, right in Lille 🤩' || E'\n\n'
     || '100% social dancing to enjoy your weekend to the fullest and discover our beautiful city!' || E'\n\n'
     || '🔥 NEW: "Put some HipHop in your WCS" intensives on Friday evening — register solo for the follower intensive with Bryn or the leader intensive with Ken!' || E'\n\n'
     || 'Registration: online form at westinlille.odoo.com/westy-welsh.'),
  ('11111111-1111-1111-1111-111111111111', 'westy-niveaux', 'school', 1, 'Les niveaux', 'Levels',
   'Niveau 1 — J''ai démarré en septembre 2025 ou janvier 2026. Je suis MOTIVÉ·E 💃🕺' || E'\n\n'
     || 'Niveau 2 — C''est ma seconde année de WCS, je commence à être à l''aise sur les classiques. Je commence les choses sérieuses ! 😤' || E'\n\n'
     || 'Niveau 3 — Je suis complètement à l''aise sur tous les classiques et je fais déjà des variations. Je veux travailler la musicalité, le styling et des variations plus complexes 🪩' || E'\n\n'
     || 'Niveau 4 — Avancé : j''ai une large expérience du WCS, je fais beaucoup de stages et d''événements nationaux, et je veux me challenger ! 💪' || E'\n\n'
     || 'Niveau Nov/Inter WSDC — Cours technique et challengeant, je sais à quoi m''attendre 🤜🤛 Prérequis : au moins 1 point WSDC en compétition Novice.',
   'Level 1 — I started in September 2025 or January 2026. I am MOTIVATED 💃🕺' || E'\n\n'
     || 'Level 2 — My second year of WCS, getting comfortable with the classics. Time to get serious! 😤' || E'\n\n'
     || 'Level 3 — Fully comfortable with all the classics and already doing variations. I want to work on musicality, styling and more complex variations 🪩' || E'\n\n'
     || 'Level 4 — Advanced: broad WCS experience, lots of workshops and national events, here to challenge myself! 💪' || E'\n\n'
     || 'Nov/Inter WSDC level — Technical and challenging classes 🤜🤛 Prerequisite: at least 1 WSDC point in Novice competition.'),
  ('11111111-1111-1111-1111-111111111111', 'westy-pass', 'ticket', 2, 'Les pass et tarifs', 'Passes & pricing',
   'La grille complète des pass et tarifs est publiée sur westinlille.odoo.com/westy-welsh.' || E'\n\n'
     || 'Inscriptions à l''event : formulaire en ligne (bouton « Je m''inscris à l''event ! » sur le site).' || E'\n\n'
     || 'Intensifs HipHop du vendredi : inscription séparée, tarifs imbattables pour profiter de la venue de nos champions américains :)' || E'\n\n'
     || 'Retrouvez aussi l''événement sur Facebook : Event Westy Welsh.',
   'The full pass & price grid is published on westinlille.odoo.com/westy-welsh.' || E'\n\n'
     || 'Event registration: online form ("Je m''inscris à l''event !" button on the website).' || E'\n\n'
     || 'Friday HipHop intensives: separate registration, unbeatable prices to make the most of our American champions'' visit :)' || E'\n\n'
     || 'Also find the event on Facebook.'),
  ('11111111-1111-1111-1111-111111111111', 'westy-acces', 'car', 3, 'Lieu, transport et plan d''accès', 'Venue & getting there',
   '📍 Lieu : Btwin Village, 4 rue Professeur Langevin, 59000 Lille (France).' || E'\n\n'
     || 'Parking sur place, accès immédiat depuis l''A1, rocade sud de Lille.' || E'\n\n'
     || 'En transports en commun lillois :' || E'\n'
     || '• Métro : Porte de Valenciennes' || E'\n'
     || '• Bus : ligne 52, arrêt Frères Lumières' || E'\n'
     || '• V''Lille : borne directement au pied de l''event' || E'\n\n'
     || 'En train : TGV gare Lille Flandres ou Lille Europe puis métro. Eurostar London St Pancras – Lille Europe, Thalys Brussels – Lille.' || E'\n\n'
     || 'En avion : aéroport de Lille Lesquin + 10 min de taxi, ou Paris CDG + 55 min de TGV puis métro.',
   '📍 Venue: Btwin Village, 4 rue Professeur Langevin, 59000 Lille (France).' || E'\n\n'
     || 'On-site parking, direct access from the A1 motorway (Lille south ring road).' || E'\n\n'
     || 'By Lille public transport:' || E'\n'
     || '• Metro: Porte de Valenciennes' || E'\n'
     || '• Bus: line 52, Frères Lumières stop' || E'\n'
     || '• V''Lille bike share: station right at the venue' || E'\n\n'
     || 'By train: TGV to Lille Flandres or Lille Europe then metro. Eurostar London St Pancras – Lille Europe, Thalys Brussels – Lille.' || E'\n\n'
     || 'By plane: Lille Lesquin airport + 10 min taxi, or Paris CDG + 55 min TGV then metro.'),
  ('11111111-1111-1111-1111-111111111111', 'westy-resto', 'restaurant', 4, 'Restauration', 'Food',
   'Samedi soir — cette année, il n''y avait pas de resto pratique dans les alentours, alors le restaurant vient à nous !' || E'\n\n'
     || 'Notre traiteur Rémy de « Saveurs et Chefs » vient régaler nos papilles avec une sélection de plats. Maximum 100 places, au Btwin Village, samedi soir à 20h — pensez à réserver depuis le programme !',
   'Saturday evening — no convenient restaurant nearby this year, so the restaurant comes to us!' || E'\n\n'
     || 'Our caterer Rémy from "Saveurs et Chefs" will treat us to a selection of dishes. Maximum 100 seats, at the Btwin Village, Saturday 8pm — remember to book from the programme!'),
  ('11111111-1111-1111-1111-111111111111', 'westy-loger', 'bed', 5, 'Se loger et se véhiculer', 'Staying & getting around',
   '🏨 Hôtels partenaires :' || E'\n'
     || '• Best Western Urban Hôtel & Rococo Restaurant — 48bis rue de Valenciennes, 59000 Lille' || E'\n'
     || '• MOXY Lille City — rue Jean Bart, 59000 Lille' || E'\n\n'
     || 'Il existe d''autres hôtels plus proches du lieu de l''évènement, mais dont nous ne pouvons pas garantir le niveau de service.' || E'\n\n'
     || '🚗 Covoiturage — on aime partager les totos ! Un document partagé permet de proposer ou trouver un covoiturage au départ de Lille ou d''ailleurs (lien sur westinlille.odoo.com/westy-welsh).',
   '🏨 Partner hotels:' || E'\n'
     || '• Best Western Urban Hôtel & Rococo Restaurant — 48bis rue de Valenciennes, 59000 Lille' || E'\n'
     || '• MOXY Lille City — rue Jean Bart, 59000 Lille' || E'\n\n'
     || 'Other hotels are closer to the venue but we cannot vouch for their level of service.' || E'\n\n'
     || '🚗 Carpooling — a shared document lets you offer or find a ride from Lille or elsewhere (link on westinlille.odoo.com/westy-welsh).');

-- Plan du site — Btwin Village
insert into public.floorplans (id, edition_id, name, image_url) values
  ('41111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Btwin Village — 4 rue Professeur Langevin, Lille', null)
on conflict (id) do nothing;

delete from public.floorplan_pois where floorplan_id = '41111111-1111-1111-1111-111111111111';
insert into public.floorplan_pois (floorplan_id, name, description, icon, x, y) values
  ('41111111-1111-1111-1111-111111111111', 'Grande salle', 'Soirées, shows et cours', 'musical-notes', 0.35, 0.30),
  ('41111111-1111-1111-1111-111111111111', 'Salle 2', 'Cours et intensifs', 'body', 0.70, 0.45),
  ('41111111-1111-1111-1111-111111111111', 'Accueil / Pass', 'Retrait des pass', 'ticket', 0.50, 0.90),
  ('41111111-1111-1111-1111-111111111111', 'Espace traiteur', 'Dîner du samedi (Saveurs et Chefs)', 'restaurant', 0.20, 0.65),
  ('41111111-1111-1111-1111-111111111111', 'Vestiaires', '', 'shirt', 0.85, 0.75),
  ('41111111-1111-1111-1111-111111111111', 'Parking', 'Parking sur place, accès A1', 'car', 0.12, 0.15);
