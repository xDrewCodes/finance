import { auth } from "./firebase-admin.js";

export default async function handler(req, res) {
    console.log("BANK STATUS FUNCTION RAN");

    return res.status(200).json({
        success: true,
        message: "Firebase Admin loaded"
    });
}