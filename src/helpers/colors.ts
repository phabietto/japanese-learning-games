import { ItemType } from "../models/Enums";
import { ItemColor } from "../models/ItemColor";

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
            case ItemType.Kanji: return 'from-pink-500 to-pink-900 hover:to-pink-800 hover:from-pink-600';
            case ItemType.Vocabulary: return 'from-purple-500 to-purple-900 hover:to-purple-800 hover:from-purple-600';
            case ItemType.Radical: return 'from-blue-400 to-blue-800 hover:to-blue-700 hover:from-blue-500';
            case ItemType.ExcellentGame: return 'bg-lime-500';
            case ItemType.GoodGame: return 'bg-amber-500';
            case ItemType.FairGame: return 'bg-orange-500';
            case ItemType.PoorGame: return 'bg-red-500';
            default: return 'from-gray-200 to-gray-700 hover:to-gray-600 hover:from-gray-300';
        }
    }
}
