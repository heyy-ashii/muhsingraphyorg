-- ============================================================================
-- MUHSINGRAPHY — archive seed
-- Mirrors src/lib/seed.ts. Replace `image_url` with the public URLs returned by
-- the `artwork-media` bucket once real photography is uploaded.
-- ============================================================================

insert into public.artworks
  (title, title_arabic, script_style, medium, dimensions, year, status,
   image_url, images, in_situ_image_url, is_featured, display_order, categories, description)
values
  ('The Unseen Light', 'النور الخفي', 'Thuluth',
   'Handmade lampblack ink & 24k gold leaf on Belgian linen',
   '120 x 90 cm / 47.2 x 35.4 in', '2024', 'Available',
   '/assets/artwork-01.jpg',
   array['/assets/artwork-01-detail-01.jpg', '/assets/artwork-01-detail-02.jpg', '/assets/artwork-01-detail-03.jpg'],
   null, true, 1,
   array['Classical Masters', 'Gold Leaf Works'],
   'A single monumental Thuluth line suspended in a field of silence. The gold is laid by hand across three sittings, each pass catching the light at a different hour.'),

  ('Breath of the Reed', 'نفس القلم', 'Jali Diwani',
   'Hand-ground soot ink on traditional Ahar glazed paper',
   '100 x 70 cm / 39.4 x 27.6 in', '2023', 'Private Collection',
   '/assets/artwork-01.jpg', '{}', null, true, 2,
   array['Classical Masters', 'Contemporary Canvases'],
   'Jali Diwani at its most fluid — a continuous breath carried across the page without a single lift of the qalam.'),

  ('Sacred Geometry No. VII', 'الهندسة المقدسة', 'Modern Kufic',
   'Mineral pigment & 24k gold leaf on museum-grade Belgian linen',
   '150 x 150 cm / 59.1 x 59.1 in', '2024', 'Available',
   '/assets/artwork-01.jpg', '{}', null, false, 3,
   array['Contemporary Canvases', 'Gold Leaf Works', 'Monumental Scales'],
   'Angular Kufic folded into a nine-point medallion. A study in proportion drawn entirely from the nuqta as the unit of measure.'),

  ('Stillness in Vermilion', 'سكون', 'Abstract',
   'Natural vermilion mineral pigment on glazed Ahar paper',
   '80 x 60 cm / 31.5 x 23.6 in', '2025', 'Reserved',
   '/assets/artwork-01.jpg', '{}', null, false, 4,
   array['Contemporary Canvases'],
   'Where the letter dissolves and only the gesture remains. The vermilion is ground in the studio from raw mineral.'),

  ('The Gilded Verse', 'الآية المذهبة', 'Thuluth',
   'Lampblack ink, hand-applied 24k Italian gold leaf on Belgian linen',
   '180 x 120 cm / 70.9 x 47.2 in', '2025', 'Available',
   '/assets/artwork-01.jpg', '{}', null, true, 5,
   array['Classical Masters', 'Gold Leaf Works', 'Monumental Scales'],
   'The atelier''s largest gilded commission to date — eleven sittings of ink, four of gilding, one of quiet.'),

  ('Nightfall Calligraphy', 'الليل', 'Nastaliq',
   'Handmade soot ink on toned Ahar paper, 24k gold accents',
   '70 x 100 cm / 27.6 x 39.4 in', '2022', 'Private Collection',
   '/assets/artwork-01.jpg', '{}', null, false, 6,
   array['Classical Masters'],
   'Nastaliq descending like dusk. Held in a private collection in Dubai.');

insert into public.inquiries (client_name, client_email, commission_type, message, status) values
  ('Helena Ruiz', 'helena.ruiz@atelier-madrid.es', 'Private Commission',
   'We are furnishing a private residence in Madrid and would like to discuss a monumental Thuluth panel for the stairwell.', 'New'),
  ('Omar Al-Rashid', 'o.alrashid@meridian-gallery.ae', 'Corporate / Hospitality',
   'Meridian Gallery is curating a group exhibition of contemporary Islamic art. We would like to represent three gilded works.', 'Responded'),
  ('Yuki Tanaka', 'y.tanaka@kyoto-print.jp', 'Editorial or Print',
   'Requesting permission and high-resolution files for a limited letterpress edition of your Kufic compositions.', 'Archived');
