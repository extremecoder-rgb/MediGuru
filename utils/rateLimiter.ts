class RateLimiter {
    private requests: { [key: string]: number[] } = {};
    private readonly windowMs = 60000; // 1 minute window
    private readonly maxRequests = 10;  // 10 requests per minute
    private readonly minDelay = 2000;   // Minimum 2 seconds between requests

    private cleanOldRequests(service: string) {
        const now = Date.now();
        this.requests[service] = this.requests[service]?.filter(
            timestamp => now - timestamp < this.windowMs
        ) || [];
    }

    canMakeRequest(service: string): boolean {
        this.cleanOldRequests(service);
        
        if (!this.requests[service]) {
            this.requests[service] = [];
            return true;
        }

        // Check if we've exceeded rate limits
        if (this.requests[service].length >= this.maxRequests) {
            return false;
        }

        // Check if minimum delay has passed since last request
        const lastRequest = this.requests[service][this.requests[service].length - 1];
        if (lastRequest && Date.now() - lastRequest < this.minDelay) {
            return false;
        }

        return true;
    }

    addRequest(service: string) {
        this.cleanOldRequests(service);
        if (!this.requests[service]) {
            this.requests[service] = [];
        }
        this.requests[service].push(Date.now());
    }

    getTimeUntilNextAllowed(service: string): number {
        this.cleanOldRequests(service);
        
        if (!this.requests[service]?.length) return 0;

        const lastRequest = this.requests[service][this.requests[service].length - 1];
        const timeSinceLastRequest = Date.now() - lastRequest;

        if (timeSinceLastRequest < this.minDelay) {
            return this.minDelay - timeSinceLastRequest;
        }

        if (this.requests[service].length >= this.maxRequests) {
            const oldestRequest = this.requests[service][0];
            return this.windowMs - (Date.now() - oldestRequest);
        }

        return 0;
    }
}

export const rateLimiter = new RateLimiter(); 