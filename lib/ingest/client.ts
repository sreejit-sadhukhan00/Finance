import { Inngest } from 'inngest';

// Create a client to send and receive events
export const inngest = new Inngest({
    id: "my-ingest-client",
    name: "Wealth Ingest Client",
    retryFunction: async (attempt: number) => ({
        delay: Math.pow(2, attempt) * 1000, // Exponential backoff
        maxAttempts: 3 // Maximum number of retry attempts
    })
});