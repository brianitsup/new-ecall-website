-- Create posts table with slug support
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  image TEXT,
  author TEXT NOT NULL DEFAULT 'ECall Health Center',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug);
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts(published);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published posts
CREATE POLICY "Allow public read access to published posts" ON posts
  FOR SELECT USING (published = true);

-- Create policy to allow authenticated users to manage posts
CREATE POLICY "Allow authenticated users to manage posts" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample posts
INSERT INTO posts (title, content, excerpt, slug, category, image, author, published) VALUES
(
  'Welcome to ECall Health Center',
  '<p>We''re excited to announce the launch of our new health center, providing comprehensive medical services to our community. Our state-of-the-art facility is equipped with modern medical equipment and staffed by experienced healthcare professionals.</p>

<h2>Our Services</h2>
<p>At ECall Health Center, we offer a wide range of medical services including:</p>
<ul>
<li>General medical consultations</li>
<li>Maternal and child healthcare</li>
<li>Laboratory services</li>
<li>Ultrasound imaging</li>
<li>Minor surgical procedures</li>
<li>Dental services</li>
</ul>

<h2>Our Commitment</h2>
<p>We are committed to providing quality healthcare services that are accessible and affordable to all members of our community. Our team of dedicated healthcare professionals is here to serve you with compassion and expertise.</p>

<p>Visit us today and experience the difference that quality healthcare can make in your life.</p>',
  'We''re excited to announce the launch of our new health center, providing comprehensive medical services to our community.',
  'welcome-to-ecall-health-center',
  'Clinic News',
  '/images/hero.jpeg',
  'Dr. Sarah Johnson',
  true
),
(
  'New Maternal Health Program',
  '<p>We''re proud to introduce our comprehensive maternal health program, designed to support expecting mothers throughout their pregnancy journey and beyond.</p>

<h2>Program Features</h2>
<p>Our maternal health program includes:</p>
<ul>
<li>Regular prenatal checkups and monitoring</li>
<li>Nutritional counseling and education</li>
<li>Ultrasound services</li>
<li>Labor and delivery support</li>
<li>Postnatal care and breastfeeding support</li>
<li>Family planning services</li>
</ul>

<h2>Expert Care Team</h2>
<p>Our maternal health team consists of experienced obstetricians, midwives, and nurses who are dedicated to ensuring the health and safety of both mother and baby.</p>

<p>To learn more about our maternal health program or to schedule an appointment, please contact us today.</p>',
  'Our new maternal health program offers comprehensive care for expecting mothers, including prenatal checkups and health education.',
  'new-maternal-health-program',
  'Programs',
  '/images/maternal-child-healthcare.png',
  'Dr. Mary Wilson',
  true
),
(
  'Health Tips for the Rainy Season',
  '<p>The rainy season brings relief from the heat, but it also brings increased risk of certain illnesses. Here are some essential tips to help you stay healthy during this time.</p>

<h2>Common Rainy Season Illnesses</h2>
<p>During the rainy season, we often see an increase in:</p>
<ul>
<li>Malaria and dengue fever</li>
<li>Respiratory infections</li>
<li>Diarrheal diseases</li>
<li>Skin infections</li>
<li>Food poisoning</li>
</ul>

<h2>Prevention Tips</h2>
<p>To protect yourself and your family:</p>
<ul>
<li>Use mosquito nets and repellents</li>
<li>Drink only clean, boiled water</li>
<li>Eat freshly cooked food</li>
<li>Keep your surroundings clean and dry</li>
<li>Wash your hands frequently</li>
<li>Avoid walking in stagnant water</li>
</ul>

<p>If you experience any symptoms of illness, don''t hesitate to visit our clinic for proper diagnosis and treatment.</p>',
  'Stay healthy during the rainy season with these essential tips for preventing common illnesses and maintaining good health.',
  'health-tips-rainy-season',
  'Health Tips',
  '/images/medical-consultations.png',
  'Dr. James Brown',
  true
),
(
  'Community Outreach Program Launch',
  '<p>We''re launching a new community outreach program to bring healthcare services directly to underserved areas in our region.</p>

<h2>Program Objectives</h2>
<p>Our community outreach program aims to:</p>
<ul>
<li>Provide basic healthcare services to remote communities</li>
<li>Conduct health education workshops</li>
<li>Offer preventive care and screenings</li>
<li>Connect communities with our main health center</li>
<li>Train local health volunteers</li>
</ul>

<h2>Mobile Health Units</h2>
<p>We''ve equipped mobile health units with essential medical equipment and supplies to serve communities that have limited access to healthcare facilities.</p>

<p>Our outreach team will visit different communities on a rotating schedule. Contact us to learn when we''ll be in your area.</p>',
  'We''re launching a new community outreach program to bring healthcare services directly to underserved areas in our region.',
  'community-outreach-program-launch',
  'Community Outreach',
  '/images/ecall-specialists.jpeg',
  'Dr. Michael Davis',
  true
),
(
  'Preventive Care: Your First Line of Defense',
  '<p>Preventive care is one of the most important aspects of maintaining good health. Regular check-ups and screenings can help detect health issues early, when they''re most treatable.</p>

<h2>Types of Preventive Care</h2>
<p>Preventive care includes:</p>
<ul>
<li>Annual physical examinations</li>
<li>Vaccinations and immunizations</li>
<li>Cancer screenings</li>
<li>Blood pressure and cholesterol checks</li>
<li>Diabetes screening</li>
<li>Vision and hearing tests</li>
</ul>

<h2>Benefits of Preventive Care</h2>
<p>Regular preventive care can:</p>
<ul>
<li>Detect diseases early</li>
<li>Prevent serious health complications</li>
<li>Reduce healthcare costs</li>
<li>Improve quality of life</li>
<li>Increase life expectancy</li>
</ul>

<p>Schedule your preventive care appointment today and take control of your health.</p>',
  'Learn about the importance of preventive care and how regular check-ups can help detect health issues early.',
  'preventive-care-first-line-defense',
  'Health Tips',
  '/images/ultrasound-imaging.png',
  'Dr. Lisa Anderson',
  true
);
