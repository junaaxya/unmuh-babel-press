export function calculatePaginationRange({
    page = 1,
    limit = 0,
    total = 0,
    currentCount = 0,
} = {}) {
    const safeTotal = Math.max(0, Number(total) || 0);
    const safeLimit = Math.max(1, Number(limit) || 1);
    const safePage = Math.max(1, Number(page) || 1);
    const safeCount = Math.max(0, Number(currentCount) || 0);

    if (safeTotal === 0 || safeCount === 0) {
        return { start: 0, end: 0 };
    }

    const potentialStart = (safePage - 1) * safeLimit + 1;

    if (potentialStart > safeTotal) {
        return { start: 0, end: 0 };
    }

    const start = potentialStart;
    const end = Math.min(start + safeCount - 1, safeTotal);

    return { start, end };
}
