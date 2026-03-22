/**
 * NiMSA SE — MongoDB Seed Script
 * Run once after connecting to Atlas: node seed.js
 * This populates all collections with starter data.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User        = require('./models/User');
const Executive   = require('./models/Executive');
const Event       = require('./models/Event');
const Bulletin    = require('./models/Bulletin');
const News        = require('./models/News');
const Institution = require('./models/Institution');
const Settings    = require('./models/Settings');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // ── SETTINGS ──
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({
        whatsappNumber: '2348000000000',
        email: 'nimsa.se@gmail.com',
        facebook: '#', instagram: '#', twitter: '#', youtube: '#',
        siteName: 'NiMSA South East Region'
      });
      console.log('✅ Settings seeded');
    }

    // ── ADMIN USER ──
    const existingAdmin = await User.findOne({ email: 'admin@nimsase.org' });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash('password', 10);
      await User.create({
        name: 'NiMSA SE Admin',
        email: 'admin@nimsase.org',
        password: hashed,
        role: 'admin'
      });
      console.log('✅ Admin user seeded — admin@nimsase.org / password');
    }

    // ── EXECUTIVES ──
    const execCount = await Executive.countDocuments();
    if (execCount === 0) {
      await Executive.insertMany([
        { name: 'Chukwuemeka Obi',    position: 'Regional Coordinator',           category: 'coordinator',    school: 'University of Nigeria, Nsukka',                    bio: 'Coordinating and governing the NiMSA South East Region with vision and excellence.', order: 1 },
        { name: 'Adaeze Nwosu',       position: 'Assistant Regional Coordinator',  category: 'rec',            school: 'Nnamdi Azikiwe University',                        bio: 'Supporting the Regional Coordinator in governance and day-to-day administration.', order: 2 },
        { name: 'Ifeanyi Eze',        position: 'Regional Secretary',              category: 'rec',            school: 'Enugu State University of Science & Technology',   bio: 'Managing official correspondence and institutional memory for the region.', order: 3 },
        { name: 'Chisom Okafor',      position: 'Director of ICT',                category: 'rec',            school: 'Imo State University',                             bio: 'Leading the digital transformation of NiMSA SE.', order: 4 },
        { name: 'Tobenna Agwu',       position: 'Financial Secretary',             category: 'rec',            school: 'Abia State University',                            bio: 'Ensuring transparent and accountable financial management.', order: 5 },
        { name: 'Ngozi Ani',          position: 'Director of Public Relations',    category: 'rec',            school: 'Ebonyi State University',                          bio: 'Managing communications and the public image of NiMSA SE.', order: 6 },
        { name: 'Emeka Nwofor',       position: 'UNMSA President',                category: 'school-president', school: 'University of Nigeria (Enugu Campus)',            bio: 'Leading the University of Nigeria Medical Students Association.', order: 7 },
        { name: 'Precious Odum',      position: 'ABSUMSA President',              category: 'school-president', school: 'Abia State University, Uturu',                   bio: 'Leading the Abia State University Medical Students Association.', order: 8 },
        { name: 'Stanley Nnadi',      position: 'ESUMSA President',               category: 'school-president', school: 'Enugu State University (ESUT)',                  bio: 'Leading the Enugu State University Medical Students Association.', order: 9 },
        { name: 'Amaka Obiora',       position: 'IMSUMSA President',              category: 'school-president', school: 'Imo State University, Owerri',                   bio: 'Leading the Imo State University Medical Students Association.', order: 10 },
        { name: 'Ikenna Ugwueze',     position: 'NAUMSA President',               category: 'school-president', school: 'Nnamdi Azikiwe University, Nnewi',               bio: 'Leading the Nnamdi Azikiwe University Medical Students Association.', order: 11 },
        { name: 'Chidinma Eze',       position: 'EBSUMSA President',              category: 'school-president', school: 'Ebonyi State University, Abakaliki',             bio: 'Leading the Ebonyi State University Medical Students Association.', order: 12 },
      ]);
      console.log('✅ Executives seeded');
    }

    // ── INSTITUTIONS ──
    const instCount = await Institution.countDocuments();
    if (instCount === 0) {
      await Institution.insertMany([
        { name: 'University of Nigeria (Enugu Campus)',         acronym: 'UNMSA',       assoc: 'UNMSA',       state: 'Enugu',       type: 'Federal',  quota: 165, dental_quota: 15, status: 'Fully Accredited', order: 1 },
        { name: 'Nnamdi Azikiwe University, Nnewi',            acronym: 'NAUMSA',      assoc: 'NAUMSA',      state: 'Anambra',     type: 'Federal',  quota: 100, dental_quota: 0,  status: 'Fully Accredited', order: 2 },
        { name: 'Abia State University, Uturu',                acronym: 'ABSUMSA',     assoc: 'ABSUMSA',     state: 'Abia',        type: 'State',    quota: 135, dental_quota: 0,  status: 'Fully Accredited', order: 3 },
        { name: 'Enugu State University (ESUT)',               acronym: 'ESUMSA',      assoc: 'ESUMSA',      state: 'Enugu',       type: 'State',    quota: 50,  dental_quota: 0,  status: 'Fully Accredited', order: 4 },
        { name: 'Imo State University, Owerri',                acronym: 'IMSUMSA',     assoc: 'IMSUMSA',     state: 'Imo',         type: 'State',    quota: 50,  dental_quota: 0,  status: 'Fully Accredited', order: 5 },
        { name: 'Ebonyi State University, Abakaliki',          acronym: 'EBSUMSA',     assoc: 'EBSUMSA',     state: 'Ebonyi',      type: 'State',    quota: 100, dental_quota: 0,  status: 'Fully Accredited', order: 6 },
        { name: 'Godfrey Okoye University',                    acronym: 'GOUMSA',      assoc: 'GOUMSA',      state: 'Enugu',       type: 'Private',  quota: 0,   dental_quota: 0,  status: 'Fully Accredited', order: 7 },
        { name: 'Gregory University, Uturu',                   acronym: 'GUMSA',       assoc: 'GUMSA',       state: 'Abia',        type: 'Private',  quota: 120, dental_quota: 0,  status: 'Fully Accredited', order: 8 },
        { name: 'Chukwuemeka Odumegwu Ojukwu University',      acronym: 'COOUMSA',     assoc: 'COOUMSA',     state: 'Anambra',     type: 'State',    quota: 50,  dental_quota: 0,  status: 'Fully Accredited', order: 9 },
        { name: 'Alex Ekwueme Federal University',             acronym: 'AE-FUMSA',    assoc: 'AE-FUMSA',    state: 'Ebonyi',      type: 'Federal',  quota: 50,  dental_quota: 0,  status: 'Fully Accredited', order: 10 },
        { name: 'Madonna University, Elele/Okija',             acronym: 'MUMSA',       assoc: 'MUMSA',       state: 'Imo/Anambra', type: 'Private',  quota: 50,  dental_quota: 0,  status: 'Fully Accredited', order: 11 },
        { name: 'David Umahi Federal University',              acronym: 'DUMSA SE',    assoc: 'DUMSA SE',    state: 'Ebonyi',      type: 'Federal',  quota: 30,  dental_quota: 0,  status: 'Partially Accredited', order: 12 },
        { name: 'Nnamdi Azikiwe University Dental School',     acronym: 'UNIZIK Dental', assoc: 'UNIZIK Dental', state: 'Anambra', type: 'Federal',  quota: 0,   dental_quota: 25, status: 'Fully Accredited', order: 13 },
      ]);
      console.log('✅ Institutions seeded');
    }

    // ── EVENTS ──
    const evtCount = await Event.countDocuments();
    if (evtCount === 0) {
      await Event.insertMany([
        { title: 'Annual Regional Convention 2026', date: '2026-06-20', time: '09:00', type: 'Convention', location: 'University of Nigeria, Nsukka', description: 'The flagship annual gathering of all medical students in the Southeast Region. Features academic competitions, leadership elections, health outreaches, and cultural nights.', status: 'upcoming' },
        { title: 'Clinical Skills Webinar — Cardiovascular Examination', date: '2026-04-05', time: '14:00', type: 'Webinar', location: 'Online (Zoom)', description: 'An interactive online session focusing on systematic cardiovascular examination techniques. Open to all clinical-year students.', status: 'upcoming' },
        { title: 'Hypertension Awareness Campaign — Enugu', date: '2026-05-17', time: '08:00', type: 'Campaign', location: 'Enugu State', description: 'Free blood pressure screenings, health education, and distribution of educational materials across Enugu communities.', status: 'upcoming' },
        { title: 'Research Methodology Workshop', date: '2026-03-28', time: '10:00', type: 'Workshop', location: 'Nnamdi Azikiwe University', description: 'Hands-on training in research design, data collection, statistical analysis, and scientific writing.', status: 'upcoming' },
      ]);
      console.log('✅ Events seeded');
    }

    // ── BULLETINS ──
    const bulCount = await Bulletin.countDocuments();
    if (bulCount === 0) {
      await Bulletin.insertMany([
        { title: 'The Pulse — March 2026', month: 'March', year: '2026', issue: 'Vol. 3, Issue 3', summary: 'Regional Convention preview, Clinical Skills Series launch, member spotlights, and campus news.', featured: true },
        { title: 'The Pulse — February 2026', month: 'February', year: '2026', issue: 'Vol. 3, Issue 2', summary: 'Valentine health outreach recap, IFMSA exchange opportunities, exam preparation resources.', featured: false },
        { title: 'The Pulse — January 2026', month: 'January', year: '2026', issue: 'Vol. 3, Issue 1', summary: 'New year message from the Regional Coordinator, 2026 calendar of events, scholarship opportunities.', featured: false },
        { title: 'The Pulse — December 2025', month: 'December', year: '2025', issue: 'Vol. 2, Issue 12', summary: 'Year-in-review, award winners, farewell to graduating members, new executive profiles.', featured: false },
      ]);
      console.log('✅ Bulletins seeded');
    }

    // ── NEWS ──
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      await News.insertMany([
        { title: 'NiMSA SE Wins Most Exceptional Region Award at National Convention', category: 'Achievement', date: '2026-03-01', excerpt: 'The South East Region has once again been recognized as the Most Exceptional Region of NiMSA, marking three consecutive years of excellence.', content: 'The South East Region has once again been recognized as the Most Exceptional Region of NiMSA at the national convention.', featured: true },
        { title: 'NiMSA SE Hosts Inaugural MAK NiMSA Health Week in Abakaliki', category: 'Outreach', date: '2025-11-10', excerpt: 'The South East Region proudly hosted the inaugural MAK NiMSA Health Week in Abakaliki, honouring Mustapha, Aisha, and Kabiru.', content: 'In honour of Mustapha, Aisha, and Kabiru — three medical students tragically lost in a boat mishap in 2023 — EBSUMSA hosted the inaugural MAK Health Week in Abakaliki.', featured: false },
        { title: 'Launch of Southeast Literary Awards 2026', category: 'Programs', date: '2026-01-20', excerpt: 'The NiMSA Southeast Literary Awards returns for its second edition, calling for submissions in essay, poetry, and medical storytelling.', content: 'The NiMSA Southeast Literary Awards returns for its second edition.', featured: false },
      ]);
      console.log('✅ News seeded');
    }

    console.log('\n🎉 Database seeding complete!');
    console.log('   Admin login: admin@nimsase.org / password');
    console.log('   Change the admin password after first login.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
