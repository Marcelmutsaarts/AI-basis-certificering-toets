-- AVD Voice-to-Voice Toets-app: seed casuspool (20 casussen)
-- Per casus: domains volgt de tags na de slash, bloom_category is de eerste vermelde Bloom-categorie.

-- Webinar 1
insert into casuses (webinar, code, prompt, domains, bloom_category) values
(1, '1A', 'Een collega zegt: ChatGPT verzint dingen, ik gebruik het niet meer. Wat is jouw reactie?', ARRAY['Kennis','Mindset'], 'Begrijpen'),
(1, '1B', 'Geef een voorbeeld van een prompt die jij vaak gebruikt en leg uit waarom je hem zo hebt opgebouwd.', ARRAY['Kennis'], 'Toepassen'),
(1, '1C', 'Wat verandert er in de onderwijspraktijk volgens jou als we van chatbots naar autonome agents gaan?', ARRAY['Kennis','Agency'], 'Begrijpen'),
(1, '1D', 'Een leerling vraagt: hoe weet ChatGPT dingen? Hoe leg jij dat uit op haar of zijn niveau?', ARRAY['Kennis','Pedagogiek'], 'Toepassen');

-- Webinar 2
insert into casuses (webinar, code, prompt, domains, bloom_category) values
(2, '2A', 'Beschrijf een GPT of GEM die jij hebt gebouwd of zou bouwen voor een van je docenttaken. Welke rol, welk doel, welke instructies geef je hem?', ARRAY['Kennis','Mindset'], 'Toepassen'),
(2, '2B', 'Voor welke docenttaak is AI volgens jou geen handige assistent? Waarom niet?', ARRAY['Mindset','Agency'], 'Analyseren'),
(2, '2C', 'Een collega laat AI rapportages schrijven en zet zijn naam eronder. Wat vind je daarvan?', ARRAY['Ethiek','Agency'], 'Evalueren'),
(2, '2D', 'Hoe voorkom je dat je AI-assistent-workflow leidt tot gemiddelde of inwisselbare output?', ARRAY['Mindset','Kennis'], 'Analyseren');

-- Webinar 3
insert into casuses (webinar, code, prompt, domains, bloom_category) values
(3, '3A', 'Een docent zegt: vanaf nu mag in mijn vak alleen nog mondeling getoetst worden. Wat is je reactie?', ARRAY['Pedagogiek'], 'Evalueren'),
(3, '3B', 'Geef een voorbeeld uit jouw vak van een opdracht die niet AI-ready is. Wat zou je veranderen?', ARRAY['Pedagogiek'], 'Analyseren'),
(3, '3C', 'Hoe verschuif je bij een profielwerkstuk de nadruk van eindproduct naar proces?', ARRAY['Pedagogiek'], 'Toepassen'),
(3, '3D', 'Wanneer is AI-proof toetsen volgens jou alsnog gerechtvaardigd?', ARRAY['Pedagogiek','Ethiek'], 'Evalueren');

-- Webinar 4
insert into casuses (webinar, code, prompt, domains, bloom_category) values
(4, '4A', 'Welke van Mollicks rollen (tutor of Socratisch, simulator, hulpmiddel, mentor, coach, procesbegeleider) zou jij in jouw vak inzetten en hoe?', ARRAY['Pedagogiek','Kennis'], 'Toepassen'),
(4, '4B', 'Een leerling gebruikt een tutorbot om zich op een toets voor te bereiden. Wat is hier wel en niet wenselijk aan?', ARRAY['Pedagogiek','Ethiek'], 'Evalueren'),
(4, '4C', 'Hoe zou je NotebookLM inzetten in jouw lespraktijk?', ARRAY['Pedagogiek','Kennis'], 'Toepassen'),
(4, '4D', 'Wat is het didactische verschil tussen een tutorbot en een Socratische bot?', ARRAY['Pedagogiek','Kennis'], 'Analyseren');

-- Webinar 5
insert into casuses (webinar, code, prompt, domains, bloom_category) values
(5, '5A', 'Wat is cognitive offloading en wanneer is het volgens jou wel of niet schadelijk in het leren?', ARRAY['Pedagogiek','Mindset'], 'Begrijpen'),
(5, '5B', 'Een docent voert leerlingdata in ChatGPT om feedbackbrieven te genereren. Beoordeel deze keuze.', ARRAY['Ethiek','Agency'], 'Evalueren'),
(5, '5C', 'Hoe weeg jij duurzaamheid mee in je AI-keuzes als docent?', ARRAY['Ethiek'], 'Evalueren'),
(5, '5D', 'Wat betekent EU AI Act artikel 4 voor jou als docent concreet?', ARRAY['Ethiek','Agency'], 'Begrijpen');
