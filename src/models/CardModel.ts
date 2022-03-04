import { CardSubType, ItemType, ResourceType } from "./Enums";
import { KanjiCompositionModel } from "./KanjiCompositionModel";

export class CardModel {
    constructor(temp: any) {
        this._raw = temp;

        this.Character = temp.character || 'No Card';
        this.CharacterType = temp.characterType || ResourceType.Text;
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

    _raw:any;

    Character: string;
    CharacterType: ResourceType;
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
    OnYomiErrors = 0;
    KunYomiVerified: boolean;
    KunYomiErrors = 0;
    ReadingVerified: boolean;
    ReadingErrors = 0;
    MeaningVerified: boolean;
    MeaningErrors = 0;
    GameResults: string;

    public Clone(): CardModel {
        return new CardModel(this._raw);
    }

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
                this.KunYomiErrors++;
                break;
            case CardSubType.OnYomi:
                if(this.OnYomi.filter((o) => o.toLowerCase().trim() === lca).length > 0){
                    this.OnYomiVerified = true;
                    return true;
                }
                this.OnYomiErrors++;
                break;
            case CardSubType.Reading:
                if(this.Reading.filter((o) => o.toLowerCase().trim() === lca).length > 0){
                    this.ReadingVerified = true;
                    return true;
                }
                this.ReadingErrors++;
                break;
            case CardSubType.Meaning:
                if(this.Meaning.filter((o) => o.toLowerCase().trim() === lca).length > 0){
                    this.MeaningVerified = true;
                    return true;
                }
                this.MeaningErrors++;
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
                console.log('nextQuestion',this.Character, this.Meaning && this.Meaning.length > 0 && !this.MeaningVerified, this.MeaningVerified);
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
                if(this.KunYomi && this.KunYomi.length > 0 && !this.KunYomiVerified){
                    list.push(CardSubType.KunYomi);
                }
                return list.length == 0 ? CardSubType.None : list.splice(~~(Math.random() * list.length), 1)[0];
            default:
                console.log('nextQuestion',this.Character, 'none');
                return CardSubType.None;        
        }
    }
}

export class GameCompletedCardModel extends CardModel {
    constructor(gameCards: CardModel[]) {
        super({
            "characterType": "svg",

        });        
        const excellent = "<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm7.071 2.929a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0Zm-14.142 0a1 1 0 0 1 1.414 0l.707.707A1 1 0 0 1 5.636 7.05l-.707-.707a1 1 0 0 1 0-1.414ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-6 4a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm-4 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm17 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1ZM5.636 16.95a1 1 0 0 1 1.414 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707Zm11.314 1.414a1 1 0 0 1 1.414-1.414l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707ZM12 19a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Z\"/>";
        const good = "<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M5 10a6 6 0 0 1 11.671-1.963A6 6 0 0 1 16 20H7a5 5 0 0 1-1.986-9.59A6.071 6.071 0 0 1 5 10Zm6-4a4 4 0 0 0-3.903 4.879 1 1 0 0 1-.757 1.194A3.002 3.002 0 0 0 7 18h9a4 4 0 1 0-.08-8 1 1 0 0 1-1-.8A4.002 4.002 0 0 0 11 6Z\"/>";
        const fair = "<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M16 5a3 3 0 0 1 2.557 4.57 5.96 5.96 0 0 0-1.886-.533 6.019 6.019 0 0 0-2.697-3.25A2.99 2.99 0 0 1 16 5Zm-4.055.074a6 6 0 0 0-6.931 6.336A5 5 0 0 0 7 21h9a6 6 0 0 0 4.2-10.285 5 5 0 0 0-8.255-5.64ZM7 11a4 4 0 0 1 7.92-.8 1 1 0 0 0 1 .8H16a4 4 0 0 1 0 8H7a3 3 0 0 1-.66-5.927 1 1 0 0 0 .757-1.194A4.017 4.017 0 0 1 7 11Z\"/>";
        const poor = "<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M11 2a6 6 0 0 0-5.986 6.41 5 5 0 0 0-1.322 8.34 1 1 0 1 0 1.324-1.5 3.002 3.002 0 0 1 1.324-5.178 1 1 0 0 0 .757-1.193A4 4 0 1 1 14.92 7.2a1 1 0 0 0 .999.8H16a4 4 0 0 1 2.4 7.2 1 1 0 0 0 1.201 1.6 6 6 0 0 0-2.93-10.762A6.002 6.002 0 0 0 11 2Zm1.949 13.316a1 1 0 0 0-1.898-.632l-2 6a1 1 0 0 0 1.898.632l2-6Zm3.367-2.265a1 1 0 0 1 .633 1.265l-2 6a1 1 0 0 1-1.898-.632l2-6a1 1 0 0 1 1.265-.633ZM9.45 14.316a1 1 0 0 0-1.898-.632l-2 6a1 1 0 0 0 1.898.632l2-6Z\"/>";
        
        //  get statistics
        let errors = 0;
        let ratio = 0;
        gameCards.forEach(c => {
            if(c.OnYomiErrors || c.KunYomiErrors || c.ReadingErrors || c.MeaningErrors){
                errors++;
            }
        });

        ratio = (1 - errors/gameCards.length) * 100;
        if(ratio >= 95){
            this.Character = excellent;
            this.Type = ItemType.ExcellentGame;
        }else if (ratio >= 80){
            this.Character = good;
            this.Type = ItemType.GoodGame;
        }else if (ratio >= 50){
            this.Character = fair;
            this.Type = ItemType.FairGame;
        }else{
            this.Character = poor;
            this.Type = ItemType.PoorGame;
        }

        this.GameResults = `You played with ${gameCards.length} card(s) and made ${errors} mistake(s).<br>${ratio}%`;
    }

    public override nextQuestion = () => CardSubType.GameResult;
}

export const EmptyCard = new CardModel({ });