import { adminAuth, db } from "./firebase-admin.js";


export default async function handler(req, res) {

    try {

        // Make sure the request has a Firebase token
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: "Missing authorization header"
            });
        }


        // Extract token from:
        // Authorization: Bearer <token>

        const idToken =
            authHeader.replace("Bearer ", "");


        // Verify Firebase user

        const decodedToken =
            await auth.verifyIdToken(idToken);


        const uid = decodedToken.uid;


        // Look for Plaid connections belonging
        // to this Firebase user

        const snapshot = await db
            .collection("plaidItems")
            .where("userId", "==", uid)
            .get();


        return res.status(200).json({

            hasBanks: !snapshot.empty,

            bankCount: snapshot.size

        });

    } catch (error) {

        console.error(
            "BANK STATUS ERROR:",
            error
        );

        return res.status(500).json({
            error: error.message
        });

    }

}