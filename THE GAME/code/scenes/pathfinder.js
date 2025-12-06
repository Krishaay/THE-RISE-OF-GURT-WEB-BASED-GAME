export class Pathfinder {
    constructor(grid) {
        this.grid = grid; // 0 = walkable, 1 = blocked
        this.rows = grid.length;
        this.cols = grid[0].length;
    }

    isWalkable(x, y) {
        return (
            x >= 0 &&
            y >= 0 &&
            x < this.cols &&
            y < this.rows &&
            this.grid[y][x] === 0
        );
    }

    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    findPath(start, end) {
        const openSet = [];
        const closedSet = new Set();
        const cameFrom = new Map();

        const gScore = new Map();
        const fScore = new Map();

        const key = (p) => `${p.x},${p.y}`;

        const startKey = key(start);
        const endKey = key(end);

        gScore.set(startKey, 0);
        fScore.set(startKey, this.heuristic(start, end));

        openSet.push(start);

        while (openSet.length > 0) {
            openSet.sort((a, b) => fScore.get(key(a)) - fScore.get(key(b)));
            const current = openSet.shift();
            const currentKey = key(current);

            if (currentKey === endKey) {
                return this.reconstructPath(cameFrom, current);
            }

            closedSet.add(currentKey);

            const neighbors = [
                { x: current.x + 1, y: current.y },
                { x: current.x - 1, y: current.y },
                { x: current.x,     y: current.y + 1 },
                { x: current.x,     y: current.y - 1 },
            ];

            for (const neighbor of neighbors) {
                const nKey = key(neighbor);

                if (!this.isWalkable(neighbor.x, neighbor.y)) continue;
                if (closedSet.has(nKey)) continue;

                const tentativeG = gScore.get(currentKey) + 1;

                if (!gScore.has(nKey) || tentativeG < gScore.get(nKey)) {
                    cameFrom.set(nKey, current);
                    gScore.set(nKey, tentativeG);
                    fScore.set(nKey, tentativeG + this.heuristic(neighbor, end));

                    if (!openSet.find(n => nKey === key(n))) {
                        openSet.push(neighbor);
                    }
                }
            }
        }

        return []; 
    }

    reconstructPath(cameFrom, current) {
        const path = [current];
        let key = `${current.x},${current.y}`;

        while (cameFrom.has(key)) {
            current = cameFrom.get(key);
            key = `${current.x},${current.y}`;
            path.unshift(current);
        }

        return path;
    }
}
