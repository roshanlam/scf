type IsoLangCode = 'en' | 'fr' | 'de' | 'es' | 'it' | 'ja' | 'ko' | 'nl' | 'pt' | 'ru' | 'zh' | 'np' | 'th' | 'vi';

// add more languages
const Hello: Record<IsoLangCode, string> = {
  en: 'Hello',
  fr: 'Bonjour',
  de: 'Hallo',
  es: 'Hola',
  it: 'Ciao',
  ja: 'こんにちは',
  ko: '안녕하세요',
  nl: 'Hallo',
  pt: 'Olá',
  ru: 'Привет',
  zh: '你好',
  np: 'नमस्ते',
  th: 'สวัสดี',
  vi: 'Xin chào',
};

export const defaultHello = Hello.en;

export const HelloKeys: IsoLangCode[] = Object.keys(Hello) as IsoLangCode[];
export const getHelloValues = (isoLangCode: IsoLangCode) => Hello[isoLangCode];

// have an emoji for each language
export const HelloEmoji: Record<IsoLangCode, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  es: '🇪🇸',
  it: '🇮🇹',
  ja: '🇯🇵',
  ko: '🇰🇷',
  nl: '🇳🇱',
  pt: '🇵🇹',
  ru: '🇷🇺',
  zh: '🇨🇳',
  np: '🇳🇵',
  th: '🇹🇭',
  vi: '🇻🇳',
};

export const defaultHelloEmoji = HelloEmoji.en;
export const getHelloEmoji = (isoLangCode: IsoLangCode) => HelloEmoji[isoLangCode];
export const HelloEmojiKeys: IsoLangCode[] = Object.keys(HelloEmoji) as IsoLangCode[];

export default Hello;
