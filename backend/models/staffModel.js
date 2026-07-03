import mongoose from "mongoose";

// Staff accounts created by the Super Admin. The Super Admin itself has no
// document here — it authenticates against ADMIN_EMAIL/ADMIN_PASSWORD in .env.
const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const staffModel = mongoose.models.staff || mongoose.model("staff", staffSchema);
export default staffModel;
