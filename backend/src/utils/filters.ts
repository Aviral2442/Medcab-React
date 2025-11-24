export const buildFilters = (
    filters: {
        date?: string;
        fromDate?: string;
        toDate?: string;
        dateColumn?: string; // e.g. column name like "created_at" or "updated_at"
    }
) => {

    const whereClauses: string[] = [];
    const params: any[] = [];

    const {
        date,
        fromDate,
        toDate,
        dateColumn = "created_at",
    } = filters || {};

    const now = new Date();
    let startTimestamp: number | null = null;
    let endTimestamp: number | null = null;

    // ⭐ NEW: Smart date column wrapper (auto UNIX conversion)
    const dateColSQL = `(
        CASE 
            WHEN ${dateColumn} REGEXP '^[0-9]+$' THEN ${dateColumn} 
            ELSE UNIX_TIMESTAMP(${dateColumn})
        END
    )`;

    switch (date) {
        case "today": {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            startTimestamp = Math.floor(start.getTime() / 1000);
            endTimestamp = Math.floor(Date.now() / 1000);
            break;
        }
        case "yesterday": {
            const y = new Date();
            y.setDate(y.getDate() - 1);
            startTimestamp = Math.floor(new Date(y.setHours(0, 0, 0, 0)).getTime() / 1000);
            endTimestamp = Math.floor(new Date(y.setHours(23, 59, 59, 999)).getTime() / 1000);
            break;
        }
        case "thisWeek": {
            const day = now.getDay();
            const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(now.setDate(diffToMonday));
            startTimestamp = Math.floor(new Date(monday.setHours(0, 0, 0, 0)).getTime() / 1000);
            endTimestamp = Math.floor(Date.now() / 1000);
            break;
        }
        case "thisMonth": {
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            startTimestamp = Math.floor(firstDay.getTime() / 1000);
            endTimestamp = Math.floor(Date.now() / 1000);
            break;
        }
        case "custom": {
            if (fromDate && toDate) {
                startTimestamp = Math.floor(new Date(fromDate).getTime() / 1000);
                endTimestamp = Math.floor(new Date(toDate).getTime() / 1000);
            }
            break;
        }
    }

    if (startTimestamp && endTimestamp) {
        whereClauses.push(`${dateColSQL} BETWEEN ? AND ?`);
        params.push(startTimestamp, endTimestamp);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

    return { whereSQL, params };
};
