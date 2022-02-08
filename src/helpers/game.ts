export class Game {
    public nextRandom(max: number): number {
        return ~~(Math.random() * (max + 1));
    }
}