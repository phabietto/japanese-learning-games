import { CardSubType, ItemType } from "./Enums";
import { KanjiCompositionModel } from "./KanjiCompositionModel";

export class CardModel {
    constructor(temp: any) {
        this.Character = temp.character || 'No Card';
        this.Type = temp.type || ItemType.Undefined;
        this.Level = temp.level || 0;
        this.Composition = (temp.composition && temp.composition.length > 0 ? temp.composition.map((o: any) => new KanjiCompositionModel(o)) : []);
        this.Primary = temp.primary || '';
        this.Alternatives = temp.alternatives || [];
        this.WordType = temp["word-type"] || '';
        this.Mnemonic = temp.mnemonic || 'This is an empty card';
        this.OnYomi = (temp["on-yomi"] && temp["on-yomi"].trim().length >0 ? temp["on-yomi"].split(',').map(s => s.trim()) : []);
        this.OnYomiMnemonic = temp["on-yomi-mnemonic"] || '';
        this.KunYomi = (temp["kun-yomi"] && temp["kun-yomi"].trim().length >0 ? temp["kun-yomi"].split(',').map(s => s.trim()) : []);
        this.KunYomiMnemonic = temp["kun-yomi-mnemonic"] || '';
        this.Reading = (temp["reading"] && temp["reading"].trim().length >0 ? temp["reading"].split(',').map(s => s.trim()) : []);
        this.ReadingMnemonic = temp["reading-mnemonic"] || '';

        this.Meaning = [this.Primary.trim(), ...this.Alternatives.map(s => s.trim())];
        this.OnYomiVerified = false;
        this.KunYomiVerified = false;
        this.ReadingVerified = false;
        this.MeaningVerified = false;
    }

    Character: string;
    Type: ItemType;
    Level: number;
    Composition: KanjiCompositionModel[];
    Primary: string;
    Alternatives: string[];
    Meaning: string[];
    WordType: string;
    Mnemonic: string;
    OnYomi: string[];
    OnYomiMnemonic: string;
    KunYomi: string[];
    KunYomiMnemonic: string;
    Reading: string[];
    ReadingMnemonic: string;

    Question: CardSubType;
    OnYomiVerified: boolean;
    KunYomiVerified: boolean;
    ReadingVerified: boolean;
    MeaningVerified: boolean;

    public reset(): void {
        this.OnYomiVerified = false;
        this.KunYomiVerified = false;
        this.ReadingVerified = false;
        this.MeaningVerified = false;
    }

    public verify(what: CardSubType, answer: string): boolean {
        const lca = answer.trim().toLowerCase();

        switch(what) {
            case CardSubType.KunYomi:
                if(this.KunYomi.filter((o) => o.toLowerCase().trim() === lca).length > 0){
                    this.KunYomiVerified = true;
                    return true;
                }
                break;
            case CardSubType.OnYomi:
                if(this.OnYomi.filter((o) => o.toLowerCase().trim() === lca).length > 0){
                    this.OnYomiVerified = true;
                    return true;
                }
                break;
            case CardSubType.Reading:
                if(this.Reading.filter((o) => o.toLowerCase().trim() === lca).length > 0){
                    this.ReadingVerified = true;
                    return true;
                }
                break;
            case CardSubType.Meaning:
                if(this.Meaning.filter((o) => o.toLowerCase().trim() === lca).length > 0){
                    this.MeaningVerified = true;
                    return true;
                }
                break;
            default: return true;
        }
        return false;
    }

    public getSuggestion(what: CardSubType): string {
        switch(what) {
            case CardSubType.KunYomi:
                return this.KunYomi.join(', ');
            case CardSubType.OnYomi:
                return this.OnYomi.join(', ');
            case CardSubType.Reading:
                return this.Reading.join(', ');
            case CardSubType.Meaning:
                return this.Meaning.join(', ');
            default: return '';
        }
    }

    public toBeVerified(): string[] {
        let list = [];

        if(this.Meaning && this.Meaning.length > 0 && !this.MeaningVerified){
            list.push(CardSubType.Meaning);
        }
        if(this.OnYomi && this.OnYomi.length > 0 && !this.OnYomiVerified){
            list.push(CardSubType.OnYomi);
        }
        if(this.KunYomi && this.KunYomi.length > 0 && !this.KunYomiVerified){
            list.push(CardSubType.KunYomi);
        }
        if(this.Reading && this.Reading.length > 0 && !this.ReadingVerified){
            list.push(CardSubType.Reading);
        }
        return list;
    }

    public isFullyVerified(): boolean {
        return this.toBeVerified().length === 0;
    }

    public nextQuestion(): CardSubType {
        let list = [];
        switch(this.Type){
            case ItemType.Radical:
                return this.Meaning && this.Meaning.length > 0 && !this.MeaningVerified ? CardSubType.Meaning : CardSubType.None;
            case ItemType.Kanji:
                list = [];
                if(this.Meaning && this.Meaning.length > 0 && !this.MeaningVerified){
                    list.push(CardSubType.Meaning);
                }
                if(this.OnYomi && this.OnYomi.length > 0 && !this.OnYomiVerified){
                    list.push(CardSubType.OnYomi);
                }
                if(this.KunYomi && this.KunYomi.length > 0 && !this.KunYomiVerified){
                    list.push(CardSubType.KunYomi);
                }
                return list.length == 0 ? CardSubType.None : list.splice(~~(Math.random() * list.length), 1)[0];
            case ItemType.Vocabulary:
                list = [];
                if(this.Meaning && this.Meaning.length > 0 && !this.MeaningVerified){
                    list.push(CardSubType.Meaning);
                }
                if(this.Reading && this.Reading.length > 0 && !this.ReadingVerified){
                    list.push(CardSubType.Reading);
                }
                return list.length == 0 ? CardSubType.None : list.splice(~~(Math.random() * list.length), 1)[0];
            default:
                return CardSubType.None;        
        }
    }
}