import { config } from 'dotenv';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import path from 'path';

config({ path: '/Users/shravani/Documents/IITiancraft/HMS/backend/.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Define Schema inline to avoid import path issues
  const PlanReceipt = mongoose.models.planreceipts || mongoose.model('planreceipts', new mongoose.Schema({
    pdfUrl: String
  }, { strict: false }));
  
  const pr = await PlanReceipt.findOne({ pdfUrl: { $ne: null } }).sort({ createdAt: -1 });
  if (!pr) {
    console.log("No PlanReceipt with pdfUrl found.");
    process.exit(0);
  }
  console.log("PDF URL:", pr.pdfUrl);
  
  const res = await fetch(pr.pdfUrl);
  console.log("Status:", res.status, res.statusText);
  console.log("Headers:", res.headers.raw());
  const text = await res.text();
  console.log("Body:", text.substring(0, 500));
  process.exit(0);
}
run();
