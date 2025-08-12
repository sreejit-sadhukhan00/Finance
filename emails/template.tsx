import { Body, Button, Container, Heading, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";

export default function Email(
    {
        username = "",
        type = "budget-alert",
        data = {}
    }: {
        username?: string;
        type?: string;
        data?: any;
    }
) {
    console.log("Email component rendered with type:", type, "and data:", data);

    if (type === "monthly-report") {
        // Monthly report template
    }

    if (type === "budget-alert") {
        console.log("heree");
        return (
            <Html>
                <Preview>Budget Alert</Preview>
                <Body style={styles.body}>
                    <Container style={styles.container}>
                        <Heading style={styles.heading}>🚨 Budget Alert!</Heading>
                        <Text style={styles.text}>Hello <strong>{username}</strong>,</Text>
                        <Text style={styles.text}>
                            Your budget is almost exhausted. You have used 
                            <span style={styles.highlight}> {data.percentageUsed.toFixed(1)}%</span> 
                            of your budget of <span style={styles.highlight}>₹{data.budgetAmount}</span>.
                        </Text>
                        <Section style={styles.statsContainer}>
                            <div style={styles.stat}>
                                <Text style={styles.statLabel}>Budget Amount</Text>
                                <Text style={styles.statValue}>₹{data?.budgetAmount}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.statLabel}>Spent So Far</Text>
                                <Text style={styles.statValue}>${data?.totalExpenses}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.statLabel}>Remaining</Text>
                                <Text style={styles.statValue}>
                                    ₹{data?.budgetAmount - data?.totalExpenses}
                                </Text>
                            </div>
                        </Section>
                        <Button
                            style={styles.button}
                            href="#"
                        >
                            View Detailed Report
                        </Button>
                    </Container>
                </Body>
            </Html>
        );
    }
}

const styles = {
  body: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    lineHeight: 1.6,
  },
  text: {
    fontSize: "16px",
    color: "#4b5563",
    marginBottom: "16px",
    lineHeight: "1.7",
    letterSpacing: "0.2px",
  },
  highlight: {
    color: "#ef4444",
    fontWeight: "700"
  },
  heading: {
    fontSize: "32px",
    fontWeight: "800",
    background: "linear-gradient(90deg, #ff512f 0%, #dd2476 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "16px",
    textAlign: "center" as const,
  },
  statsContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "30px",
    backgroundColor: "#f9fafb",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    margin: "30px 0",
  },
  stat: {
    flex: 1,
    textAlign: "center" as const,
    padding: "15px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  },
  statLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: "6px",
  },
  statValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1f2937",
  },
  container: {
    maxWidth: "680px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  },
  button: {
    display: "inline-block",
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(90deg, #ff512f 0%, #dd2476 100%)",
    borderRadius: "12px",
    textDecoration: "none",
    textAlign: "center" as const,
    marginTop: "20px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
  }
};
