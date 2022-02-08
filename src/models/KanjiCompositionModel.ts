import type { ItemType } from "./Enums";

export class KanjiCompositionModel {
    constructor(o: any) {
        this.Type = o.type;
        this.Character = o.character;
        this.Primary = o.primary;
    }

    public Type: ItemType;
    public Character: string;
    public Primary: string;
}