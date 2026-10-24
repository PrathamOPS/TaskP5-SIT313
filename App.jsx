import { useState } from "react";

function App() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        const cleanEmail = email.trim();

        setMessage("");
        setMessageType("");

        if (!cleanEmail) {
            setMessage("Please enter an email address.");
            setMessageType("error");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            setMessage("Please enter a valid email address.");
            setMessageType("error");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: cleanEmail
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Subscription failed. Please try again."
                );
            }

            setMessage(data.message);
            setMessageType("success");
            setEmail("");
        } catch (error) {
            console.error("Subscription request failed:", error);

            setMessage(
                error.message ||
                "Something went wrong. Please try again later."
            );

            setMessageType("error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <header className="site-header">
                <h1>DEV@Deakin</h1>
            </header>

            <main>
                <section className="signup-card">
                    <h2>Sign Up</h2>

                    <p>
                        Enter your email to get updates from
                        <br />
                        DEV@Deakin.
                    </p>

                    <form onSubmit={handleSubmit} noValidate>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            aria-label="Email address"
                            aria-describedby="message"
                            autoComplete="email"
                            disabled={loading}
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Subscribing..." : "Subscribe"}
                        </button>
                    </form>

                    <p
                        id="message"
                        className={`message ${messageType}`}
                        role="status"
                        aria-live="polite"
                    >
                        {message}
                    </p>
                </section>
            </main>
        </>
    );
}

export default App;