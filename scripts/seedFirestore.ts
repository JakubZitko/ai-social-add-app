/**
 * Script to seed Firestore with initial data
 * Run this with: npx ts-node scripts/seedFirestore.ts
 */

import * as admin from 'firebase-admin';
import { sampleAvatars, sampleVoices, pricingPlans } from '../functions/src/utils/seedData';

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedAvatars() {
  console.log('Seeding avatars...');
  const batch = db.batch();

  for (const avatar of sampleAvatars) {
    const ref = db.collection('avatars').doc(avatar.id);
    batch.set(ref, {
      ...avatar,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log(`✅ Seeded ${sampleAvatars.length} avatars`);
}

async function seedVoices() {
  console.log('Seeding voices...');
  const batch = db.batch();

  for (const voice of sampleVoices) {
    const ref = db.collection('voices').doc(voice.id);
    batch.set(ref, voice);
  }

  await batch.commit();
  console.log(`✅ Seeded ${sampleVoices.length} voices`);
}

async function seedPricingPlans() {
  console.log('Seeding pricing plans...');
  const batch = db.batch();

  for (const plan of pricingPlans) {
    const ref = db.collection('pricingPlans').doc(plan.id);
    batch.set(ref, plan);
  }

  await batch.commit();
  console.log(`✅ Seeded ${pricingPlans.length} pricing plans`);
}

async function main() {
  try {
    console.log('🚀 Starting Firestore seeding...\n');

    await seedAvatars();
    await seedVoices();
    await seedPricingPlans();

    console.log('\n✅ All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

main();
