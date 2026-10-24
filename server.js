const express = require("express");
const sgMail = require("@sendgrid/mail");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Newsletter subscription endpoint
app.post("/subscribe", async (req, res) => {
    try {
        const email =
            typeof req.body?.email === "string"
                ? req.body.email.trim()
                : "";

        if (!email) {
            return res.status(400).json({
                message: "Please enter an email address."
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email) || email.length > 254) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        if (
            !process.env.SENDGRID_API_KEY ||
            !process.env.SENDER_EMAIL
        ) {
            console.error("SendGrid configuration is incomplete.");

            return res.status(500).json({
                message: "The email service is not configured."
            });
        }

        const emailMessage = {
            to: email,
            from: process.env.SENDER_EMAIL,
            subject: "Welcome to DEV@Deakin",
            text: "Welcome to DEV@Deakin. Thank you for subscribing!"
        };

        const response = await sgMail.send(emailMessage);
        const apiStatus = response[0].statusCode;

        console.log("SendGrid API status:", apiStatus);

        if (apiStatus < 200 || apiStatus >= 300) {
            throw new Error("SendGrid did not accept the email.");
        }

        return res.status(200).json({
            message: "Subscribed successfully! Check your email."
        });
    } catch (error) {
        console.error(
            "Newsletter subscription failed:",
            error.response?.body || error.message
        );

        if (error.response?.statusCode) {
            console.error(
                "SendGrid error status:",
                error.response.statusCode
            );
        }

        return res.status(500).json({
            message: "Unable to send your email. Please try again later."
        });
    }
});

// Return a useful error for unknown API routes
app.use("/subscribe", (req, res) => {
    res.set("Allow", "POST");

    return res.status(405).json({
        message: "Method not allowed. Use POST to subscribe."
    });
});

// Serve the built React application in production
const buildPath = path.join(__dirname, "dist");

app.use(express.static(buildPath));

app.get("*", (req, res, next) => {
    if (req.path.startsWith("/subscribe")) {
        return next();
    }

    return res.sendFile(path.join(buildPath, "index.html"), (error) => {
        if (error) {
            return res.status(404).send(
                "React application not built. Run npm run build."
            );
        }
    });
});

app.listen(PORT, () => {
    console.log(`Newsletter backend running on http://localhost:${PORT}`);
});