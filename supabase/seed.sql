-- Demo data: one festival edition with stages, artists, activities,
-- a floorplan, info pages and a season of dance lessons.

insert into public.editions (id, name, year, starts_on, ends_on, is_current) values
  ('11111111-1111-1111-1111-111111111111', 'Festival WIL', 2026, '2026-08-21', '2026-08-23', true);

insert into public.stages (id, edition_id, name, color, sort_order) values
  ('21111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Grande Scène', '#7C5CFC', 0),
  ('21111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Scène Jardin', '#00A97F', 1),
  ('21111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'Studio Danse', '#FF7A00', 2);

insert into public.artists (id, edition_id, name, style, bio) values
  ('31111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Les Éclats', 'Électro swing', 'Un quintette qui mélange swing des années 30 et beats électroniques. Leur live est une invitation permanente à danser.'),
  ('31111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Maëlle K', 'Chanson française', 'Autrice-compositrice, Maëlle K écrit des chansons à fleur de peau portées par une voix singulière.'),
  ('31111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'Tango Nuevo Trio', 'Tango', 'Bandonéon, violon et piano : le trio revisite Piazzolla et fait vibrer les milongas.'),
  ('31111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', 'DJ Solstice', 'House / Disco', 'Figure des nuits lyonnaises, DJ Solstice fait le pont entre disco 70s et house contemporaine.');

insert into public.activities (edition_id, stage_id, artist_id, title, description, category, starts_at, ends_at, capacity) values
  -- Vendredi
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111112', 'Maëlle K en concert', 'Concert d''ouverture du festival.', 'concert', '2026-08-21 19:00+02', '2026-08-21 20:15+02', null),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111111', 'Les Éclats — release party', 'Le nouvel album joué en avant-première.', 'concert', '2026-08-21 21:00+02', '2026-08-21 22:30+02', null),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', '31111111-1111-1111-1111-111111111114', 'DJ Solstice — Opening set', 'Warm-up disco au coucher du soleil.', 'concert', '2026-08-21 22:30+02', '2026-08-22 00:30+02', null),
  -- Samedi
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111113', null, 'Initiation tango', 'Atelier découverte du tango argentin, ouvert à tous, en couple ou en solo.', 'workshop', '2026-08-22 14:00+02', '2026-08-22 15:30+02', 24),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111113', null, 'Atelier swing & lindy hop', 'Les bases du lindy hop dans la bonne humeur.', 'workshop', '2026-08-22 16:00+02', '2026-08-22 17:30+02', 30),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111113', 'Tango Nuevo Trio', 'Concert suivi d''une milonga ouverte.', 'concert', '2026-08-22 19:30+02', '2026-08-22 21:00+02', null),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', null, 'Milonga sous les étoiles', 'Bal tango ouvert à toutes et tous.', 'dance', '2026-08-22 21:30+02', '2026-08-23 00:00+02', null),
  -- Dimanche
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111112', null, 'Scène ouverte', 'Amateurs et associations locales prennent la scène.', 'other', '2026-08-23 14:00+02', '2026-08-23 16:00+02', null),
  ('11111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111111', 'Les Éclats — bal de clôture', 'Grand bal swing de clôture du festival.', 'dance', '2026-08-23 17:00+02', '2026-08-23 19:00+02', null);

insert into public.floorplans (id, edition_id, name, image_url) values
  ('41111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Site du festival', null);

insert into public.floorplan_pois (floorplan_id, name, description, icon, x, y) values
  ('41111111-1111-1111-1111-111111111111', 'Grande Scène', 'Scène principale', 'musical-notes', 0.30, 0.25),
  ('41111111-1111-1111-1111-111111111111', 'Scène Jardin', 'Scène extérieure', 'leaf', 0.72, 0.35),
  ('41111111-1111-1111-1111-111111111111', 'Studio Danse', 'Ateliers et cours', 'body', 0.55, 0.60),
  ('41111111-1111-1111-1111-111111111111', 'Entrée / Billetterie', 'Accès principal', 'ticket', 0.50, 0.92),
  ('41111111-1111-1111-1111-111111111111', 'Buvette & food trucks', 'Restauration sur place', 'restaurant', 0.20, 0.70),
  ('41111111-1111-1111-1111-111111111111', 'Toilettes', '', 'man', 0.85, 0.75),
  ('41111111-1111-1111-1111-111111111111', 'Poste de secours', 'Premiers secours', 'medkit', 0.12, 0.45);

insert into public.info_pages (slug, icon, sort_order, title_fr, title_en, body_fr, body_en) values
  ('acces', 'car', 0, 'Accès & transports', 'Getting there',
   'Le festival se tient au Parc des Berges.' || E'\n\n' || 'En transports en commun : bus 12 et 34, arrêt « Berges ». Un service de navettes gratuites circule entre la gare et le site de 12h à 1h du matin.' || E'\n\n' || 'En voiture : parking gratuit à 500 m de l''entrée. Le covoiturage est encouragé !',
   'The festival takes place at Parc des Berges.' || E'\n\n' || 'By public transport: buses 12 and 34, "Berges" stop. Free shuttles run between the train station and the site from noon to 1am.' || E'\n\n' || 'By car: free parking 500 m from the entrance. Carpooling is encouraged!'),
  ('billetterie', 'ticket', 1, 'Billetterie', 'Tickets',
   'Pass 3 jours : 45 €. Billet journée : 20 €. Gratuit pour les moins de 12 ans.' || E'\n\n' || 'Les ateliers de danse sont inclus dans le billet mais nécessitent une inscription (places limitées) — inscrivez-vous depuis le programme.',
   '3-day pass: €45. Day ticket: €20. Free for children under 12.' || E'\n\n' || 'Dance workshops are included in the ticket but require registration (limited places) — sign up from the programme.'),
  ('sur-place', 'restaurant', 2, 'Sur place', 'On site',
   'Buvette et food trucks locaux, options végétariennes. Paiement en CB partout sur le site.' || E'\n\n' || 'Gobelets réutilisables (consigne 1 €). Site accessible aux personnes à mobilité réduite.',
   'Local food trucks and bar, vegetarian options. Card payment everywhere on site.' || E'\n\n' || 'Reusable cups (€1 deposit). The site is accessible to people with reduced mobility.'),
  ('association', 'people', 3, 'L''association', 'The association',
   'Le festival est organisé par l''association WIL, qui propose toute l''année des cours de danse : tango, swing, danses de bal.' || E'\n\n' || 'Retrouvez les cours et inscriptions dans l''onglet « Cours » de l''application.',
   'The festival is organised by the WIL association, which offers dance lessons all year round: tango, swing and ballroom dances.' || E'\n\n' || 'Find lessons and registrations in the "Lessons" tab of the app.');

insert into public.lessons (season, title, description, level, teacher_name, weekday, start_time, end_time, location, capacity, starts_on, ends_on) values
  ('2026-2027', 'Tango débutant', 'Découverte du tango argentin : marche, abrazo, premières figures. Aucun prérequis, pas besoin de venir en couple.', 'beginner', 'Claire & Antoine', 2, '19:00', '20:15', 'Salle des fêtes, Wil', 20, '2026-09-15', '2027-06-15'),
  ('2026-2027', 'Tango intermédiaire', 'Approfondissement : ochos, giros, musicalité.', 'intermediate', 'Claire & Antoine', 2, '20:30', '21:45', 'Salle des fêtes, Wil', 20, '2026-09-15', '2027-06-15'),
  ('2026-2027', 'Lindy hop', 'Swing et lindy hop pour tous niveaux, dans la bonne humeur.', 'all', 'Sophie', 4, '19:30', '21:00', 'Gymnase du centre', 26, '2026-09-17', '2027-06-17'),
  ('2026-2027', 'Danses de bal', 'Valse, cha-cha, rock : les indispensables des mariages et des bals.', 'all', 'Marc', 5, '18:30', '19:45', 'Salle des fêtes, Wil', 24, '2026-09-18', '2027-06-18');
