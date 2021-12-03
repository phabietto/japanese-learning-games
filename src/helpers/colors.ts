export class ColorsHelper {
    public getItemColor(itemType: string):ItemColor{
        switch(<ItemType>itemType){
            case ItemType.Kanji: return new ItemColor('text-pink-400','bg-pink-400');
            case ItemType.Vocabulary: return new ItemColor('text-purple-400','bg-purple-400');
            case ItemType.Link: return new ItemColor('text-gray-400','bg-gray-400');
            default: return new ItemColor('text-indigo-400','bg-indigo-400');
        }
    }
    public getCardColor(itemType: string):string{
        switch(<ItemType>itemType){
            case ItemType.Kanji: return 'from-pink-500 to-pink-600 hover:to-pink-700 hover:from-pink-500';
            case ItemType.Vocabulary: return 'from-purple-500 to-purple-600 hover:to-purple-700 hover:from-purple-500';
            default: return 'from-indigo-500 to-indigo-600 hover:to-indigo-700 hover:from-indigo-500';
        }
    }
}

export class ItemColor {
    constructor(text:string, bg:string) {
        this.Text = text;
        this.Background = bg;
    }

    public Text: string;
    public Background: string;
}

export enum ItemType {
    Radical = 'radical',
    Kanji = 'kanji',
    Vocabulary = 'vocabulary',
    Link = 'link',
    Undefined=''
}

export enum CardSubType {
    Meaning,
    Pronounciation
}