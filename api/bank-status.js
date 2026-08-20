export default async function handler(req, res) {

    try {

        console.log("BANK STATUS FUNCTION RAN");

        const { getAuth } = await import("firebase-admin/auth");
        const { getFirestore } = await import("firebase-admin/firestore");
        const { getApps, initializeApp, cert } = await import("firebase-admin/app");

        if (getApps().length === 0) {

            initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(
                        /\\n/g,
                        "\n"
                    )
                })
            });

        }

        const auth = getAuth();
        const db = getFirestore();

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: "No authorization header"
            });
        }

        const token = authHeader.replace("Bearer ", "");

        const decoded = await auth.verifyIdToken(token);

        const uid = decoded.uid;

        console.log("Firebase UID:", uid);

        const snapshot = await db
            .collection("plaidItems")
            .where("userId", "==", uid)
            .get();

        return res.status(200).json({
            hasBanks: !snapshot.empty
        });

    } catch (error) {

        console.error("BANK STATUS ERROR:", error);

        return res.status(500).json({
            error: error.message
        });

    }
}