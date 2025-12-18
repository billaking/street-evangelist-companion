/**
 * Street Evangelist Companion
 * A mobile-first Obsidian plugin for street ministry
 * 
 * Greater Life Ministry - https://www.billaking.com
 * 
 * Phase 1: Core Plugin + Navigation Structure
 * Phase 2: Interactive Evangelism Timeline
 */

import { App, Plugin, WorkspaceLeaf, ItemView, PluginSettingTab, Setting, TFile, TFolder, Notice, normalizePath } from 'obsidian';

// ============================================
// CONSTANTS
// ============================================
const VIEW_TYPE = 'street-evangelist-view';
const PLUGIN_NAME = 'Street Evangelist Companion';

// Tab definitions
type TabId = 'overview' | 'timeline' | 'ministry' | 'doctrine' | 'journal';

interface TabDefinition {
    id: TabId;
    icon: string;
    label: string;
    description: string;
}

const TABS: TabDefinition[] = [
    { id: 'overview', icon: '🏠', label: 'Home', description: 'Dashboard overview' },
    { id: 'timeline', icon: '📜', label: 'Timeline', description: 'Evangelism history' },
    { id: 'ministry', icon: '🎯', label: 'Ministry', description: 'Street outreach tools' },
    { id: 'doctrine', icon: '✝️', label: 'Doctrine', description: 'Beliefs & references' },
    { id: 'journal', icon: '📝', label: 'Journal', description: 'Ministry journal' },
];

// ============================================
// TIMELINE DATA - Phase 2
// ============================================
type TimelineCategory = 'all' | 'apostolic' | 'cooljc';

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    keyFigures?: string[];
    scripture?: string;
    significance: 'major' | 'notable' | 'standard';
    category: TimelineCategory[];
}

interface TimelineEra {
    id: string;
    name: string;
    period: string;
    icon: string;
    color: string;
    description: string;
    events: TimelineEvent[];
}

const TIMELINE_ERAS: TimelineEra[] = [
    {
        id: 'early-church',
        name: 'Early Church',
        period: '30 AD - 400 AD',
        icon: '⛪',
        color: 'var(--sec-gold)',
        description: 'The apostles spread the Gospel throughout the Roman Empire',
        events: [
            {
                year: '30 AD',
                title: 'Day of Pentecost',
                description: 'The Holy Ghost falls on 120 in the upper room. Peter preaches and 3,000 souls are baptized in Jesus\' name.',
                keyFigures: ['Peter', 'The Twelve Apostles'],
                scripture: 'Acts 2:1-41',
                significance: 'major',
                category: ['all', 'apostolic'],
            },
            {
                year: '34 AD',
                title: 'Stephen\'s Martyrdom',
                description: 'Stephen becomes the first Christian martyr, scattered believers spread the Gospel.',
                keyFigures: ['Stephen', 'Saul (Paul)'],
                scripture: 'Acts 7:54-60',
                significance: 'major',
                category: ['all'],
            },
            {
                year: '37 AD',
                title: 'Conversion of Saul',
                description: 'Saul encounters Jesus on the road to Damascus, baptized by Ananias.',
                keyFigures: ['Paul', 'Ananias'],
                scripture: 'Acts 9:1-19',
                significance: 'major',
                category: ['all', 'apostolic'],
            },
            {
                year: '44 AD',
                title: 'Gentiles Receive the Spirit',
                description: 'Peter preaches at Cornelius\' house; Gentiles receive the Holy Ghost and are baptized.',
                keyFigures: ['Peter', 'Cornelius'],
                scripture: 'Acts 10:44-48',
                significance: 'major',
                category: ['all', 'apostolic'],
            },
            {
                year: '50 AD',
                title: 'Council of Jerusalem',
                description: 'Apostles determine Gentile believers are not bound by Mosaic law.',
                keyFigures: ['James', 'Peter', 'Paul'],
                scripture: 'Acts 15:1-29',
                significance: 'notable',
                category: ['all'],
            },
            {
                year: '64-68 AD',
                title: 'Nero\'s Persecution',
                description: 'Severe persecution of Christians in Rome. Peter and Paul martyred.',
                keyFigures: ['Peter', 'Paul', 'Nero'],
                significance: 'major',
                category: ['all'],
            },
            {
                year: '100 AD',
                title: 'John\'s Final Writings',
                description: 'Apostle John completes Revelation. Last of the original apostles.',
                keyFigures: ['John'],
                scripture: 'Revelation 22:20-21',
                significance: 'major',
                category: ['all', 'apostolic'],
            },
            {
                year: '313 AD',
                title: 'Edict of Milan',
                description: 'Constantine legalizes Christianity throughout the Roman Empire.',
                keyFigures: ['Constantine'],
                significance: 'major',
                category: ['all'],
            },
        ],
    },
    {
        id: 'medieval',
        name: 'Medieval Era',
        period: '400 AD - 1500 AD',
        icon: '🏰',
        color: 'var(--sec-text-muted)',
        description: 'The church spreads through Europe while apostolic truths become obscured',
        events: [
            {
                year: '405 AD',
                title: 'Vulgate Bible Completed',
                description: 'Jerome completes Latin translation of the Bible.',
                keyFigures: ['Jerome'],
                significance: 'notable',
                category: ['all'],
            },
            {
                year: '432 AD',
                title: 'Patrick\'s Mission to Ireland',
                description: 'Patrick brings Christianity to Ireland, establishes monastic centers.',
                keyFigures: ['Patrick'],
                significance: 'notable',
                category: ['all'],
            },
            {
                year: '1054 AD',
                title: 'Great Schism',
                description: 'Eastern and Western churches formally separate.',
                significance: 'major',
                category: ['all'],
            },
            {
                year: '1382 AD',
                title: 'Wycliffe\'s English Bible',
                description: 'John Wycliffe produces first complete English Bible translation.',
                keyFigures: ['John Wycliffe'],
                significance: 'notable',
                category: ['all'],
            },
        ],
    },
    {
        id: 'reformation',
        name: 'Reformation',
        period: '1500 - 1700',
        icon: '📖',
        color: 'var(--sec-water)',
        description: 'Reformers challenge church traditions and return to Scripture',
        events: [
            {
                year: '1517',
                title: '95 Theses',
                description: 'Martin Luther posts his theses, sparking the Protestant Reformation.',
                keyFigures: ['Martin Luther'],
                significance: 'major',
                category: ['all'],
            },
            {
                year: '1525',
                title: 'Anabaptist Movement Begins',
                description: 'Believers reject infant baptism, practice adult baptism by immersion.',
                keyFigures: ['Conrad Grebel', 'Felix Manz'],
                significance: 'notable',
                category: ['all', 'apostolic'],
            },
            {
                year: '1536',
                title: 'Calvin\'s Institutes',
                description: 'John Calvin publishes systematic Protestant theology.',
                keyFigures: ['John Calvin'],
                significance: 'notable',
                category: ['all'],
            },
            {
                year: '1611',
                title: 'King James Bible',
                description: 'The Authorized Version is published, becomes standard English Bible.',
                significance: 'major',
                category: ['all'],
            },
        ],
    },
    {
        id: 'revival',
        name: 'Revival Era',
        period: '1700 - 1900',
        icon: '🔥',
        color: 'var(--sec-fire)',
        description: 'Great Awakenings and the birth of modern evangelism',
        events: [
            {
                year: '1739',
                title: 'Wesley\'s Field Preaching',
                description: 'John Wesley begins outdoor evangelism, reaches working classes.',
                keyFigures: ['John Wesley', 'Charles Wesley', 'George Whitefield'],
                significance: 'major',
                category: ['all'],
            },
            {
                year: '1801',
                title: 'Cane Ridge Revival',
                description: 'Massive camp meeting with 20,000+ attendees, unusual spiritual manifestations.',
                keyFigures: ['Barton W. Stone'],
                significance: 'notable',
                category: ['all', 'apostolic'],
            },
            {
                year: '1857',
                title: 'Fulton Street Revival',
                description: 'Prayer revival spreads from New York across America, millions converted.',
                keyFigures: ['Jeremiah Lanphier'],
                significance: 'major',
                category: ['all'],
            },
            {
                year: '1875',
                title: 'Moody\'s Crusades',
                description: 'D.L. Moody conducts mass evangelism campaigns in America and Britain.',
                keyFigures: ['D.L. Moody', 'Ira Sankey'],
                significance: 'notable',
                category: ['all'],
            },
        ],
    },
    {
        id: 'pentecostal',
        name: 'Pentecostal Movement',
        period: '1900 - 1950',
        icon: '🕊️',
        color: 'var(--sec-spirit)',
        description: 'The Holy Ghost outpouring returns with signs following',
        events: [
            {
                year: '1901',
                title: 'Topeka Outpouring',
                description: 'Agnes Ozman speaks in tongues at Bethel Bible School, beginning of modern Pentecostalism.',
                keyFigures: ['Charles Parham', 'Agnes Ozman'],
                significance: 'major',
                category: ['all', 'apostolic'],
            },
            {
                year: '1906',
                title: 'Azusa Street Revival',
                description: 'William Seymour leads interracial revival in Los Angeles. Pentecostal movement spreads worldwide.',
                keyFigures: ['William J. Seymour'],
                significance: 'major',
                category: ['all', 'apostolic'],
            },
            {
                year: '1913',
                title: 'Oneness Revelation',
                description: 'R.E. McAlister preaches on baptism in Jesus\' name at Arroyo Seco camp meeting.',
                keyFigures: ['R.E. McAlister', 'Frank Ewart', 'Glenn Cook'],
                scripture: 'Acts 2:38',
                significance: 'major',
                category: ['all', 'apostolic', 'cooljc'],
            },
            {
                year: '1914',
                title: 'Assemblies of God Founded',
                description: 'Pentecostal denomination organized in Hot Springs, Arkansas.',
                significance: 'notable',
                category: ['all', 'apostolic'],
            },
            {
                year: '1916',
                title: 'PAW Organized',
                description: 'Pentecostal Assemblies of the World becomes major Oneness organization.',
                keyFigures: ['G.T. Haywood'],
                significance: 'major',
                category: ['all', 'apostolic', 'cooljc'],
            },
            {
                year: '1919',
                title: 'COOLJC Founded',
                description: 'Bishop R.C. Lawson founds The Church of Our Lord Jesus Christ of the Apostolic Faith in New York City.',
                keyFigures: ['Bishop R.C. Lawson'],
                significance: 'major',
                category: ['all', 'apostolic', 'cooljc'],
            },
            {
                year: '1945',
                title: 'Greater Refuge Temple',
                description: 'COOLJC headquarters established in Harlem, becomes center of Apostolic worship.',
                keyFigures: ['Bishop R.C. Lawson'],
                significance: 'notable',
                category: ['all', 'cooljc'],
            },
        ],
    },
    {
        id: 'modern',
        name: 'Modern Era',
        period: '1950 - 2000',
        icon: '📺',
        color: 'var(--sec-hope)',
        description: 'Mass media evangelism and global missions expansion',
        events: [
            {
                year: '1949',
                title: 'Billy Graham Crusades Begin',
                description: 'Los Angeles crusade launches Graham into international prominence.',
                keyFigures: ['Billy Graham'],
                significance: 'major',
                category: ['all'],
            },
            {
                year: '1961',
                title: 'Bishop W.L. Bonner Elected',
                description: 'Bishop William L. Bonner becomes Presiding Apostle of COOLJC.',
                keyFigures: ['Bishop W.L. Bonner'],
                significance: 'notable',
                category: ['all', 'cooljc'],
            },
            {
                year: '1967',
                title: 'Charismatic Renewal',
                description: 'Pentecostal experience spreads to mainline denominations.',
                significance: 'notable',
                category: ['all', 'apostolic'],
            },
            {
                year: '1974',
                title: 'Lausanne Congress',
                description: 'Global evangelical leaders commit to world evangelization.',
                keyFigures: ['Billy Graham', 'John Stott'],
                significance: 'notable',
                category: ['all'],
            },
            {
                year: '1989',
                title: 'Bishop Bonner\'s Legacy',
                description: 'COOLJC grows to over 450 churches under Bishop Bonner\'s leadership.',
                keyFigures: ['Bishop W.L. Bonner'],
                significance: 'notable',
                category: ['all', 'cooljc'],
            },
        ],
    },
    {
        id: 'digital',
        name: 'Digital Age',
        period: '2000 - Present',
        icon: '📱',
        color: 'var(--sec-gold-light)',
        description: 'Technology enables global evangelism reach',
        events: [
            {
                year: '2004',
                title: 'Social Media Evangelism Emerges',
                description: 'Facebook, YouTube enable personal testimonies to reach millions.',
                significance: 'notable',
                category: ['all'],
            },
            {
                year: '2007',
                title: 'Bishop G.E. Patterson',
                description: 'Pentecostal voices reach mainstream through television ministry.',
                keyFigures: ['Bishop G.E. Patterson'],
                significance: 'notable',
                category: ['all', 'apostolic'],
            },
            {
                year: '2010',
                title: 'Mobile Bible Apps',
                description: 'YouVersion Bible app reaches 100 million downloads.',
                significance: 'notable',
                category: ['all'],
            },
            {
                year: '2014',
                title: 'Chief Apostle Bonner',
                description: 'Bishop Gentile L. Bonner elected Chief Apostle of COOLJC.',
                keyFigures: ['Chief Apostle Gentile L. Bonner'],
                significance: 'major',
                category: ['all', 'cooljc'],
            },
            {
                year: '2020',
                title: 'Pandemic Digital Pivot',
                description: 'Churches worldwide embrace livestreaming, reaching new audiences.',
                significance: 'notable',
                category: ['all'],
            },
            {
                year: '2024',
                title: 'AI-Assisted Ministry Tools',
                description: 'New technologies help ministers study, prepare, and reach souls.',
                significance: 'standard',
                category: ['all'],
            },
        ],
    },
];

// ============================================
// DONATION PAYMENT METHODS
// ============================================
// Add your payment methods here - each entry needs an id, name, icon, and url
interface DonationMethod {
    id: string;
    name: string;
    icon: string;
    url: string;
    description?: string;
}

// CONFIGURE YOUR DONATION METHODS HERE:
const DONATION_METHODS: DonationMethod[] = [
    {
        id: 'paypal',
        name: 'PayPal',
        icon: '💳',
        url: 'https://www.paypal.com/ncp/payment/J7B8GLBMP9V3G',
        description: 'Secure payment via PayPal',
    },
    {
        id: 'cashapp',
        name: 'Cash App',
        icon: '💵',
        url: 'https://cash.app/$billaking777',
        description: 'Send via Cash App',
    },
    {
        id: 'venmo',
        name: 'Venmo',
        icon: '📱',
        url: 'https://venmo.com/@William-King-867',
        description: 'Send via Venmo',
    },
    // {
    //     id: 'zelle',
    //     name: 'Zelle',
    //     icon: '🏦',
    //     url: '', // Zelle doesn't have direct links - leave empty to show info
    //     description: 'Send to: your@email.com',
    // },
    // {
    //     id: 'givebutter',
    //     name: 'GiveButter',
    //     icon: '🧈',
    //     url: 'https://givebutter.com/YourCampaign',
    //     description: 'Donate via GiveButter',
    // },
    // {
    //     id: 'stripe',
    //     name: 'Credit Card',
    //     icon: '💳',
    //     url: 'https://buy.stripe.com/YOUR_LINK',
    //     description: 'Secure card payment',
    // },
    // {
    //     id: 'kofi',
    //     name: 'Ko-fi',
    //     icon: '☕',
    //     url: 'https://ko-fi.com/YourUsername',
    //     description: 'Buy me a coffee',
    // },
    // {
    //     id: 'patreon',
    //     name: 'Patreon',
    //     icon: '🎨',
    //     url: 'https://patreon.com/YourPage',
    //     description: 'Support on Patreon',
    // },
    // Add more payment methods as needed:
    // {
    //     id: 'custom',
    //     name: 'Custom Method',
    //     icon: '🔗',
    //     url: 'https://your-url.com',
    //     description: 'Your description',
    // },
];

// Filter to only show methods with valid URLs (or with descriptions for info-only like Zelle)
const getActiveDonationMethods = (): DonationMethod[] => {
    return DONATION_METHODS.filter(m => m.url || m.description);
};

// ============================================
// PLUGIN SETTINGS
// ============================================
interface StreetEvangelistSettings {
    ministerName: string;
    churchName: string;
    defaultTab: TabId;
    showDailyScripture: boolean;
    trackEncounters: boolean;
    // Note-based storage settings
    createNotes: boolean;
    journalFolder: string;
    prayerFolder: string;
    testimonyFolder: string;
    encounterFolder: string;
    // Donation settings
    selectedDonationMethod: string;
}

const DEFAULT_SETTINGS: StreetEvangelistSettings = {
    ministerName: 'Minister',
    churchName: '',
    defaultTab: 'overview',
    showDailyScripture: true,
    trackEncounters: true,
    // Note-based storage defaults
    createNotes: true,
    journalFolder: 'Street Ministry/Journal',
    prayerFolder: 'Street Ministry/Prayers',
    testimonyFolder: 'Street Ministry/Testimonies',
    encounterFolder: 'Street Ministry/Encounters',
    // Donation default
    selectedDonationMethod: 'paypal',
};

// ============================================
// MINISTRY TOOLKIT DATA - Phase 3
// ============================================
interface ConversationScript {
    id: string;
    title: string;
    icon: string;
    scenario: string;
    opening: string;
    keyPoints: string[];
    scripture: string;
    closing: string;
}

interface QuestionAnswer {
    id: string;
    question: string;
    shortAnswer: string;
    fullAnswer: string;
    scriptures: string[];
    category: 'salvation' | 'trinity' | 'baptism' | 'holiness' | 'general';
}

interface PrayerTemplate {
    id: string;
    title: string;
    icon: string;
    situation: string;
    prayer: string;
    scriptures: string[];
}

const CONVERSATION_SCRIPTS: ConversationScript[] = [
    {
        id: 'intro-gospel',
        title: 'Gospel Introduction',
        icon: '💬',
        scenario: 'First-time conversation with a stranger',
        opening: '"Hi, I\'m [Name]. Do you have a moment to talk about the most important decision of your life?"',
        keyPoints: [
            'We have all sinned and fallen short of God\'s glory (Romans 3:23)',
            'The wages of sin is death, but God offers eternal life (Romans 6:23)',
            'Jesus died for our sins and rose again (1 Corinthians 15:3-4)',
            'We must respond: Repent, be baptized, receive the Holy Ghost (Acts 2:38)',
        ],
        scripture: 'Acts 2:38',
        closing: '"Would you like to know more about how to receive this gift of salvation?"',
    },
    {
        id: 'already-saved',
        title: '"I\'m Already Saved"',
        icon: '🤔',
        scenario: 'Person claims they are already saved',
        opening: '"That\'s wonderful! Can I ask how you were saved? What happened?"',
        keyPoints: [
            'Listen carefully to their testimony',
            'Ask about their baptism - were they baptized in Jesus\' name?',
            'Ask if they\'ve received the Holy Ghost with evidence of speaking in tongues',
            'Gently compare their experience with Acts 2:38',
        ],
        scripture: 'Acts 19:1-6',
        closing: '"The Bible shows us the full gospel experience. Would you like to study this together?"',
    },
    {
        id: 'not-interested',
        title: '"Not Interested"',
        icon: '🚫',
        scenario: 'Person says they\'re not interested in religion',
        opening: '"I understand. May I ask what turned you away from church or religion?"',
        keyPoints: [
            'Show genuine interest in their story',
            'Acknowledge hurts from religious experiences',
            'Distinguish between religion and relationship with God',
            'Share briefly how Jesus changed your life',
        ],
        scripture: 'Romans 5:8',
        closing: '"If you ever want to talk, God loves you exactly where you are."',
    },
    {
        id: 'other-religion',
        title: 'Other Religions',
        icon: '🕊️',
        scenario: 'Person follows a different faith tradition',
        opening: '"I respect your faith journey. What do you believe about Jesus Christ?"',
        keyPoints: [
            'Find common ground where possible',
            'Focus on Jesus - who He is and what He did',
            'Share the unique claims of Christ (John 14:6)',
            'Offer to share your personal testimony',
        ],
        scripture: 'John 14:6',
        closing: '"I\'d love to share what Jesus has done in my life if you\'re open to hearing it."',
    },
    {
        id: 'hurting-person',
        title: 'Someone Hurting',
        icon: '💔',
        scenario: 'Person is going through a difficult time',
        opening: '"I can see you\'re going through something. Would you like someone to pray with you?"',
        keyPoints: [
            'Listen first - let them share their burden',
            'Show compassion without judgment',
            'Share that God sees and cares about their pain',
            'Offer to pray right there with them',
        ],
        scripture: 'Psalm 34:18',
        closing: '"Can I pray with you right now? God is near to the brokenhearted."',
    },
];

const COMMON_QUESTIONS: QuestionAnswer[] = [
    {
        id: 'trinity',
        question: 'Why don\'t you believe in the Trinity?',
        shortAnswer: 'We believe in ONE God who revealed Himself as Father, Son, and Holy Ghost - not three separate persons.',
        fullAnswer: 'The word "Trinity" doesn\'t appear in the Bible. We believe Deuteronomy 6:4 - "The LORD our God is ONE LORD." Jesus is the fullness of the Godhead bodily (Colossians 2:9). The Father, Son, and Holy Ghost are manifestations of the One God, not three separate beings.',
        scriptures: ['Deuteronomy 6:4', 'Isaiah 9:6', 'Colossians 2:9', 'John 14:9'],
        category: 'trinity',
    },
    {
        id: 'jesus-name',
        question: 'Why baptize in Jesus\' name instead of Father, Son, Holy Ghost?',
        shortAnswer: 'Jesus IS the name of the Father, Son, and Holy Ghost. Every baptism in Acts was done in Jesus\' name.',
        fullAnswer: 'Matthew 28:19 gives the titles (Father, Son, Holy Ghost), but Acts 2:38 gives the NAME: Jesus. The apostles understood the command - every recorded baptism in Acts was in Jesus\' name (Acts 2:38, 8:16, 10:48, 19:5, 22:16). Father is not a name - it\'s a title. Jesus is the revealed name.',
        scriptures: ['Acts 2:38', 'Acts 8:16', 'Acts 10:48', 'Acts 19:5', 'Colossians 3:17'],
        category: 'baptism',
    },
    {
        id: 'tongues',
        question: 'Is speaking in tongues really necessary?',
        shortAnswer: 'Speaking in tongues is the initial evidence of receiving the Holy Ghost, as seen throughout Acts.',
        fullAnswer: 'In Acts 2:4, 10:44-46, and 19:6, speaking in tongues accompanied the receiving of the Holy Ghost. Jesus said we must be "born of water and of the Spirit" (John 3:5). The Spirit gives the utterance - it\'s God\'s sign that His Spirit has entered you.',
        scriptures: ['Acts 2:4', 'Acts 10:44-46', 'Acts 19:6', 'Mark 16:17'],
        category: 'salvation',
    },
    {
        id: 'once-saved',
        question: 'Once saved, always saved - right?',
        shortAnswer: 'Salvation must be maintained through faithful living. We can fall from grace.',
        fullAnswer: 'The Bible warns believers about falling away (Hebrews 6:4-6, 2 Peter 2:20-21). Paul said he kept his body under subjection lest he become a "castaway" (1 Corinthians 9:27). We must endure to the end to be saved (Matthew 24:13).',
        scriptures: ['Hebrews 6:4-6', '2 Peter 2:20-21', '1 Corinthians 9:27', 'Matthew 24:13'],
        category: 'salvation',
    },
    {
        id: 'holiness',
        question: 'Why do Apostolics dress differently?',
        shortAnswer: 'We follow Biblical principles of modesty and separation from worldliness.',
        fullAnswer: 'The Bible teaches modesty (1 Timothy 2:9), distinction between genders (Deuteronomy 22:5), and separation from the world (Romans 12:2). Our outward appearance reflects our inward commitment to holiness. We dress to glorify God, not to attract attention.',
        scriptures: ['1 Timothy 2:9', '1 Peter 3:3-4', 'Deuteronomy 22:5', 'Romans 12:2'],
        category: 'holiness',
    },
    {
        id: 'acts-238',
        question: 'What is Acts 2:38?',
        shortAnswer: 'The complete gospel message: Repent, be baptized in Jesus\' name, receive the Holy Ghost.',
        fullAnswer: '"Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost." This is the New Testament plan of salvation given by Peter on the Day of Pentecost.',
        scriptures: ['Acts 2:38', 'Acts 2:39', 'John 3:5'],
        category: 'salvation',
    },
];

const PRAYER_TEMPLATES: PrayerTemplate[] = [
    {
        id: 'salvation-prayer',
        title: 'Prayer for Salvation',
        icon: '✨',
        situation: 'Leading someone to repentance',
        prayer: 'Lord Jesus, I come to You as a sinner in need of Your salvation. I repent of my sins and ask You to forgive me. I believe You died for me and rose again. Fill me with Your Holy Spirit. I surrender my life to You. In Jesus\' name, Amen.',
        scriptures: ['Romans 10:9-10', 'Acts 2:38'],
    },
    {
        id: 'healing-prayer',
        title: 'Prayer for Healing',
        icon: '🙏',
        situation: 'Praying for someone who is sick',
        prayer: 'Father, in the name of Jesus, I lift up [Name] to You. Your Word says by His stripes we are healed. I speak healing over their body right now. I rebuke sickness and disease. Let Your healing power flow through them. In Jesus\' name, Amen.',
        scriptures: ['Isaiah 53:5', 'James 5:14-15', 'Mark 16:18'],
    },
    {
        id: 'comfort-prayer',
        title: 'Prayer for Comfort',
        icon: '💝',
        situation: 'Someone grieving or hurting',
        prayer: 'Lord, You are close to the brokenhearted. I ask You to wrap Your loving arms around [Name]. Give them peace that passes understanding. Let them feel Your presence. Turn their mourning into dancing in Your time. In Jesus\' name, Amen.',
        scriptures: ['Psalm 34:18', 'Philippians 4:7', 'Psalm 30:11'],
    },
    {
        id: 'deliverance-prayer',
        title: 'Prayer for Deliverance',
        icon: '⚔️',
        situation: 'Someone bound by addiction or oppression',
        prayer: 'In the mighty name of Jesus, I come against every spirit of bondage. Jesus said whom the Son sets free is free indeed. I speak freedom over [Name]. Break every chain. Loose them from every stronghold. Fill them with Your Holy Ghost. In Jesus\' name, Amen.',
        scriptures: ['John 8:36', 'Luke 4:18', '2 Corinthians 10:4'],
    },
    {
        id: 'protection-prayer',
        title: 'Prayer for Protection',
        icon: '🛡️',
        situation: 'Covering someone in prayer',
        prayer: 'Father, I plead the blood of Jesus over [Name]. Send Your angels to encamp around them. Let no weapon formed against them prosper. Hide them under the shadow of Your wings. Keep them safe in Your care. In Jesus\' name, Amen.',
        scriptures: ['Psalm 91:11', 'Isaiah 54:17', 'Psalm 91:4'],
    },
    {
        id: 'street-ministry',
        title: 'Before Street Ministry',
        icon: '🔥',
        situation: 'Preparing to go out witnessing',
        prayer: 'Lord, anoint me for Your service today. Give me boldness to speak Your Word. Open doors of opportunity. Lead me to divine appointments. Let Your Spirit flow through me. Use me as a vessel for Your glory. In Jesus\' name, Amen.',
        scriptures: ['Acts 4:29', 'Colossians 4:3', 'Acts 1:8'],
    },
];

// ============================================
// DATA INTERFACES
// ============================================
interface Encounter {
    id: string;
    date: string;
    location: string;
    description: string;
    prayerRequests: string[];
    followUp: boolean;
    outcome: 'prayer' | 'tract' | 'conversation' | 'salvation' | 'other';
}

interface JournalEntry {
    id: string;
    date: string;
    title: string;
    content: string;
    scripture: string;
    tags: string[];
    type: 'devotion' | 'reflection' | 'testimony' | 'prayer' | 'note';
    mood?: 'grateful' | 'joyful' | 'peaceful' | 'struggling' | 'hopeful' | 'blessed';
}

interface PrayerRequest {
    id: string;
    date: string;
    request: string;
    person?: string;
    status: 'active' | 'answered' | 'ongoing';
    answeredDate?: string;
    notes?: string;
}

interface Testimony {
    id: string;
    date: string;
    title: string;
    story: string;
    scripture?: string;
    tags: string[];
}

interface ScriptureMemory {
    id: string;
    reference: string;
    text: string;
    dateAdded: string;
    lastReviewed?: string;
    memorized: boolean;
}

interface PluginData {
    encounters: Encounter[];
    journalEntries: JournalEntry[];
    prayerRequests: PrayerRequest[];
    testimonies: Testimony[];
    scriptureMemory: ScriptureMemory[];
    stats: {
        totalEncounters: number;
        prayersOffered: number;
        tractsShared: number;
        salvations: number;
    };
}

const DEFAULT_DATA: PluginData = {
    encounters: [],
    journalEntries: [],
    prayerRequests: [],
    testimonies: [],
    scriptureMemory: [],
    stats: {
        totalEncounters: 0,
        prayersOffered: 0,
        tractsShared: 0,
        salvations: 0,
    },
};

// Journal Prompts for Daily Devotions
const DEVOTION_PROMPTS = [
    'What did God reveal to you in His Word today?',
    'How did you see God\'s hand at work today?',
    'What are you grateful for this morning?',
    'What is God teaching you in this season?',
    'How can you be a witness for Christ today?',
    'What scripture spoke to your heart recently?',
    'Describe a moment you felt God\'s presence.',
    'What area of your life needs God\'s touch?',
    'How has God answered prayer in your life?',
    'What testimony do you want to share?',
];

// ============================================
// NOTE HELPER FUNCTIONS
// ============================================

/**
 * Parse YAML frontmatter from note content
 */
function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { frontmatter: {}, body: content };
    }
    
    const yamlContent = match[1];
    const body = match[2];
    const frontmatter: Record<string, any> = {};
    
    // Simple YAML parser for our use case
    yamlContent.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Handle arrays
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1);
                frontmatter[key] = value.split(',').map(v => v.trim().replace(/^["']|["']$/g, '')).filter(v => v);
            } else if (value === 'true') {
                frontmatter[key] = true;
            } else if (value === 'false') {
                frontmatter[key] = false;
            } else {
                frontmatter[key] = value.replace(/^["']|["']$/g, '');
            }
        }
    });
    
    return { frontmatter, body };
}

/**
 * Generate YAML frontmatter string
 */
function generateFrontmatter(data: Record<string, any>): string {
    const lines: string[] = ['---'];
    
    for (const [key, value] of Object.entries(data)) {
        if (value === undefined || value === null || value === '') continue;
        
        if (Array.isArray(value)) {
            if (value.length > 0) {
                lines.push(`${key}: [${value.map(v => `"${v}"`).join(', ')}]`);
            }
        } else if (typeof value === 'boolean') {
            lines.push(`${key}: ${value}`);
        } else {
            lines.push(`${key}: "${value}"`);
        }
    }
    
    lines.push('---\n');
    return lines.join('\n');
}

/**
 * Generate a safe filename from title
 */
function sanitizeFilename(title: string): string {
    return title
        .replace(/[\\/:*?"<>|]/g, '-')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 100);
}

/**
 * Format date for filename
 */
function formatDateForFilename(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ============================================
// MAIN VIEW CLASS
// ============================================
class StreetEvangelistView extends ItemView {
    private plugin: StreetEvangelistPlugin;
    private activeTab: TabId = 'overview';
    private container: HTMLElement | null = null;

    constructor(leaf: WorkspaceLeaf, plugin: StreetEvangelistPlugin) {
        super(leaf);
        this.plugin = plugin;
        this.activeTab = plugin.settings.defaultTab;
    }

    getViewType(): string {
        return VIEW_TYPE;
    }

    getDisplayText(): string {
        return PLUGIN_NAME;
    }

    getIcon(): string {
        return 'flame';
    }

    private resizeObserver: ResizeObserver | null = null;

    async onOpen(): Promise<void> {
        this.container = this.containerEl.children[1] as HTMLElement;
        this.container.empty();
        this.container.addClass('sec-plugin-root');
        
        this.render();
        this.setupLayout();
    }

    // Calculate and set pixel heights - completely bypasses Obsidian CSS
    private setupLayout(): void {
        const updateLayout = () => {
            const containerHeight = this.container.clientHeight;
            const wrapper = this.container.querySelector('.sec-container') as HTMLElement;
            const header = this.container.querySelector('.sec-header') as HTMLElement;
            const nav = this.container.querySelector('.sec-nav') as HTMLElement;
            const content = this.container.querySelector('.sec-content') as HTMLElement;
            const footer = this.container.querySelector('.sec-footer') as HTMLElement;

            if (wrapper && header && nav && content && footer) {
                // Set wrapper to exact pixel height
                wrapper.style.height = `${containerHeight}px`;
                
                // Calculate content height = total - header - nav - footer
                const headerHeight = header.offsetHeight;
                const navHeight = nav.offsetHeight;
                const footerHeight = footer.offsetHeight;
                const contentHeight = containerHeight - headerHeight - navHeight - footerHeight;
                
                content.style.height = `${contentHeight}px`;
                content.style.overflow = 'auto';
            }
        };

        // Initial layout
        setTimeout(updateLayout, 0);

        // Update on resize
        this.resizeObserver = new ResizeObserver(updateLayout);
        this.resizeObserver.observe(this.container);
    }

    async onClose(): Promise<void> {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
    }

    // ============================================
    // MAIN RENDER
    // ============================================
    private render(): void {
        if (!this.container) return;
        
        // Save scroll position before re-rendering
        const contentEl = this.container.querySelector('.sec-content') as HTMLElement;
        const scrollTop = contentEl ? contentEl.scrollTop : 0;
        
        this.container.empty();

        const wrapper = this.container.createDiv({ cls: 'sec-container' });

        // Header
        this.renderHeader(wrapper);

        // Navigation Tabs
        this.renderNavigation(wrapper);

        // Main Content Area
        const content = wrapper.createDiv({ cls: 'sec-content' });
        this.renderTabContent(content);

        // Footer
        this.renderFooter(wrapper);
        
        // Restore scroll position after re-rendering
        if (scrollTop > 0) {
            requestAnimationFrame(() => {
                content.scrollTop = scrollTop;
            });
        }
    }

    // ============================================
    // HEADER
    // ============================================
    private renderHeader(parent: HTMLElement): void {
        const header = parent.createDiv({ cls: 'sec-header' });

        const titleSection = header.createDiv({ cls: 'sec-header-title' });
        titleSection.createSpan({ cls: 'sec-header-icon', text: '🔥' });
        titleSection.createEl('h1', { text: 'Street Evangelist' });

        const actions = header.createDiv({ cls: 'sec-header-actions' });
        
        const settingsBtn = actions.createEl('button', { cls: 'sec-btn sec-btn-ghost sec-btn-icon' });
        settingsBtn.textContent = '⚙️';
        settingsBtn.setAttribute('aria-label', 'Settings');
        settingsBtn.addEventListener('click', () => {
            // Open settings
            (this.app as any).setting.open();
            (this.app as any).setting.openTabById('street-evangelist-companion');
        });
    }

    // ============================================
    // NAVIGATION
    // ============================================
    private renderNavigation(parent: HTMLElement): void {
        const nav = parent.createDiv({ cls: 'sec-nav' });

        TABS.forEach((tab) => {
            const tabBtn = nav.createEl('button', {
                cls: `sec-nav-tab ${this.activeTab === tab.id ? 'active' : ''}`,
            });
            tabBtn.setAttribute('data-tab', tab.id);
            tabBtn.setAttribute('aria-label', tab.description);

            tabBtn.createSpan({ cls: 'sec-nav-icon', text: tab.icon });
            tabBtn.createSpan({ cls: 'sec-nav-label', text: tab.label });

            tabBtn.addEventListener('click', () => {
                this.switchTab(tab.id);
            });
        });
    }

    // ============================================
    // TAB SWITCHING
    // ============================================
    private switchTab(tabId: TabId): void {
        this.activeTab = tabId;
        this.render();
    }

    // ============================================
    // TAB CONTENT ROUTER
    // ============================================
    private renderTabContent(parent: HTMLElement): void {
        switch (this.activeTab) {
            case 'overview':
                this.renderOverviewTab(parent);
                break;
            case 'timeline':
                this.renderTimelineTab(parent);
                break;
            case 'ministry':
                this.renderMinistryTab(parent);
                break;
            case 'doctrine':
                this.renderDoctrineTab(parent);
                break;
            case 'journal':
                this.renderJournalTab(parent);
                break;
        }
    }

    // ============================================
    // OVERVIEW TAB
    // ============================================
    private renderOverviewTab(parent: HTMLElement): void {
        const view = parent.createDiv({ cls: 'sec-view active' });

        // Welcome Section
        const header = view.createDiv({ cls: 'sec-section-header' });
        header.createSpan({ cls: 'sec-section-badge', text: '🔥 Ready to Go' });
        
        const greeting = this.getTimeBasedGreeting();
        header.createEl('h2', { cls: 'sec-section-title', text: greeting });
        header.createEl('p', { 
            cls: 'sec-section-subtitle', 
            text: `Welcome, ${this.plugin.settings.ministerName}. The harvest is plentiful.` 
        });

        // Daily Scripture
        if (this.plugin.settings.showDailyScripture) {
            this.renderDailyScripture(view);
        }

        // Quick Actions
        this.renderQuickActions(view);

        // Stats
        this.renderStats(view);

        // Recent Activity
        this.renderRecentActivity(view);
    }

    private getTimeBasedGreeting(): string {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning! ☀️';
        if (hour < 17) return 'Good Afternoon! 🌤️';
        return 'Good Evening! 🌙';
    }

    private renderDailyScripture(parent: HTMLElement): void {
        const scriptures = [
            { text: '"Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost."', ref: 'Matthew 28:19' },
            { text: '"For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth."', ref: 'Romans 1:16' },
            { text: '"How then shall they call on him in whom they have not believed? and how shall they believe in him of whom they have not heard? and how shall they hear without a preacher?"', ref: 'Romans 10:14' },
            { text: '"And he said unto them, Go ye into all the world, and preach the gospel to every creature."', ref: 'Mark 16:15' },
            { text: '"But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me."', ref: 'Acts 1:8' },
        ];
        
        const today = new Date().getDay();
        const scripture = scriptures[today % scriptures.length];

        const block = parent.createDiv({ cls: 'sec-scripture sec-animate-in' });
        block.createEl('p', { cls: 'sec-scripture-text', text: scripture.text });
        block.createEl('p', { cls: 'sec-scripture-ref', text: `— ${scripture.ref}` });
    }

    private renderQuickActions(parent: HTMLElement): void {
        const grid = parent.createDiv({ cls: 'sec-actions-grid' });

        const actions = [
            { icon: '📍', label: 'Log Encounter', action: () => this.switchTab('ministry') },
            { icon: '🙏', label: 'Prayer List', action: () => this.switchTab('journal') },
            { icon: '📖', label: 'Doctrine', action: () => this.switchTab('doctrine') },
            { icon: '📜', label: 'History', action: () => this.switchTab('timeline') },
        ];

        actions.forEach((action, index) => {
            const btn = grid.createEl('button', { cls: `sec-action-btn sec-animate-slide-up sec-stagger-${index + 1}` });
            btn.createSpan({ cls: 'sec-action-icon', text: action.icon });
            btn.createSpan({ cls: 'sec-action-label', text: action.label });
            btn.addEventListener('click', action.action);
        });
    }

    private renderStats(parent: HTMLElement): void {
        const stats = this.plugin.data.stats;
        const row = parent.createDiv({ cls: 'sec-stats-row' });

        const statItems = [
            { value: stats.totalEncounters, label: 'Encounters' },
            { value: stats.prayersOffered, label: 'Prayers' },
            { value: stats.tractsShared, label: 'Tracts' },
            { value: stats.salvations, label: 'Salvations' },
        ];

        statItems.forEach((stat, index) => {
            const card = row.createDiv({ cls: `sec-stat-card sec-animate-in sec-stagger-${index + 1}` });
            card.createDiv({ cls: 'sec-stat-value', text: String(stat.value) });
            card.createDiv({ cls: 'sec-stat-label', text: stat.label });
        });
    }

    private renderRecentActivity(parent: HTMLElement): void {
        const section = parent.createDiv({ cls: 'sec-card' });
        
        const header = section.createDiv({ cls: 'sec-card-header' });
        header.createDiv({ cls: 'sec-card-icon', text: '📋' });
        const headerText = header.createDiv();
        headerText.createEl('h3', { cls: 'sec-card-title', text: 'Recent Activity' });
        headerText.createEl('p', { cls: 'sec-card-subtitle', text: 'Your ministry journey' });

        if (this.plugin.data.encounters.length === 0) {
            const empty = section.createDiv({ cls: 'sec-empty-state' });
            empty.createDiv({ cls: 'sec-empty-icon', text: '🌱' });
            empty.createEl('h4', { cls: 'sec-empty-title', text: 'No encounters yet' });
            empty.createEl('p', { cls: 'sec-empty-desc', text: 'Start logging your ministry encounters to track your journey.' });
            
            const btn = empty.createEl('button', { cls: 'sec-btn sec-btn-primary' });
            btn.textContent = '+ Log First Encounter';
            btn.addEventListener('click', () => this.switchTab('ministry'));
        } else {
            const list = section.createEl('ul', { cls: 'sec-list' });
            this.plugin.data.encounters.slice(0, 3).forEach((encounter) => {
                const item = list.createEl('li', { cls: 'sec-list-item' });
                item.createDiv({ cls: 'sec-list-icon', text: this.getEncounterIcon(encounter.outcome) });
                const content = item.createDiv({ cls: 'sec-list-content' });
                content.createEl('p', { cls: 'sec-list-title', text: encounter.location });
                content.createEl('p', { cls: 'sec-list-desc', text: encounter.description });
            });
        }
    }

    private getEncounterIcon(outcome: string): string {
        const icons: Record<string, string> = {
            prayer: '🙏',
            tract: '📄',
            conversation: '💬',
            salvation: '✨',
            other: '📍',
        };
        return icons[outcome] || '📍';
    }

    // ============================================
    // TIMELINE TAB - Phase 2
    // ============================================
    private activeFilter: TimelineCategory = 'all';
    private expandedEras: Set<string> = new Set();

    private renderTimelineTab(parent: HTMLElement): void {
        const view = parent.createDiv({ cls: 'sec-view active' });

        // Header
        const header = view.createDiv({ cls: 'sec-section-header' });
        header.createSpan({ cls: 'sec-section-badge sec-badge-spirit', text: '📜 Evangelism History' });
        header.createEl('h2', { cls: 'sec-section-title', text: 'Timeline of the Gospel' });
        header.createEl('p', { cls: 'sec-section-subtitle', text: 'Journey through 2000+ years of spreading the Good News' });

        // Stats
        this.renderTimelineStats(view);

        // Filter Buttons
        this.renderTimelineFilters(view);

        // Timeline
        const timeline = view.createDiv({ cls: 'sec-timeline' });
        this.renderTimelineEras(timeline);
    }

    private renderTimelineStats(parent: HTMLElement): void {
        const stats = parent.createDiv({ cls: 'sec-timeline-stats sec-animate-in' });

        const totalEvents = TIMELINE_ERAS.reduce((sum, era) => sum + era.events.length, 0);
        const apostolicEvents = TIMELINE_ERAS.reduce((sum, era) => 
            sum + era.events.filter(e => e.category.includes('apostolic')).length, 0);
        const cooljcEvents = TIMELINE_ERAS.reduce((sum, era) => 
            sum + era.events.filter(e => e.category.includes('cooljc')).length, 0);

        const statItems = [
            { value: TIMELINE_ERAS.length, label: 'Eras' },
            { value: totalEvents, label: 'Events' },
            { value: `${apostolicEvents}+`, label: 'Apostolic' },
        ];

        statItems.forEach(stat => {
            const card = stats.createDiv({ cls: 'sec-timeline-stat' });
            card.createDiv({ cls: 'sec-timeline-stat-value', text: String(stat.value) });
            card.createDiv({ cls: 'sec-timeline-stat-label', text: stat.label });
        });
    }

    private renderTimelineFilters(parent: HTMLElement): void {
        const filters = parent.createDiv({ cls: 'sec-timeline-filters' });

        const filterOptions: { id: TimelineCategory; icon: string; label: string }[] = [
            { id: 'all', icon: '🌍', label: 'All History' },
            { id: 'apostolic', icon: '🕊️', label: 'Apostolic Focus' },
            { id: 'cooljc', icon: '⛪', label: 'COOLJC' },
        ];

        filterOptions.forEach(filter => {
            const btn = filters.createEl('button', {
                cls: `sec-filter-btn ${this.activeFilter === filter.id ? 'active' : ''}`,
            });
            btn.createSpan({ cls: 'sec-filter-icon', text: filter.icon });
            btn.createSpan({ text: filter.label });

            btn.addEventListener('click', () => {
                this.activeFilter = filter.id;
                this.render();
            });
        });
    }

    private renderTimelineEras(parent: HTMLElement): void {
        const filteredEras = this.getFilteredEras();

        filteredEras.forEach((era, index) => {
            const eraEl = parent.createDiv({ cls: `sec-era sec-animate-slide-up sec-stagger-${Math.min(index + 1, 5)}` });
            
            // Era Header
            const header = eraEl.createDiv({ 
                cls: `sec-era-header ${this.expandedEras.has(era.id) ? 'expanded' : ''}` 
            });
            header.style.setProperty('--era-color', era.color);
            
            // Update the dot color
            header.style.borderColor = era.color;
            
            header.createSpan({ cls: 'sec-era-icon', text: era.icon });
            
            const info = header.createDiv({ cls: 'sec-era-info' });
            info.createEl('h3', { cls: 'sec-era-name', text: era.name });
            info.createEl('p', { cls: 'sec-era-period', text: era.period });
            
            header.createSpan({ cls: 'sec-era-toggle', text: '▼' });

            // Era Content (collapsible)
            const content = eraEl.createDiv({ 
                cls: `sec-era-content ${this.expandedEras.has(era.id) ? 'expanded' : ''}` 
            });
            
            // Era description
            content.createEl('p', { cls: 'sec-era-desc', text: era.description });

            // Filter events based on active filter
            const filteredEvents = this.getFilteredEvents(era);
            
            // Events
            filteredEvents.forEach(event => {
                this.renderTimelineEvent(content, event);
            });

            if (filteredEvents.length === 0) {
                const empty = content.createDiv({ cls: 'sec-empty-state' });
                empty.createEl('p', { 
                    cls: 'sec-empty-desc', 
                    text: 'No events match the current filter.' 
                });
            }

            // Toggle expand/collapse
            header.addEventListener('click', () => {
                if (this.expandedEras.has(era.id)) {
                    this.expandedEras.delete(era.id);
                } else {
                    this.expandedEras.add(era.id);
                }
                
                header.classList.toggle('expanded');
                content.classList.toggle('expanded');
            });
        });
    }

    private getFilteredEras(): TimelineEra[] {
        if (this.activeFilter === 'all') {
            return TIMELINE_ERAS;
        }
        
        // Only show eras that have events matching the filter
        return TIMELINE_ERAS.filter(era => 
            era.events.some(event => event.category.includes(this.activeFilter))
        );
    }

    private getFilteredEvents(era: TimelineEra): TimelineEvent[] {
        if (this.activeFilter === 'all') {
            return era.events;
        }
        return era.events.filter(event => event.category.includes(this.activeFilter));
    }

    private renderTimelineEvent(parent: HTMLElement, event: TimelineEvent): void {
        const eventEl = parent.createDiv({ cls: `sec-event ${event.significance}` });

        // Event Header
        const header = eventEl.createDiv({ cls: 'sec-event-header' });
        header.createSpan({ cls: 'sec-event-year', text: event.year });
        header.createEl('h4', { cls: 'sec-event-title', text: event.title });

        // Description
        eventEl.createEl('p', { cls: 'sec-event-desc', text: event.description });

        // Meta info (scripture, key figures, categories)
        const meta = eventEl.createDiv({ cls: 'sec-event-meta' });

        if (event.scripture) {
            const tag = meta.createSpan({ cls: 'sec-event-tag scripture' });
            tag.createSpan({ text: '📖 ' });
            tag.createSpan({ text: event.scripture });
        }

        if (event.keyFigures && event.keyFigures.length > 0) {
            event.keyFigures.slice(0, 2).forEach(figure => {
                const tag = meta.createSpan({ cls: 'sec-event-tag figure' });
                tag.createSpan({ text: '👤 ' });
                tag.createSpan({ text: figure });
            });
        }

        // Category badges
        if (event.category.includes('apostolic') && this.activeFilter === 'all') {
            meta.createSpan({ cls: 'sec-category-badge apostolic', text: 'Apostolic' });
        }
        if (event.category.includes('cooljc')) {
            meta.createSpan({ cls: 'sec-category-badge cooljc', text: 'COOLJC' });
        }
    }

    // ============================================
    // MINISTRY TAB - Phase 3
    // ============================================
    private ministrySection: 'overview' | 'scripts' | 'questions' | 'prayers' | 'log' = 'overview';
    private expandedScript: string | null = null;
    private expandedQuestion: string | null = null;
    private expandedPrayer: string | null = null;

    private renderMinistryTab(parent: HTMLElement): void {
        const view = parent.createDiv({ cls: 'sec-view active' });

        // Header
        const header = view.createDiv({ cls: 'sec-section-header' });
        header.createSpan({ cls: 'sec-section-badge sec-badge-gold', text: '🎯 Street Ministry' });
        header.createEl('h2', { cls: 'sec-section-title', text: 'Ministry Toolkit' });
        header.createEl('p', { cls: 'sec-section-subtitle', text: 'Everything you need for effective outreach' });

        // Quick Stats
        this.renderMinistryStats(view);

        // Section Navigation
        this.renderMinistryNav(view);

        // Section Content
        const content = view.createDiv({ cls: 'sec-ministry-content' });
        
        switch (this.ministrySection) {
            case 'overview':
                this.renderMinistryOverview(content);
                break;
            case 'scripts':
                this.renderConversationScripts(content);
                break;
            case 'questions':
                this.renderCommonQuestions(content);
                break;
            case 'prayers':
                this.renderPrayerTemplates(content);
                break;
            case 'log':
                this.renderEncounterLog(content);
                break;
        }
    }

    private renderMinistryStats(parent: HTMLElement): void {
        const stats = this.plugin.data.stats;
        const row = parent.createDiv({ cls: 'sec-ministry-stats sec-animate-in' });

        const statItems = [
            { value: stats.totalEncounters, label: 'Encounters', icon: '📍' },
            { value: stats.salvations, label: 'Salvations', icon: '✨' },
            { value: CONVERSATION_SCRIPTS.length, label: 'Scripts', icon: '📝' },
            { value: COMMON_QUESTIONS.length, label: 'Q&A', icon: '❓' },
        ];

        statItems.forEach((stat) => {
            const card = row.createDiv({ cls: 'sec-ministry-stat' });
            card.createSpan({ cls: 'sec-ministry-stat-icon', text: stat.icon });
            card.createDiv({ cls: 'sec-ministry-stat-value', text: String(stat.value) });
            card.createDiv({ cls: 'sec-ministry-stat-label', text: stat.label });
        });
    }

    private renderMinistryNav(parent: HTMLElement): void {
        const nav = parent.createDiv({ cls: 'sec-ministry-nav' });

        const sections = [
            { id: 'overview', icon: '🏠', label: 'Overview' },
            { id: 'scripts', icon: '💬', label: 'Scripts' },
            { id: 'questions', icon: '❓', label: 'Q&A' },
            { id: 'prayers', icon: '🙏', label: 'Prayers' },
            { id: 'log', icon: '📋', label: 'Log' },
        ] as const;

        sections.forEach(section => {
            const btn = nav.createEl('button', {
                cls: `sec-ministry-nav-btn ${this.ministrySection === section.id ? 'active' : ''}`,
            });
            btn.createSpan({ cls: 'sec-ministry-nav-icon', text: section.icon });
            btn.createSpan({ cls: 'sec-ministry-nav-label', text: section.label });

            btn.addEventListener('click', () => {
                this.ministrySection = section.id;
                this.render();
            });
        });
    }

    private renderMinistryOverview(parent: HTMLElement): void {
        // Quick Actions
        const quickActions = parent.createDiv({ cls: 'sec-quick-ministry-actions' });
        
        const actions = [
            { icon: '📍', label: 'Log Encounter', action: () => { this.ministrySection = 'log'; this.render(); } },
            { icon: '💬', label: 'View Scripts', action: () => { this.ministrySection = 'scripts'; this.render(); } },
            { icon: '🙏', label: 'Quick Prayer', action: () => { this.ministrySection = 'prayers'; this.render(); } },
            { icon: '❓', label: 'Find Answer', action: () => { this.ministrySection = 'questions'; this.render(); } },
        ];

        actions.forEach((action, index) => {
            const btn = quickActions.createEl('button', { 
                cls: `sec-action-btn sec-animate-slide-up sec-stagger-${index + 1}` 
            });
            btn.createSpan({ cls: 'sec-action-icon', text: action.icon });
            btn.createSpan({ cls: 'sec-action-label', text: action.label });
            btn.addEventListener('click', action.action);
        });

        // Featured Script
        const featuredCard = parent.createDiv({ cls: 'sec-card featured sec-animate-in' });
        featuredCard.style.animationDelay = '0.2s';
        
        const featuredHeader = featuredCard.createDiv({ cls: 'sec-card-header' });
        featuredHeader.createDiv({ cls: 'sec-card-icon', text: '⭐' });
        const featuredText = featuredHeader.createDiv();
        featuredText.createEl('h3', { cls: 'sec-card-title', text: 'Gospel Introduction' });
        featuredText.createEl('p', { cls: 'sec-card-subtitle', text: 'Start with the basics' });

        const featuredBody = featuredCard.createDiv({ cls: 'sec-card-body' });
        featuredBody.createEl('p', { 
            cls: 'sec-featured-quote',
            text: '"Do you have a moment to talk about the most important decision of your life?"' 
        });
        
        const viewBtn = featuredBody.createEl('button', { cls: 'sec-btn sec-btn-primary sec-btn-sm' });
        viewBtn.textContent = 'View Full Script';
        viewBtn.addEventListener('click', () => {
            this.ministrySection = 'scripts';
            this.expandedScript = 'intro-gospel';
            this.render();
        });

        // Today's Prayer Focus
        const prayerCard = parent.createDiv({ cls: 'sec-card sec-animate-in' });
        prayerCard.style.animationDelay = '0.3s';
        
        const prayerHeader = prayerCard.createDiv({ cls: 'sec-card-header' });
        prayerHeader.createDiv({ cls: 'sec-card-icon', text: '🔥' });
        const prayerText = prayerHeader.createDiv();
        prayerText.createEl('h3', { cls: 'sec-card-title', text: 'Before You Go Out' });
        prayerText.createEl('p', { cls: 'sec-card-subtitle', text: 'Prepare your heart' });

        const prayerBody = prayerCard.createDiv({ cls: 'sec-card-body' });
        const streetPrayer = PRAYER_TEMPLATES.find(p => p.id === 'street-ministry');
        if (streetPrayer) {
            prayerBody.createEl('p', { cls: 'sec-prayer-text', text: streetPrayer.prayer });
            const ref = prayerBody.createDiv({ cls: 'sec-prayer-scriptures' });
            streetPrayer.scriptures.forEach(s => {
                ref.createSpan({ cls: 'sec-scripture-tag', text: s });
            });
        }
    }

    private renderConversationScripts(parent: HTMLElement): void {
        const header = parent.createDiv({ cls: 'sec-subsection-header' });
        header.createEl('h3', { cls: 'sec-subsection-title', text: 'Conversation Scripts' });
        header.createEl('p', { cls: 'sec-subsection-subtitle', text: 'Tap any script to expand' });

        const list = parent.createDiv({ cls: 'sec-scripts-list' });

        CONVERSATION_SCRIPTS.forEach((script, index) => {
            const isExpanded = this.expandedScript === script.id;
            const card = list.createDiv({ 
                cls: `sec-script-card ${isExpanded ? 'expanded' : ''} sec-animate-slide-up sec-stagger-${Math.min(index + 1, 5)}` 
            });

            // Script Header
            const cardHeader = card.createDiv({ cls: 'sec-script-header' });
            cardHeader.createSpan({ cls: 'sec-script-icon', text: script.icon });
            
            const titleArea = cardHeader.createDiv({ cls: 'sec-script-title-area' });
            titleArea.createEl('h4', { cls: 'sec-script-title', text: script.title });
            titleArea.createEl('p', { cls: 'sec-script-scenario', text: script.scenario });
            
            cardHeader.createSpan({ cls: 'sec-script-toggle', text: isExpanded ? '▲' : '▼' });

            // Script Content
            if (isExpanded) {
                const content = card.createDiv({ cls: 'sec-script-content' });
                
                // Opening
                const openingSection = content.createDiv({ cls: 'sec-script-section' });
                openingSection.createEl('h5', { text: '🎤 Opening Line' });
                openingSection.createEl('p', { cls: 'sec-script-quote', text: script.opening });

                // Key Points
                const pointsSection = content.createDiv({ cls: 'sec-script-section' });
                pointsSection.createEl('h5', { text: '📌 Key Points' });
                const pointsList = pointsSection.createEl('ul', { cls: 'sec-script-points' });
                script.keyPoints.forEach(point => {
                    pointsList.createEl('li', { text: point });
                });

                // Scripture
                const scriptureSection = content.createDiv({ cls: 'sec-script-section' });
                scriptureSection.createEl('h5', { text: '📖 Key Scripture' });
                scriptureSection.createSpan({ cls: 'sec-scripture-tag', text: script.scripture });

                // Closing
                const closingSection = content.createDiv({ cls: 'sec-script-section' });
                closingSection.createEl('h5', { text: '🎯 Closing Line' });
                closingSection.createEl('p', { cls: 'sec-script-quote', text: script.closing });
            }

            // Toggle expand
            cardHeader.addEventListener('click', () => {
                this.expandedScript = isExpanded ? null : script.id;
                this.render();
            });
        });
    }

    private renderCommonQuestions(parent: HTMLElement): void {
        const header = parent.createDiv({ cls: 'sec-subsection-header' });
        header.createEl('h3', { cls: 'sec-subsection-title', text: 'Common Questions' });
        header.createEl('p', { cls: 'sec-subsection-subtitle', text: 'Quick answers for the field' });

        // Category filter could go here in future

        const list = parent.createDiv({ cls: 'sec-questions-list' });

        COMMON_QUESTIONS.forEach((qa, index) => {
            const isExpanded = this.expandedQuestion === qa.id;
            const card = list.createDiv({ 
                cls: `sec-qa-card ${isExpanded ? 'expanded' : ''} sec-animate-slide-up sec-stagger-${Math.min(index + 1, 5)}` 
            });

            // Question Header
            const cardHeader = card.createDiv({ cls: 'sec-qa-header' });
            cardHeader.createSpan({ cls: 'sec-qa-icon', text: '❓' });
            cardHeader.createEl('h4', { cls: 'sec-qa-question', text: qa.question });
            cardHeader.createSpan({ cls: 'sec-qa-toggle', text: isExpanded ? '▲' : '▼' });

            // Short Answer (always visible)
            const shortAnswer = card.createDiv({ cls: 'sec-qa-short' });
            shortAnswer.createEl('p', { text: qa.shortAnswer });

            // Full Answer (expanded)
            if (isExpanded) {
                const fullContent = card.createDiv({ cls: 'sec-qa-full' });
                
                fullContent.createEl('p', { cls: 'sec-qa-full-text', text: qa.fullAnswer });
                
                const scriptures = fullContent.createDiv({ cls: 'sec-qa-scriptures' });
                scriptures.createEl('h5', { text: '📖 Scriptures:' });
                const tags = scriptures.createDiv({ cls: 'sec-scripture-tags' });
                qa.scriptures.forEach(s => {
                    tags.createSpan({ cls: 'sec-scripture-tag', text: s });
                });
            }

            // Toggle expand
            cardHeader.addEventListener('click', () => {
                this.expandedQuestion = isExpanded ? null : qa.id;
                this.render();
            });
        });
    }

    private renderPrayerTemplates(parent: HTMLElement): void {
        const header = parent.createDiv({ cls: 'sec-subsection-header' });
        header.createEl('h3', { cls: 'sec-subsection-title', text: 'Prayer Templates' });
        header.createEl('p', { cls: 'sec-subsection-subtitle', text: 'Ready prayers for every situation' });

        const grid = parent.createDiv({ cls: 'sec-prayers-grid' });

        PRAYER_TEMPLATES.forEach((prayer, index) => {
            const isExpanded = this.expandedPrayer === prayer.id;
            const card = grid.createDiv({ 
                cls: `sec-prayer-card ${isExpanded ? 'expanded' : ''} sec-animate-slide-up sec-stagger-${Math.min(index + 1, 5)}` 
            });

            // Prayer Header
            const cardHeader = card.createDiv({ cls: 'sec-prayer-header' });
            cardHeader.createSpan({ cls: 'sec-prayer-icon', text: prayer.icon });
            
            const titleArea = cardHeader.createDiv({ cls: 'sec-prayer-title-area' });
            titleArea.createEl('h4', { cls: 'sec-prayer-title', text: prayer.title });
            titleArea.createEl('p', { cls: 'sec-prayer-situation', text: prayer.situation });

            // Prayer Content (expanded)
            if (isExpanded) {
                const content = card.createDiv({ cls: 'sec-prayer-content' });
                content.createEl('p', { cls: 'sec-prayer-text', text: prayer.prayer });
                
                const scriptures = content.createDiv({ cls: 'sec-prayer-scriptures' });
                prayer.scriptures.forEach(s => {
                    scriptures.createSpan({ cls: 'sec-scripture-tag', text: s });
                });
            }

            // Toggle expand
            card.addEventListener('click', () => {
                this.expandedPrayer = isExpanded ? null : prayer.id;
                this.render();
            });
        });
    }

    private renderEncounterLog(parent: HTMLElement): void {
        const header = parent.createDiv({ cls: 'sec-subsection-header' });
        header.createEl('h3', { cls: 'sec-subsection-title', text: 'Log New Encounter' });
        header.createEl('p', { cls: 'sec-subsection-subtitle', text: 'Record your ministry moments' });

        // New Encounter Form
        const form = parent.createDiv({ cls: 'sec-encounter-form sec-animate-in' });

        // Location
        const locationGroup = form.createDiv({ cls: 'sec-form-group' });
        locationGroup.createEl('label', { cls: 'sec-form-label', text: '📍 Location' });
        const locationInput = locationGroup.createEl('input', { 
            cls: 'sec-form-input',
            attr: { type: 'text', placeholder: 'Where did this happen?' }
        });

        // Outcome
        const outcomeGroup = form.createDiv({ cls: 'sec-form-group' });
        outcomeGroup.createEl('label', { cls: 'sec-form-label', text: '🎯 Outcome' });
        const outcomeSelect = outcomeGroup.createEl('select', { cls: 'sec-form-select' });
        const outcomes = [
            { value: 'prayer', label: '🙏 Prayer Offered' },
            { value: 'tract', label: '📄 Tract Given' },
            { value: 'conversation', label: '💬 Good Conversation' },
            { value: 'salvation', label: '✨ Salvation!' },
            { value: 'other', label: '📌 Other' },
        ];
        outcomes.forEach(o => {
            outcomeSelect.createEl('option', { value: o.value, text: o.label });
        });

        // Description
        const descGroup = form.createDiv({ cls: 'sec-form-group' });
        descGroup.createEl('label', { cls: 'sec-form-label', text: '📝 What happened?' });
        const descInput = descGroup.createEl('textarea', { 
            cls: 'sec-form-textarea',
            attr: { placeholder: 'Describe the encounter...', rows: '3' }
        });

        // Prayer Request
        const prayerGroup = form.createDiv({ cls: 'sec-form-group' });
        prayerGroup.createEl('label', { cls: 'sec-form-label', text: '🙏 Prayer Request (optional)' });
        const prayerInput = prayerGroup.createEl('input', { 
            cls: 'sec-form-input',
            attr: { type: 'text', placeholder: 'Any prayer needs?' }
        });

        // Follow-up checkbox
        const followGroup = form.createDiv({ cls: 'sec-form-group sec-form-checkbox-group' });
        const followCheckbox = followGroup.createEl('input', { 
            cls: 'sec-form-checkbox',
            attr: { type: 'checkbox', id: 'follow-up' }
        });
        followGroup.createEl('label', { 
            cls: 'sec-form-checkbox-label', 
            text: 'Needs follow-up',
            attr: { for: 'follow-up' }
        });

        // Submit button
        const submitBtn = form.createEl('button', { cls: 'sec-btn sec-btn-primary sec-btn-block' });
        submitBtn.textContent = '✨ Save Encounter';
        submitBtn.addEventListener('click', async () => {
            const location = locationInput.value.trim();
            const outcome = outcomeSelect.value as Encounter['outcome'];
            const description = descInput.value.trim();
            const prayerRequest = prayerInput.value.trim();
            const followUp = followCheckbox.checked;

            if (!location || !description) {
                // Simple validation
                return;
            }

            const encounter: Encounter = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                location,
                description,
                prayerRequests: prayerRequest ? [prayerRequest] : [],
                followUp,
                outcome,
            };

            this.plugin.data.encounters.unshift(encounter);
            this.plugin.data.stats.totalEncounters++;
            if (outcome === 'prayer') this.plugin.data.stats.prayersOffered++;
            if (outcome === 'tract') this.plugin.data.stats.tractsShared++;
            if (outcome === 'salvation') this.plugin.data.stats.salvations++;

            await this.plugin.saveData(this.plugin.data);
            this.render();
        });

        // Recent Encounters
        if (this.plugin.data.encounters.length > 0) {
            const recentHeader = parent.createDiv({ cls: 'sec-subsection-header' });
            recentHeader.style.marginTop = '24px';
            recentHeader.createEl('h3', { cls: 'sec-subsection-title', text: 'Recent Encounters' });

            const recentList = parent.createDiv({ cls: 'sec-encounters-list' });
            
            this.plugin.data.encounters.slice(0, 5).forEach((encounter, index) => {
                const item = recentList.createDiv({ 
                    cls: `sec-encounter-item sec-animate-slide-up sec-stagger-${Math.min(index + 1, 5)}` 
                });
                
                const icon = item.createSpan({ cls: 'sec-encounter-icon', text: this.getEncounterIcon(encounter.outcome) });
                
                const content = item.createDiv({ cls: 'sec-encounter-content' });
                content.createEl('p', { cls: 'sec-encounter-location', text: encounter.location });
                content.createEl('p', { cls: 'sec-encounter-desc', text: encounter.description });
                
                const date = new Date(encounter.date);
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                item.createSpan({ cls: 'sec-encounter-date', text: dateStr });
            });
        }
    }

    // ============================================
    // DOCTRINE TAB - Phase 4
    // ============================================
    private doctrineSection: 'overview' | 'oneness' | 'salvation' | 'holiness' | 'apologetics' = 'overview';

    private renderDoctrineTab(parent: HTMLElement): void {
        const view = parent.createDiv({ cls: 'sec-view active' });

        // Header
        const header = view.createDiv({ cls: 'sec-section-header' });
        header.createSpan({ cls: 'sec-section-badge sec-badge-fire', text: '✝️ Doctrine Reference' });
        header.createEl('h2', { cls: 'sec-section-title', text: 'Apostolic Faith' });
        header.createEl('p', { cls: 'sec-section-subtitle', text: 'Know what you believe and why' });

        // Doctrine Navigation
        this.renderDoctrineNav(view);

        // Section Content
        const content = view.createDiv({ cls: 'sec-doctrine-content' });
        
        switch (this.doctrineSection) {
            case 'overview':
                this.renderDoctrineOverview(content);
                break;
            case 'oneness':
                this.renderOnenessSection(content);
                break;
            case 'salvation':
                this.renderSalvationSection(content);
                break;
            case 'holiness':
                this.renderHolinessSection(content);
                break;
            case 'apologetics':
                this.renderApologeticsSection(content);
                break;
        }
    }

    private renderDoctrineNav(parent: HTMLElement): void {
        const nav = parent.createDiv({ cls: 'sec-doctrine-nav' });

        const sections = [
            { id: 'overview', icon: '🏠', label: 'Overview' },
            { id: 'oneness', icon: '☝️', label: 'Oneness' },
            { id: 'salvation', icon: '💧', label: 'Salvation' },
            { id: 'holiness', icon: '✨', label: 'Holiness' },
            { id: 'apologetics', icon: '🛡️', label: 'Defend' },
        ] as const;

        sections.forEach(section => {
            const btn = nav.createEl('button', {
                cls: `sec-doctrine-nav-btn ${this.doctrineSection === section.id ? 'active' : ''}`,
            });
            btn.createSpan({ cls: 'sec-doctrine-nav-icon', text: section.icon });
            btn.createSpan({ cls: 'sec-doctrine-nav-label', text: section.label });

            btn.addEventListener('click', () => {
                this.doctrineSection = section.id;
                this.render();
            });
        });
    }

    private renderDoctrineOverview(parent: HTMLElement): void {
        // COOLJC Identity Card
        const identityCard = parent.createDiv({ cls: 'sec-card featured sec-animate-in' });
        const identityHeader = identityCard.createDiv({ cls: 'sec-card-header' });
        identityHeader.createDiv({ cls: 'sec-card-icon', text: '⛪' });
        const identityText = identityHeader.createDiv();
        identityText.createEl('h3', { cls: 'sec-card-title', text: 'Church Of Our Lord Jesus Christ' });
        identityText.createEl('p', { cls: 'sec-card-subtitle', text: 'Of the Apostolic Faith, Inc.' });

        const identityBody = identityCard.createDiv({ cls: 'sec-card-body' });
        identityBody.createEl('p', { 
            text: 'Founded in 1919 by Bishop Robert Clarence Lawson in New York City. COOLJC is a Oneness Pentecostal denomination upholding the Apostolic faith once delivered to the saints.' 
        });

        // Core Beliefs Quick Reference
        const quickRef = parent.createDiv({ cls: 'sec-doctrine-quick-ref sec-animate-in' });
        quickRef.style.animationDelay = '0.1s';
        quickRef.createEl('h3', { cls: 'sec-subsection-title', text: '📌 Core Beliefs at a Glance' });

        const beliefs = [
            { icon: '☝️', title: 'One God', desc: 'Jesus is the one true God manifested in flesh (1 Tim 3:16)', color: 'var(--sec-fire)' },
            { icon: '💧', title: 'Baptism in Jesus\' Name', desc: 'Water baptism by immersion in the Name of Jesus Christ (Acts 2:38)', color: 'var(--sec-faith)' },
            { icon: '🔥', title: 'Holy Ghost', desc: 'Infilling of the Holy Ghost with evidence of speaking in tongues (Acts 2:4)', color: 'var(--sec-spirit)' },
            { icon: '✨', title: 'Holiness', desc: 'Living a separated, sanctified life unto the Lord (Heb 12:14)', color: 'var(--sec-hope)' },
        ];

        beliefs.forEach((belief, index) => {
            const item = quickRef.createDiv({ cls: `sec-belief-card sec-animate-slide-up sec-stagger-${index + 1}` });
            const iconEl = item.createDiv({ cls: 'sec-belief-icon' });
            iconEl.style.background = belief.color;
            iconEl.textContent = belief.icon;
            
            const textEl = item.createDiv({ cls: 'sec-belief-text' });
            textEl.createEl('h4', { cls: 'sec-belief-title', text: belief.title });
            textEl.createEl('p', { cls: 'sec-belief-desc', text: belief.desc });
        });

        // Quick Navigation Cards
        const navCards = parent.createDiv({ cls: 'sec-doctrine-nav-cards sec-animate-in' });
        navCards.style.animationDelay = '0.2s';

        const cards = [
            { icon: '☝️', title: 'Oneness Theology', desc: 'Understanding God in Christ', section: 'oneness' as const },
            { icon: '💧', title: 'Plan of Salvation', desc: 'Acts 2:38 explained', section: 'salvation' as const },
            { icon: '✨', title: 'Holiness Standards', desc: 'Living separated unto God', section: 'holiness' as const },
            { icon: '🛡️', title: 'Apologetics', desc: 'Defend your faith', section: 'apologetics' as const },
        ];

        cards.forEach((card, index) => {
            const cardEl = navCards.createDiv({ cls: `sec-doctrine-nav-card sec-animate-slide-up sec-stagger-${index + 1}` });
            cardEl.createSpan({ cls: 'sec-doctrine-nav-card-icon', text: card.icon });
            cardEl.createEl('h4', { cls: 'sec-doctrine-nav-card-title', text: card.title });
            cardEl.createEl('p', { cls: 'sec-doctrine-nav-card-desc', text: card.desc });
            
            cardEl.addEventListener('click', () => {
                this.doctrineSection = card.section;
                this.render();
            });
        });

        // Key Scripture
        const keyScripture = parent.createDiv({ cls: 'sec-key-scripture sec-animate-in' });
        keyScripture.style.animationDelay = '0.3s';
        keyScripture.createEl('p', { cls: 'sec-scripture-text', text: '"For there are three that bear record in heaven, the Father, the Word, and the Holy Ghost: and these three are one."' });
        keyScripture.createEl('p', { cls: 'sec-scripture-ref', text: '— 1 John 5:7' });
    }

    private renderOnenessSection(parent: HTMLElement): void {
        const header = parent.createDiv({ cls: 'sec-subsection-header' });
        header.createEl('h3', { cls: 'sec-subsection-title', text: 'Oneness Theology' });
        header.createEl('p', { cls: 'sec-subsection-subtitle', text: 'There is ONE God, and His name is Jesus' });

        // The One God
        const oneGodCard = parent.createDiv({ cls: 'sec-doctrine-card sec-animate-in' });
        oneGodCard.createDiv({ cls: 'sec-doctrine-card-header' }).createEl('h4', { text: '☝️ The One God' });
        const oneGodBody = oneGodCard.createDiv({ cls: 'sec-doctrine-card-body' });
        oneGodBody.createEl('p', { text: 'We believe in ONE God who has revealed Himself as Father in creation, Son in redemption, and Holy Ghost in regeneration. This is not three separate persons, but three manifestations of the ONE true God.' });
        
        const oneGodScriptures = oneGodBody.createDiv({ cls: 'sec-scripture-list' });
        const oneGodVerses = [
            { ref: 'Deuteronomy 6:4', text: 'Hear, O Israel: The LORD our God is one LORD' },
            { ref: 'Isaiah 44:6', text: 'I am the first, and I am the last; and beside me there is no God' },
            { ref: 'Isaiah 9:6', text: 'For unto us a child is born... and his name shall be called... The mighty God, The everlasting Father' },
            { ref: 'John 10:30', text: 'I and my Father are one' },
            { ref: 'Colossians 2:9', text: 'For in him dwelleth all the fulness of the Godhead bodily' },
        ];
        oneGodVerses.forEach(v => {
            const verse = oneGodScriptures.createDiv({ cls: 'sec-scripture-item' });
            verse.createSpan({ cls: 'sec-scripture-ref-inline', text: v.ref });
            verse.createSpan({ cls: 'sec-scripture-text-inline', text: v.text });
        });

        // Jesus is God
        const jesusCard = parent.createDiv({ cls: 'sec-doctrine-card sec-animate-in' });
        jesusCard.style.animationDelay = '0.1s';
        jesusCard.createDiv({ cls: 'sec-doctrine-card-header' }).createEl('h4', { text: '✝️ Jesus Is the One God' });
        const jesusBody = jesusCard.createDiv({ cls: 'sec-doctrine-card-body' });
        jesusBody.createEl('p', { text: 'Jesus Christ is not the "second person of a trinity" but is the ONE God manifest in flesh. The Father dwells IN the Son, not beside Him.' });
        
        const jesusScriptures = jesusBody.createDiv({ cls: 'sec-scripture-list' });
        const jesusVerses = [
            { ref: '1 Timothy 3:16', text: 'God was manifest in the flesh' },
            { ref: 'John 14:9', text: 'He that hath seen me hath seen the Father' },
            { ref: 'John 14:10', text: 'The Father that dwelleth in me, he doeth the works' },
            { ref: 'John 1:1,14', text: 'The Word was God... and the Word was made flesh' },
            { ref: 'Matthew 1:23', text: 'Emmanuel, which being interpreted is, God with us' },
        ];
        jesusVerses.forEach(v => {
            const verse = jesusScriptures.createDiv({ cls: 'sec-scripture-item' });
            verse.createSpan({ cls: 'sec-scripture-ref-inline', text: v.ref });
            verse.createSpan({ cls: 'sec-scripture-text-inline', text: v.text });
        });

        // The Name of Jesus
        const nameCard = parent.createDiv({ cls: 'sec-doctrine-card sec-animate-in' });
        nameCard.style.animationDelay = '0.2s';
        nameCard.createDiv({ cls: 'sec-doctrine-card-header' }).createEl('h4', { text: '📛 The Name of Jesus' });
        const nameBody = nameCard.createDiv({ cls: 'sec-doctrine-card-body' });
        nameBody.createEl('p', { text: 'The singular "name" of the Father, Son, and Holy Ghost is JESUS. This is the saving name that was revealed in the New Testament.' });
        
        const nameScriptures = nameBody.createDiv({ cls: 'sec-scripture-list' });
        const nameVerses = [
            { ref: 'Matthew 28:19', text: 'Baptizing them in the name (singular) of the Father, Son, and Holy Ghost' },
            { ref: 'Acts 4:12', text: 'There is none other name under heaven given among men, whereby we must be saved' },
            { ref: 'Philippians 2:9-10', text: 'God... given him a name which is above every name: That at the name of Jesus every knee should bow' },
            { ref: 'Colossians 3:17', text: 'Whatsoever ye do in word or deed, do all in the name of the Lord Jesus' },
        ];
        nameVerses.forEach(v => {
            const verse = nameScriptures.createDiv({ cls: 'sec-scripture-item' });
            verse.createSpan({ cls: 'sec-scripture-ref-inline', text: v.ref });
            verse.createSpan({ cls: 'sec-scripture-text-inline', text: v.text });
        });

        // Comparison Chart
        const comparisonCard = parent.createDiv({ cls: 'sec-doctrine-card sec-animate-in' });
        comparisonCard.style.animationDelay = '0.3s';
        comparisonCard.createDiv({ cls: 'sec-doctrine-card-header' }).createEl('h4', { text: '📊 Oneness vs. Trinity' });
        const comparisonBody = comparisonCard.createDiv({ cls: 'sec-doctrine-card-body' });
        
        const table = comparisonBody.createEl('table', { cls: 'sec-comparison-table' });
        const thead = table.createEl('thead');
        const headerRow = thead.createEl('tr');
        headerRow.createEl('th', { text: 'Topic' });
        headerRow.createEl('th', { text: 'Oneness' });
        headerRow.createEl('th', { text: 'Trinity' });
        
        const tbody = table.createEl('tbody');
        const comparisons = [
            { topic: 'Godhead', oneness: 'One God in three manifestations', trinity: 'Three co-equal persons' },
            { topic: 'Jesus', oneness: 'The fullness of God in flesh', trinity: 'Second person of trinity' },
            { topic: 'Father', oneness: 'Title/role of God as Creator', trinity: 'First person of trinity' },
            { topic: 'Holy Spirit', oneness: 'God in action/Spirit of Jesus', trinity: 'Third person of trinity' },
            { topic: 'Baptism', oneness: 'In Jesus\' Name (Acts 2:38)', trinity: 'Father, Son, Holy Ghost titles' },
        ];
        comparisons.forEach(c => {
            const row = tbody.createEl('tr');
            row.createEl('td', { cls: 'sec-table-topic', text: c.topic });
            row.createEl('td', { cls: 'sec-table-oneness', text: c.oneness });
            row.createEl('td', { cls: 'sec-table-trinity', text: c.trinity });
        });
    }

    private renderSalvationSection(parent: HTMLElement): void {
        const header = parent.createDiv({ cls: 'sec-subsection-header' });
        header.createEl('h3', { cls: 'sec-subsection-title', text: 'The Plan of Salvation' });
        header.createEl('p', { cls: 'sec-subsection-subtitle', text: 'Acts 2:38 - The Apostolic Pattern' });

        // Featured Scripture
        const featuredScripture = parent.createDiv({ cls: 'sec-featured-scripture sec-animate-in' });
        featuredScripture.createEl('p', { cls: 'sec-featured-text', text: '"Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."' });
        featuredScripture.createEl('p', { cls: 'sec-featured-ref', text: '— Acts 2:38' });

        // Three Steps
        const stepsContainer = parent.createDiv({ cls: 'sec-salvation-steps' });
        
        const steps = [
            {
                num: '1',
                title: 'REPENT',
                icon: '🙏',
                color: 'var(--sec-fire)',
                desc: 'A genuine turning away from sin and turning toward God. Godly sorrow that produces a change of mind and direction.',
                scriptures: [
                    { ref: 'Acts 3:19', text: 'Repent ye therefore, and be converted, that your sins may be blotted out' },
                    { ref: 'Luke 13:3', text: 'Except ye repent, ye shall all likewise perish' },
                    { ref: '2 Corinthians 7:10', text: 'Godly sorrow worketh repentance to salvation' },
                ]
            },
            {
                num: '2',
                title: 'BAPTISM IN JESUS\' NAME',
                icon: '💧',
                color: 'var(--sec-faith)',
                desc: 'Water baptism by full immersion in the Name of Jesus Christ for the remission of sins. This is the biblical formula used throughout the Book of Acts.',
                scriptures: [
                    { ref: 'Acts 2:38', text: 'Be baptized every one of you in the name of Jesus Christ for the remission of sins' },
                    { ref: 'Acts 8:16', text: 'They were baptized in the name of the Lord Jesus' },
                    { ref: 'Acts 10:48', text: 'He commanded them to be baptized in the name of the Lord' },
                    { ref: 'Acts 19:5', text: 'They were baptized in the name of the Lord Jesus' },
                    { ref: 'Acts 22:16', text: 'Arise, and be baptized, and wash away thy sins, calling on the name of the Lord' },
                ]
            },
            {
                num: '3',
                title: 'HOLY GHOST',
                icon: '🔥',
                color: 'var(--sec-spirit)',
                desc: 'Receiving the gift of the Holy Ghost with the initial evidence of speaking in other tongues as the Spirit gives utterance. This is the promise to all believers.',
                scriptures: [
                    { ref: 'Acts 2:4', text: 'They were all filled with the Holy Ghost, and began to speak with other tongues' },
                    { ref: 'Acts 10:44-46', text: 'The Holy Ghost fell on all them... they heard them speak with tongues' },
                    { ref: 'Acts 19:6', text: 'The Holy Ghost came on them; and they spake with tongues' },
                    { ref: 'John 3:5', text: 'Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God' },
                ]
            }
        ];

        steps.forEach((step, index) => {
            const stepCard = stepsContainer.createDiv({ cls: `sec-step-card sec-animate-slide-up sec-stagger-${index + 1}` });
            
            const stepNum = stepCard.createDiv({ cls: 'sec-step-num' });
            stepNum.style.background = step.color;
            stepNum.textContent = step.num;
            
            const stepContent = stepCard.createDiv({ cls: 'sec-step-content' });
            const stepHeader = stepContent.createDiv({ cls: 'sec-step-header' });
            stepHeader.createSpan({ cls: 'sec-step-icon', text: step.icon });
            stepHeader.createEl('h4', { cls: 'sec-step-title', text: step.title });
            
            stepContent.createEl('p', { cls: 'sec-step-desc', text: step.desc });
            
            const scriptureList = stepContent.createDiv({ cls: 'sec-step-scriptures' });
            step.scriptures.forEach(s => {
                const item = scriptureList.createDiv({ cls: 'sec-scripture-item' });
                item.createSpan({ cls: 'sec-scripture-ref-inline', text: s.ref });
                item.createSpan({ cls: 'sec-scripture-text-inline', text: s.text });
            });
        });

        // Why Jesus' Name Baptism
        const whyCard = parent.createDiv({ cls: 'sec-doctrine-card sec-animate-in' });
        whyCard.style.animationDelay = '0.4s';
        whyCard.createDiv({ cls: 'sec-doctrine-card-header' }).createEl('h4', { text: '❓ Why Baptism in Jesus\' Name?' });
        const whyBody = whyCard.createDiv({ cls: 'sec-doctrine-card-body' });
        
        const reasons = [
            'Every baptism recorded in the Book of Acts was in Jesus\' Name',
            'The Apostles understood Matthew 28:19 - the NAME of Father, Son, and Holy Ghost is JESUS',
            '"Name" in Matthew 28:19 is singular - one name for all three titles',
            'There is saving power in the Name of Jesus (Acts 4:12)',
            'Remission of sins is in His Name (Acts 10:43, Luke 24:47)',
            'It was "re-baptisms" when people had not been baptized in Jesus\' Name (Acts 19:1-5)',
        ];
        
        const reasonsList = whyBody.createEl('ul', { cls: 'sec-reasons-list' });
        reasons.forEach(r => reasonsList.createEl('li', { text: r }));
    }

    private renderHolinessSection(parent: HTMLElement): void {
        const header = parent.createDiv({ cls: 'sec-subsection-header' });
        header.createEl('h3', { cls: 'sec-subsection-title', text: 'Holiness Standards' });
        header.createEl('p', { cls: 'sec-subsection-subtitle', text: 'Living separated unto God' });

        // Key Scripture
        const keyScripture = parent.createDiv({ cls: 'sec-featured-scripture sec-animate-in' });
        keyScripture.createEl('p', { cls: 'sec-featured-text', text: '"Follow peace with all men, and holiness, without which no man shall see the Lord."' });
        keyScripture.createEl('p', { cls: 'sec-featured-ref', text: '— Hebrews 12:14' });

        // What is Holiness
        const whatCard = parent.createDiv({ cls: 'sec-doctrine-card sec-animate-in' });
        whatCard.style.animationDelay = '0.1s';
        whatCard.createDiv({ cls: 'sec-doctrine-card-header' }).createEl('h4', { text: '✨ What Is Holiness?' });
        const whatBody = whatCard.createDiv({ cls: 'sec-doctrine-card-body' });
        whatBody.createEl('p', { text: 'Holiness means "set apart" or "separated." As believers, we are called to be different from the world - set apart for God\'s use and glory. Holiness is not a burden but a blessing; it\'s the lifestyle of those who truly love God.' });
        
        const holinessScriptures = whatBody.createDiv({ cls: 'sec-scripture-list' });
        const holinessVerses = [
            { ref: '1 Peter 1:15-16', text: 'Be ye holy; for I am holy' },
            { ref: '2 Corinthians 6:17', text: 'Come out from among them, and be ye separate' },
            { ref: 'Romans 12:1-2', text: 'Be not conformed to this world: but be ye transformed' },
            { ref: 'Titus 2:11-12', text: 'The grace of God... teaches us to deny ungodliness and worldly lusts' },
        ];
        holinessVerses.forEach(v => {
            const verse = holinessScriptures.createDiv({ cls: 'sec-scripture-item' });
            verse.createSpan({ cls: 'sec-scripture-ref-inline', text: v.ref });
            verse.createSpan({ cls: 'sec-scripture-text-inline', text: v.text });
        });

        // Areas of Holiness
        const areasCard = parent.createDiv({ cls: 'sec-doctrine-card sec-animate-in' });
        areasCard.style.animationDelay = '0.2s';
        areasCard.createDiv({ cls: 'sec-doctrine-card-header' }).createEl('h4', { text: '📋 Practical Holiness' });
        const areasBody = areasCard.createDiv({ cls: 'sec-doctrine-card-body' });

        const areas = [
            {
                title: 'Modesty in Dress',
                icon: '👗',
                points: [
                    'Women wearing dresses/skirts (distinction in clothing - Deut 22:5)',
                    'Modest apparel, not revealing or provocative (1 Tim 2:9)',
                    'Avoiding worldly fashions that glorify the flesh',
                ],
                scriptures: ['1 Timothy 2:9-10', 'Deuteronomy 22:5', '1 Peter 3:3-4']
            },
            {
                title: 'Uncut Hair for Women',
                icon: '💇‍♀️',
                points: [
                    'Hair is a woman\'s glory and covering (1 Cor 11:15)',
                    'Nature teaches distinction between men and women',
                    'A sign of submission to God\'s order',
                ],
                scriptures: ['1 Corinthians 11:3-15']
            },
            {
                title: 'No Jewelry/Makeup',
                icon: '💍',
                points: [
                    'Adorning the inner person rather than outward',
                    'Not being conformed to worldly beauty standards',
                    'Gold, pearls, costly array - focus on inner beauty',
                ],
                scriptures: ['1 Timothy 2:9', '1 Peter 3:3-4', 'Isaiah 3:16-24']
            },
            {
                title: 'Holy Conduct',
                icon: '🙌',
                points: [
                    'Clean speech - no profanity, gossip, or corrupt communication',
                    'Honest dealings in business and relationships',
                    'Abstaining from alcohol, drugs, and tobacco',
                    'Entertainment that glorifies God',
                ],
                scriptures: ['Ephesians 4:29', 'Colossians 3:8', 'Proverbs 20:1', 'Philippians 4:8']
            }
        ];

        areas.forEach((area, index) => {
            const areaItem = areasBody.createDiv({ cls: `sec-holiness-area sec-animate-slide-up sec-stagger-${index + 1}` });
            
            const areaHeader = areaItem.createDiv({ cls: 'sec-holiness-area-header' });
            areaHeader.createSpan({ cls: 'sec-holiness-icon', text: area.icon });
            areaHeader.createEl('h5', { cls: 'sec-holiness-title', text: area.title });
            
            const areaContent = areaItem.createDiv({ cls: 'sec-holiness-content' });
            const pointsList = areaContent.createEl('ul', { cls: 'sec-holiness-points' });
            area.points.forEach(p => pointsList.createEl('li', { text: p }));
            
            const refs = areaContent.createDiv({ cls: 'sec-holiness-refs' });
            area.scriptures.forEach(s => {
                refs.createSpan({ cls: 'sec-ref-tag', text: s });
            });
        });

        // Not Legalism
        const graceCard = parent.createDiv({ cls: 'sec-doctrine-card sec-animate-in' });
        graceCard.style.animationDelay = '0.3s';
        graceCard.createDiv({ cls: 'sec-doctrine-card-header' }).createEl('h4', { text: '💝 Holiness Is Love, Not Legalism' });
        const graceBody = graceCard.createDiv({ cls: 'sec-doctrine-card-body' });
        graceBody.createEl('p', { text: 'We don\'t keep holiness standards to earn salvation - we keep them because we ARE saved and we love God. When we truly love Him, we want to please Him in every area of our lives. Holiness flows from relationship, not religion.' });
        
        const graceScriptures = graceBody.createDiv({ cls: 'sec-scripture-list' });
        const graceVerses = [
            { ref: 'John 14:15', text: 'If ye love me, keep my commandments' },
            { ref: '1 John 5:3', text: 'For this is the love of God, that we keep his commandments: and his commandments are not grievous' },
            { ref: '2 Corinthians 5:14-15', text: 'The love of Christ constraineth us... that they which live should not henceforth live unto themselves' },
        ];
        graceVerses.forEach(v => {
            const verse = graceScriptures.createDiv({ cls: 'sec-scripture-item' });
            verse.createSpan({ cls: 'sec-scripture-ref-inline', text: v.ref });
            verse.createSpan({ cls: 'sec-scripture-text-inline', text: v.text });
        });
    }

    private renderApologeticsSection(parent: HTMLElement): void {
        const header = parent.createDiv({ cls: 'sec-subsection-header' });
        header.createEl('h3', { cls: 'sec-subsection-title', text: 'Apologetics' });
        header.createEl('p', { cls: 'sec-subsection-subtitle', text: 'Answers to common questions and objections' });

        // Introduction
        const introCard = parent.createDiv({ cls: 'sec-featured-scripture sec-animate-in' });
        introCard.createEl('p', { cls: 'sec-featured-text', text: '"But sanctify the Lord God in your hearts: and be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear."' });
        introCard.createEl('p', { cls: 'sec-featured-ref', text: '— 1 Peter 3:15' });

        const objections = [
            {
                question: 'Doesn\'t Matthew 28:19 say to baptize in the name of the Father, Son, and Holy Ghost?',
                answer: 'Yes! And that\'s exactly what the Apostles did. Notice "name" is singular - one name for three titles. The Apostles understood the name of the Father, Son, and Holy Ghost to be JESUS. That\'s why every recorded baptism in Acts is in Jesus\' Name (Acts 2:38, 8:16, 10:48, 19:5, 22:16).',
                scriptures: ['Matthew 28:19', 'Acts 2:38', 'Acts 8:16', 'Acts 10:48']
            },
            {
                question: 'Doesn\'t the Trinity explain how God can be Father, Son, and Holy Ghost?',
                answer: 'The word "Trinity" isn\'t in the Bible. Scripture teaches ONE God (Deut 6:4, Isa 44:6), not three persons. Jesus said "I and my Father are one" (John 10:30). The Father is IN the Son (John 14:10), not beside Him. Colossians 2:9 says the FULLNESS of the Godhead dwells in Jesus bodily.',
                scriptures: ['Deuteronomy 6:4', 'Isaiah 44:6', 'John 10:30', 'John 14:10', 'Colossians 2:9']
            },
            {
                question: 'Is speaking in tongues really necessary?',
                answer: 'Jesus said "Ye must be born again" (John 3:7) and "born of water and of the Spirit" (John 3:5). In Acts, the evidence of receiving the Holy Ghost was always speaking in tongues (Acts 2:4, 10:44-46, 19:6). It\'s not our idea - it\'s the Biblical pattern!',
                scriptures: ['John 3:5-7', 'Acts 2:4', 'Acts 10:44-46', 'Acts 19:6']
            },
            {
                question: 'Didn\'t Jesus pray to the Father? Doesn\'t that show they are separate?',
                answer: 'Jesus had two natures - divine and human. His human nature prayed to His divine nature. The man Christ Jesus prayed to the Spirit of God that dwelt within Him. Just as we pray even though the Holy Ghost lives within us, Jesus\' flesh prayed to the Spirit.',
                scriptures: ['John 1:14', '1 Timothy 2:5', '1 Timothy 3:16', 'John 14:10']
            },
            {
                question: 'What about the baptism of Jesus where the Father spoke and the Spirit descended?',
                answer: 'God is Spirit and can manifest in multiple ways simultaneously. The Spirit descending like a dove doesn\'t make it a separate person - it\'s God\'s Spirit. The voice from heaven was the Father\'s voice - Jesus IS the Father manifest in flesh. One God, multiple manifestations.',
                scriptures: ['John 4:24', 'Isaiah 9:6', 'John 14:9', '1 Timothy 3:16']
            },
            {
                question: 'Why can\'t I just accept Jesus and be saved?',
                answer: 'Believing is the starting point, but Jesus said we must be "born of water and Spirit" (John 3:5). James 2:19 says even devils believe. The Apostles\' consistent message was "Repent, be baptized in Jesus\' Name, receive the Holy Ghost" (Acts 2:38). This is the complete new birth!',
                scriptures: ['John 3:5', 'James 2:19', 'Acts 2:38', 'Mark 16:16']
            },
            {
                question: 'Aren\'t holiness standards just man-made rules?',
                answer: 'The principles come directly from Scripture. Modesty (1 Tim 2:9), distinction between genders (Deut 22:5), not being conformed to the world (Rom 12:2), women\'s uncut hair (1 Cor 11:15). We follow these not to earn salvation, but because we love God and want to please Him (John 14:15).',
                scriptures: ['1 Timothy 2:9', 'Deuteronomy 22:5', 'Romans 12:2', '1 Corinthians 11:15']
            },
            {
                question: 'Why do you say Jesus is the Father?',
                answer: 'Because the Bible does! Isaiah 9:6 calls Jesus "The everlasting Father." Jesus said "He that hath seen me hath seen the Father" (John 14:9). The Father is not a separate person but the divine Spirit that dwells IN Jesus. "I and my Father are one" (John 10:30).',
                scriptures: ['Isaiah 9:6', 'John 14:9', 'John 10:30', 'John 14:10-11']
            }
        ];

        objections.forEach((obj, index) => {
            const card = parent.createDiv({ cls: `sec-apologetics-card sec-animate-slide-up sec-stagger-${Math.min(index + 1, 5)}` });
            
            const questionEl = card.createDiv({ cls: 'sec-apologetics-question' });
            questionEl.createSpan({ cls: 'sec-question-icon', text: '❓' });
            questionEl.createEl('h4', { cls: 'sec-question-text', text: obj.question });
            
            const answerEl = card.createDiv({ cls: 'sec-apologetics-answer' });
            answerEl.createEl('p', { text: obj.answer });
            
            const refs = answerEl.createDiv({ cls: 'sec-apologetics-refs' });
            obj.scriptures.forEach(s => {
                refs.createSpan({ cls: 'sec-ref-tag', text: s });
            });
        });

        // Tips for Sharing
        const tipsCard = parent.createDiv({ cls: 'sec-doctrine-card sec-animate-in' });
        tipsCard.style.animationDelay = '0.3s';
        tipsCard.createDiv({ cls: 'sec-doctrine-card-header' }).createEl('h4', { text: '💡 Tips for Sharing' });
        const tipsBody = tipsCard.createDiv({ cls: 'sec-doctrine-card-body' });
        
        const tips = [
            'Always speak in love - truth without love is harsh (Eph 4:15)',
            'Let Scripture speak - use Bible references, not opinions',
            'Be patient - it may take time for truth to sink in',
            'Pray before engaging - the Holy Ghost is your helper',
            'Know when to stop - don\'t cast pearls before swine (Matt 7:6)',
            'Your testimony is powerful - share what God has done for you',
            'Live what you preach - your life is your greatest witness',
        ];
        
        const tipsList = tipsBody.createEl('ul', { cls: 'sec-tips-list' });
        tips.forEach(t => tipsList.createEl('li', { text: t }));
    }

    // ============================================
    // JOURNAL TAB - Phase 5
    // ============================================
    private journalSection: 'overview' | 'write' | 'prayers' | 'testimonies' | 'memory' = 'overview';
    private editingEntry: JournalEntry | null = null;
    private editingPrayer: PrayerRequest | null = null;

    private renderJournalTab(parent: HTMLElement): void {
        const view = parent.createDiv({ cls: 'sec-view active' });

        // Header
        const header = view.createDiv({ cls: 'sec-section-header' });
        header.createSpan({ cls: 'sec-section-badge sec-badge-hope', text: '📝 Ministry Journal' });
        header.createEl('h2', { cls: 'sec-section-title', text: 'Your Spiritual Journey' });
        header.createEl('p', { cls: 'sec-section-subtitle', text: 'Record, reflect, and remember God\'s faithfulness' });

        // Journal Stats
        this.renderJournalStats(view);

        // Section Navigation
        this.renderJournalNav(view);

        // Section Content
        const content = view.createDiv({ cls: 'sec-journal-content' });
        
        switch (this.journalSection) {
            case 'overview':
                this.renderJournalOverview(content);
                break;
            case 'write':
                this.renderJournalWrite(content);
                break;
            case 'prayers':
                this.renderPrayerRequests(content);
                break;
            case 'testimonies':
                this.renderTestimonies(content);
                break;
            case 'memory':
                this.renderScriptureMemory(content);
                break;
        }
    }

    private renderJournalStats(parent: HTMLElement): void {
        const stats = parent.createDiv({ cls: 'sec-journal-stats sec-animate-in' });

        const statItems = [
            { value: this.plugin.data.journalEntries.length, label: 'Entries', icon: '📝' },
            { value: this.plugin.data.prayerRequests.filter(p => p.status === 'answered').length, label: 'Answered', icon: '✓' },
            { value: this.plugin.data.testimonies.length, label: 'Testimonies', icon: '✨' },
            { value: this.plugin.data.scriptureMemory.filter(s => s.memorized).length, label: 'Memorized', icon: '📖' },
        ];

        statItems.forEach((stat) => {
            const card = stats.createDiv({ cls: 'sec-journal-stat' });
            card.createSpan({ cls: 'sec-journal-stat-icon', text: stat.icon });
            card.createDiv({ cls: 'sec-journal-stat-value', text: String(stat.value) });
            card.createDiv({ cls: 'sec-journal-stat-label', text: stat.label });
        });
    }

    private renderJournalNav(parent: HTMLElement): void {
        const nav = parent.createDiv({ cls: 'sec-journal-nav' });

        const sections = [
            { id: 'overview', icon: '🏠', label: 'Home' },
            { id: 'write', icon: '✍️', label: 'Write' },
            { id: 'prayers', icon: '🙏', label: 'Prayers' },
            { id: 'testimonies', icon: '✨', label: 'Testimonies' },
            { id: 'memory', icon: '📖', label: 'Memory' },
        ] as const;

        sections.forEach(section => {
            const btn = nav.createEl('button', {
                cls: `sec-journal-nav-btn ${this.journalSection === section.id ? 'active' : ''}`,
            });
            btn.createSpan({ cls: 'sec-journal-nav-icon', text: section.icon });
            btn.createSpan({ cls: 'sec-journal-nav-label', text: section.label });

            btn.addEventListener('click', () => {
                this.journalSection = section.id;
                this.editingEntry = null;
                this.editingPrayer = null;
                this.render();
            });
        });
    }

    private renderJournalOverview(parent: HTMLElement): void {
        // Daily Prompt Card
        const promptCard = parent.createDiv({ cls: 'sec-card featured sec-animate-in' });
        const promptHeader = promptCard.createDiv({ cls: 'sec-card-header' });
        promptHeader.createDiv({ cls: 'sec-card-icon', text: '💭' });
        const promptText = promptHeader.createDiv();
        promptText.createEl('h3', { cls: 'sec-card-title', text: 'Today\'s Prompt' });
        promptText.createEl('p', { cls: 'sec-card-subtitle', text: 'Something to reflect on' });

        const promptBody = promptCard.createDiv({ cls: 'sec-card-body' });
        const todayIndex = new Date().getDate() % DEVOTION_PROMPTS.length;
        promptBody.createEl('p', { cls: 'sec-daily-prompt', text: DEVOTION_PROMPTS[todayIndex] });
        
        const writeBtn = promptBody.createEl('button', { cls: 'sec-btn sec-btn-primary sec-btn-sm' });
        writeBtn.textContent = '✍️ Start Writing';
        writeBtn.addEventListener('click', () => {
            this.journalSection = 'write';
            this.render();
        });

        // Quick Actions
        const quickActions = parent.createDiv({ cls: 'sec-journal-quick-actions' });
        
        const actions = [
            { icon: '📝', label: 'New Entry', action: () => { this.journalSection = 'write'; this.render(); } },
            { icon: '🙏', label: 'Add Prayer', action: () => { this.journalSection = 'prayers'; this.render(); } },
            { icon: '✨', label: 'Testimony', action: () => { this.journalSection = 'testimonies'; this.render(); } },
            { icon: '📖', label: 'Scripture', action: () => { this.journalSection = 'memory'; this.render(); } },
        ];

        actions.forEach((action, index) => {
            const btn = quickActions.createEl('button', { 
                cls: `sec-action-btn sec-animate-slide-up sec-stagger-${index + 1}` 
            });
            btn.createSpan({ cls: 'sec-action-icon', text: action.icon });
            btn.createSpan({ cls: 'sec-action-label', text: action.label });
            btn.addEventListener('click', action.action);
        });

        // Recent Entries
        if (this.plugin.data.journalEntries.length > 0) {
            const recentSection = parent.createDiv({ cls: 'sec-recent-entries sec-animate-in' });
            recentSection.style.animationDelay = '0.2s';
            
            const recentHeader = recentSection.createDiv({ cls: 'sec-subsection-header' });
            recentHeader.createEl('h3', { cls: 'sec-subsection-title', text: 'Recent Entries' });

            this.plugin.data.journalEntries.slice(0, 3).forEach((entry, index) => {
                const item = recentSection.createDiv({ cls: `sec-entry-preview sec-animate-slide-up sec-stagger-${index + 1}` });
                item.createSpan({ cls: 'sec-entry-type-icon', text: this.getEntryTypeIcon(entry.type) });
                
                const content = item.createDiv({ cls: 'sec-entry-preview-content' });
                content.createEl('h4', { cls: 'sec-entry-preview-title', text: entry.title });
                
                const meta = content.createDiv({ cls: 'sec-entry-preview-meta' });
                const date = new Date(entry.date);
                meta.createSpan({ text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
                if (entry.mood) {
                    meta.createSpan({ cls: 'sec-mood-tag', text: this.getMoodEmoji(entry.mood) });
                }
            });
        }

        // Active Prayer Requests
        const activePrayers = this.plugin.data.prayerRequests.filter(p => p.status === 'active');
        if (activePrayers.length > 0) {
            const prayerSection = parent.createDiv({ cls: 'sec-active-prayers sec-animate-in' });
            prayerSection.style.animationDelay = '0.3s';
            
            const prayerHeader = prayerSection.createDiv({ cls: 'sec-subsection-header' });
            prayerHeader.createEl('h3', { cls: 'sec-subsection-title', text: `🙏 Active Prayers (${activePrayers.length})` });

            activePrayers.slice(0, 3).forEach((prayer) => {
                const item = prayerSection.createDiv({ cls: 'sec-prayer-preview' });
                item.createSpan({ cls: 'sec-prayer-preview-icon', text: '🙏' });
                item.createEl('p', { cls: 'sec-prayer-preview-text', text: prayer.request });
            });
        }
    }

    private renderJournalWrite(parent: HTMLElement): void {
        const header = parent.createDiv({ cls: 'sec-subsection-header' });
        header.createEl('h3', { cls: 'sec-subsection-title', text: 'Write New Entry' });
        header.createEl('p', { cls: 'sec-subsection-subtitle', text: 'Record your thoughts, prayers, and reflections' });

        const form = parent.createDiv({ cls: 'sec-journal-form sec-animate-in' });

        // Entry Type
        const typeGroup = form.createDiv({ cls: 'sec-form-group' });
        typeGroup.createEl('label', { cls: 'sec-form-label', text: '📁 Entry Type' });
        const typeSelect = typeGroup.createEl('select', { cls: 'sec-form-select' });
        const types = [
            { value: 'devotion', label: '📖 Daily Devotion' },
            { value: 'reflection', label: '💭 Reflection' },
            { value: 'testimony', label: '✨ Testimony' },
            { value: 'prayer', label: '🙏 Prayer Journal' },
            { value: 'note', label: '📝 Quick Note' },
        ];
        types.forEach(t => {
            typeSelect.createEl('option', { value: t.value, text: t.label });
        });

        // Title
        const titleGroup = form.createDiv({ cls: 'sec-form-group' });
        titleGroup.createEl('label', { cls: 'sec-form-label', text: '📌 Title' });
        const titleInput = titleGroup.createEl('input', { 
            cls: 'sec-form-input',
            attr: { type: 'text', placeholder: 'Give your entry a title...' }
        });

        // Content
        const contentGroup = form.createDiv({ cls: 'sec-form-group' });
        contentGroup.createEl('label', { cls: 'sec-form-label', text: '✍️ Your Thoughts' });
        const contentInput = contentGroup.createEl('textarea', { 
            cls: 'sec-form-textarea sec-journal-textarea',
            attr: { placeholder: 'Pour out your heart...', rows: '6' }
        });

        // Scripture Reference
        const scriptureGroup = form.createDiv({ cls: 'sec-form-group' });
        scriptureGroup.createEl('label', { cls: 'sec-form-label', text: '📖 Scripture Reference (optional)' });
        const scriptureInput = scriptureGroup.createEl('input', { 
            cls: 'sec-form-input',
            attr: { type: 'text', placeholder: 'e.g., John 3:16' }
        });

        // Mood
        const moodGroup = form.createDiv({ cls: 'sec-form-group' });
        moodGroup.createEl('label', { cls: 'sec-form-label', text: '💭 How are you feeling?' });
        const moodContainer = moodGroup.createDiv({ cls: 'sec-mood-picker' });
        
        const moods = [
            { value: 'grateful', emoji: '🙏', label: 'Grateful' },
            { value: 'joyful', emoji: '😊', label: 'Joyful' },
            { value: 'peaceful', emoji: '😌', label: 'Peaceful' },
            { value: 'hopeful', emoji: '🌟', label: 'Hopeful' },
            { value: 'blessed', emoji: '✨', label: 'Blessed' },
            { value: 'struggling', emoji: '😔', label: 'Struggling' },
        ];
        
        let selectedMood: JournalEntry['mood'] | undefined;
        
        moods.forEach(mood => {
            const moodBtn = moodContainer.createEl('button', { cls: 'sec-mood-btn' });
            moodBtn.createSpan({ text: mood.emoji });
            moodBtn.setAttribute('title', mood.label);
            
            moodBtn.addEventListener('click', (e) => {
                e.preventDefault();
                moodContainer.querySelectorAll('.sec-mood-btn').forEach(b => b.removeClass('selected'));
                moodBtn.addClass('selected');
                selectedMood = mood.value as JournalEntry['mood'];
            });
        });

        // Tags
        const tagsGroup = form.createDiv({ cls: 'sec-form-group' });
        tagsGroup.createEl('label', { cls: 'sec-form-label', text: '🏷️ Tags (optional)' });
        const tagsInput = tagsGroup.createEl('input', { 
            cls: 'sec-form-input',
            attr: { type: 'text', placeholder: 'faith, growth, answered prayer (comma separated)' }
        });

        // Submit button
        const submitBtn = form.createEl('button', { cls: 'sec-btn sec-btn-primary sec-btn-block' });
        submitBtn.textContent = '💾 Save Entry';
        submitBtn.addEventListener('click', async () => {
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();
            const type = typeSelect.value as JournalEntry['type'];
            const scripture = scriptureInput.value.trim();
            const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);

            if (!title || !content) {
                new Notice('Please enter a title and content');
                return;
            }

            const now = new Date();
            const entry: JournalEntry = {
                id: Date.now().toString(),
                date: now.toISOString(),
                title,
                content,
                type,
                scripture,
                tags,
                mood: selectedMood,
            };

            // Create note file if enabled
            if (this.plugin.settings.createNotes) {
                try {
                    await this.plugin.createJournalNote(entry);
                    new Notice(`📝 Journal entry saved to ${this.plugin.settings.journalFolder}`);
                } catch (error) {
                    console.error('Failed to create journal note:', error);
                    new Notice('⚠️ Entry saved to plugin data (note creation failed)');
                }
            }

            this.plugin.data.journalEntries.unshift(entry);
            await this.plugin.savePluginData();
            
            this.journalSection = 'overview';
            this.render();
        });

        // Previous Entries List
        if (this.plugin.data.journalEntries.length > 0) {
            const entriesHeader = parent.createDiv({ cls: 'sec-subsection-header' });
            entriesHeader.style.marginTop = '24px';
            entriesHeader.createEl('h3', { cls: 'sec-subsection-title', text: 'All Entries' });

            const entriesList = parent.createDiv({ cls: 'sec-entries-list' });
            
            this.plugin.data.journalEntries.forEach((entry, index) => {
                const item = entriesList.createDiv({ cls: `sec-entry-item sec-animate-slide-up sec-stagger-${Math.min(index + 1, 5)}` });
                
                item.createSpan({ cls: 'sec-entry-type-icon', text: this.getEntryTypeIcon(entry.type) });
                
                const content = item.createDiv({ cls: 'sec-entry-item-content' });
                content.createEl('h4', { cls: 'sec-entry-item-title', text: entry.title });
                content.createEl('p', { cls: 'sec-entry-item-preview', text: entry.content.substring(0, 80) + (entry.content.length > 80 ? '...' : '') });
                
                const meta = content.createDiv({ cls: 'sec-entry-item-meta' });
                const date = new Date(entry.date);
                meta.createSpan({ text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
                if (entry.mood) {
                    meta.createSpan({ cls: 'sec-mood-tag', text: this.getMoodEmoji(entry.mood) });
                }

                // Delete button
                const deleteBtn = item.createEl('button', { cls: 'sec-entry-delete' });
                deleteBtn.textContent = '🗑️';
                deleteBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    this.plugin.data.journalEntries = this.plugin.data.journalEntries.filter(e => e.id !== entry.id);
                    await this.plugin.saveData(this.plugin.data);
                    this.render();
                });
            });
        }
    }

    private renderPrayerRequests(parent: HTMLElement): void {
        const header = parent.createDiv({ cls: 'sec-subsection-header' });
        header.createEl('h3', { cls: 'sec-subsection-title', text: 'Prayer Requests' });
        header.createEl('p', { cls: 'sec-subsection-subtitle', text: 'Track your prayers and God\'s answers' });

        // Add New Prayer Form
        const form = parent.createDiv({ cls: 'sec-prayer-form sec-animate-in' });
        
        const requestGroup = form.createDiv({ cls: 'sec-form-group' });
        requestGroup.createEl('label', { cls: 'sec-form-label', text: '🙏 New Prayer Request' });
        const requestInput = requestGroup.createEl('textarea', { 
            cls: 'sec-form-textarea',
            attr: { placeholder: 'What do you need prayer for?', rows: '2' }
        });

        const personGroup = form.createDiv({ cls: 'sec-form-group' });
        personGroup.createEl('label', { cls: 'sec-form-label', text: '👤 For whom? (optional)' });
        const personInput = personGroup.createEl('input', { 
            cls: 'sec-form-input',
            attr: { type: 'text', placeholder: 'Name or "myself"' }
        });

        const addBtn = form.createEl('button', { cls: 'sec-btn sec-btn-primary sec-btn-block' });
        addBtn.textContent = '➕ Add Prayer Request';
        addBtn.addEventListener('click', async () => {
            const request = requestInput.value.trim();
            if (!request) {
                new Notice('Please enter a prayer request');
                return;
            }

            const prayerRequest: PrayerRequest = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                request,
                person: personInput.value.trim() || undefined,
                status: 'active',
            };

            // Create note file if enabled
            if (this.plugin.settings.createNotes) {
                try {
                    await this.plugin.createPrayerNote(prayerRequest);
                    new Notice(`🙏 Prayer request saved to ${this.plugin.settings.prayerFolder}`);
                } catch (error) {
                    console.error('Failed to create prayer note:', error);
                    new Notice('⚠️ Prayer saved to plugin data (note creation failed)');
                }
            }

            this.plugin.data.prayerRequests.unshift(prayerRequest);
            await this.plugin.savePluginData();
            this.render();
        });

        // Prayer Lists by Status
        const statuses = [
            { key: 'active', label: '🙏 Active Prayers', color: 'var(--sec-gold)' },
            { key: 'answered', label: '✅ Answered Prayers', color: 'var(--sec-hope)' },
            { key: 'ongoing', label: '🔄 Ongoing', color: 'var(--sec-spirit)' },
        ] as const;

        statuses.forEach((status, statusIndex) => {
            const prayers = this.plugin.data.prayerRequests.filter(p => p.status === status.key);
            if (prayers.length === 0 && status.key !== 'active') return;

            const section = parent.createDiv({ cls: 'sec-prayer-section sec-animate-in' });
            section.style.animationDelay = `${0.1 * (statusIndex + 1)}s`;
            
            const sectionHeader = section.createDiv({ cls: 'sec-prayer-section-header' });
            sectionHeader.createEl('h4', { text: `${status.label} (${prayers.length})` });

            if (prayers.length === 0) {
                section.createEl('p', { cls: 'sec-empty-message', text: 'No prayer requests yet. Add one above!' });
                return;
            }

            prayers.forEach((prayer, index) => {
                const item = section.createDiv({ cls: `sec-prayer-item ${prayer.status}` });
                
                const content = item.createDiv({ cls: 'sec-prayer-item-content' });
                content.createEl('p', { cls: 'sec-prayer-item-text', text: prayer.request });
                
                const meta = content.createDiv({ cls: 'sec-prayer-item-meta' });
                if (prayer.person) {
                    meta.createSpan({ text: `For: ${prayer.person}` });
                }
                const date = new Date(prayer.date);
                meta.createSpan({ text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });

                // Actions
                const actions = item.createDiv({ cls: 'sec-prayer-actions' });
                
                if (prayer.status === 'active') {
                    const answeredBtn = actions.createEl('button', { cls: 'sec-prayer-action-btn answered' });
                    answeredBtn.textContent = '✓';
                    answeredBtn.setAttribute('title', 'Mark Answered');
                    answeredBtn.addEventListener('click', async () => {
                        prayer.status = 'answered';
                        prayer.answeredDate = new Date().toISOString();
                        await this.plugin.saveData(this.plugin.data);
                        this.render();
                    });

                    const ongoingBtn = actions.createEl('button', { cls: 'sec-prayer-action-btn ongoing' });
                    ongoingBtn.textContent = '🔄';
                    ongoingBtn.setAttribute('title', 'Mark Ongoing');
                    ongoingBtn.addEventListener('click', async () => {
                        prayer.status = 'ongoing';
                        await this.plugin.saveData(this.plugin.data);
                        this.render();
                    });
                }

                const deleteBtn = actions.createEl('button', { cls: 'sec-prayer-action-btn delete' });
                deleteBtn.textContent = '🗑️';
                deleteBtn.addEventListener('click', async () => {
                    this.plugin.data.prayerRequests = this.plugin.data.prayerRequests.filter(p => p.id !== prayer.id);
                    await this.plugin.saveData(this.plugin.data);
                    this.render();
                });
            });
        });
    }

    private renderTestimonies(parent: HTMLElement): void {
        const header = parent.createDiv({ cls: 'sec-subsection-header' });
        header.createEl('h3', { cls: 'sec-subsection-title', text: 'Testimonies' });
        header.createEl('p', { cls: 'sec-subsection-subtitle', text: 'Never forget what God has done' });

        // Add New Testimony Form
        const form = parent.createDiv({ cls: 'sec-testimony-form sec-animate-in' });
        
        const titleGroup = form.createDiv({ cls: 'sec-form-group' });
        titleGroup.createEl('label', { cls: 'sec-form-label', text: '✨ Testimony Title' });
        const titleInput = titleGroup.createEl('input', { 
            cls: 'sec-form-input',
            attr: { type: 'text', placeholder: 'e.g., God healed my body' }
        });

        const storyGroup = form.createDiv({ cls: 'sec-form-group' });
        storyGroup.createEl('label', { cls: 'sec-form-label', text: '📖 Your Story' });
        const storyInput = storyGroup.createEl('textarea', { 
            cls: 'sec-form-textarea sec-journal-textarea',
            attr: { placeholder: 'Share what God has done...', rows: '5' }
        });

        const scriptureGroup = form.createDiv({ cls: 'sec-form-group' });
        scriptureGroup.createEl('label', { cls: 'sec-form-label', text: '📜 Related Scripture (optional)' });
        const scriptureInput = scriptureGroup.createEl('input', { 
            cls: 'sec-form-input',
            attr: { type: 'text', placeholder: 'e.g., Psalm 107:2' }
        });

        const addBtn = form.createEl('button', { cls: 'sec-btn sec-btn-primary sec-btn-block' });
        addBtn.textContent = '✨ Save Testimony';
        addBtn.addEventListener('click', async () => {
            const title = titleInput.value.trim();
            const story = storyInput.value.trim();
            if (!title || !story) {
                new Notice('Please enter a title and story');
                return;
            }

            const testimony: Testimony = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                title,
                story,
                scripture: scriptureInput.value.trim() || undefined,
                tags: [],
            };

            // Create note file if enabled
            if (this.plugin.settings.createNotes) {
                try {
                    await this.plugin.createTestimonyNote(testimony);
                    new Notice(`✨ Testimony saved to ${this.plugin.settings.testimonyFolder}`);
                } catch (error) {
                    console.error('Failed to create testimony note:', error);
                    new Notice('⚠️ Testimony saved to plugin data (note creation failed)');
                }
            }

            this.plugin.data.testimonies.unshift(testimony);
            await this.plugin.savePluginData();
            this.render();
        });

        // Testimonies List
        if (this.plugin.data.testimonies.length > 0) {
            const listHeader = parent.createDiv({ cls: 'sec-subsection-header' });
            listHeader.style.marginTop = '24px';
            listHeader.createEl('h3', { cls: 'sec-subsection-title', text: 'Your Testimonies' });

            const list = parent.createDiv({ cls: 'sec-testimonies-list' });
            
            this.plugin.data.testimonies.forEach((testimony, index) => {
                const item = list.createDiv({ cls: `sec-testimony-item sec-animate-slide-up sec-stagger-${Math.min(index + 1, 5)}` });
                
                const itemHeader = item.createDiv({ cls: 'sec-testimony-item-header' });
                itemHeader.createSpan({ cls: 'sec-testimony-icon', text: '✨' });
                itemHeader.createEl('h4', { cls: 'sec-testimony-title', text: testimony.title });
                
                const date = new Date(testimony.date);
                itemHeader.createSpan({ cls: 'sec-testimony-date', text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });

                item.createEl('p', { cls: 'sec-testimony-story', text: testimony.story });
                
                if (testimony.scripture) {
                    const scriptureTag = item.createDiv({ cls: 'sec-testimony-scripture' });
                    scriptureTag.createSpan({ cls: 'sec-scripture-tag', text: `📖 ${testimony.scripture}` });
                }

                const deleteBtn = item.createEl('button', { cls: 'sec-testimony-delete' });
                deleteBtn.textContent = '🗑️';
                deleteBtn.addEventListener('click', async () => {
                    this.plugin.data.testimonies = this.plugin.data.testimonies.filter(t => t.id !== testimony.id);
                    await this.plugin.saveData(this.plugin.data);
                    this.render();
                });
            });
        } else {
            const empty = parent.createDiv({ cls: 'sec-empty-state sec-animate-in' });
            empty.createDiv({ cls: 'sec-empty-icon', text: '✨' });
            empty.createEl('h4', { cls: 'sec-empty-title', text: 'No testimonies yet' });
            empty.createEl('p', { cls: 'sec-empty-desc', text: 'Start recording God\'s faithfulness in your life!' });
        }
    }

    private renderScriptureMemory(parent: HTMLElement): void {
        const header = parent.createDiv({ cls: 'sec-subsection-header' });
        header.createEl('h3', { cls: 'sec-subsection-title', text: 'Scripture Memory' });
        header.createEl('p', { cls: 'sec-subsection-subtitle', text: 'Hide God\'s Word in your heart' });

        // Add New Scripture Form
        const form = parent.createDiv({ cls: 'sec-memory-form sec-animate-in' });
        
        const refGroup = form.createDiv({ cls: 'sec-form-group' });
        refGroup.createEl('label', { cls: 'sec-form-label', text: '📖 Scripture Reference' });
        const refInput = refGroup.createEl('input', { 
            cls: 'sec-form-input',
            attr: { type: 'text', placeholder: 'e.g., Acts 2:38' }
        });

        const textGroup = form.createDiv({ cls: 'sec-form-group' });
        textGroup.createEl('label', { cls: 'sec-form-label', text: '📜 Scripture Text' });
        const textInput = textGroup.createEl('textarea', { 
            cls: 'sec-form-textarea',
            attr: { placeholder: 'Type or paste the scripture...', rows: '3' }
        });

        const addBtn = form.createEl('button', { cls: 'sec-btn sec-btn-primary sec-btn-block' });
        addBtn.textContent = '➕ Add to Memory List';
        addBtn.addEventListener('click', async () => {
            const reference = refInput.value.trim();
            const text = textInput.value.trim();
            if (!reference || !text) return;

            const scripture: ScriptureMemory = {
                id: Date.now().toString(),
                reference,
                text,
                dateAdded: new Date().toISOString(),
                memorized: false,
            };

            this.plugin.data.scriptureMemory.unshift(scripture);
            await this.plugin.saveData(this.plugin.data);
            this.render();
        });

        // Scripture Memory List
        if (this.plugin.data.scriptureMemory.length > 0) {
            // To Memorize
            const toMemorize = this.plugin.data.scriptureMemory.filter(s => !s.memorized);
            const memorized = this.plugin.data.scriptureMemory.filter(s => s.memorized);

            if (toMemorize.length > 0) {
                const toMemorizeSection = parent.createDiv({ cls: 'sec-memory-section sec-animate-in' });
                toMemorizeSection.style.animationDelay = '0.1s';
                
                toMemorizeSection.createEl('h4', { cls: 'sec-memory-section-title', text: `📝 To Memorize (${toMemorize.length})` });

                toMemorize.forEach((scripture, index) => {
                    const item = toMemorizeSection.createDiv({ cls: `sec-memory-item sec-animate-slide-up sec-stagger-${Math.min(index + 1, 5)}` });
                    
                    const itemHeader = item.createDiv({ cls: 'sec-memory-item-header' });
                    itemHeader.createSpan({ cls: 'sec-memory-reference', text: scripture.reference });
                    
                    item.createEl('p', { cls: 'sec-memory-text', text: scripture.text });
                    
                    const actions = item.createDiv({ cls: 'sec-memory-actions' });
                    
                    const memorizedBtn = actions.createEl('button', { cls: 'sec-btn sec-btn-sm sec-btn-primary' });
                    memorizedBtn.textContent = '✓ Memorized!';
                    memorizedBtn.addEventListener('click', async () => {
                        scripture.memorized = true;
                        scripture.lastReviewed = new Date().toISOString();
                        await this.plugin.saveData(this.plugin.data);
                        this.render();
                    });

                    const deleteBtn = actions.createEl('button', { cls: 'sec-memory-delete' });
                    deleteBtn.textContent = '🗑️';
                    deleteBtn.addEventListener('click', async () => {
                        this.plugin.data.scriptureMemory = this.plugin.data.scriptureMemory.filter(s => s.id !== scripture.id);
                        await this.plugin.saveData(this.plugin.data);
                        this.render();
                    });
                });
            }

            if (memorized.length > 0) {
                const memorizedSection = parent.createDiv({ cls: 'sec-memory-section sec-animate-in' });
                memorizedSection.style.animationDelay = '0.2s';
                
                memorizedSection.createEl('h4', { cls: 'sec-memory-section-title sec-memorized', text: `✅ Memorized (${memorized.length})` });

                memorized.forEach((scripture, index) => {
                    const item = memorizedSection.createDiv({ cls: `sec-memory-item memorized sec-animate-slide-up sec-stagger-${Math.min(index + 1, 5)}` });
                    
                    const itemHeader = item.createDiv({ cls: 'sec-memory-item-header' });
                    itemHeader.createSpan({ cls: 'sec-memory-reference', text: scripture.reference });
                    itemHeader.createSpan({ cls: 'sec-memory-badge', text: '✓' });
                    
                    item.createEl('p', { cls: 'sec-memory-text', text: scripture.text });
                });
            }
        } else {
            const empty = parent.createDiv({ cls: 'sec-empty-state sec-animate-in' });
            empty.createDiv({ cls: 'sec-empty-icon', text: '📖' });
            empty.createEl('h4', { cls: 'sec-empty-title', text: 'No scriptures yet' });
            empty.createEl('p', { cls: 'sec-empty-desc', text: 'Add scriptures to memorize and hide God\'s Word in your heart!' });
        }
    }

    private getEntryTypeIcon(type: JournalEntry['type']): string {
        const icons: Record<JournalEntry['type'], string> = {
            devotion: '📖',
            reflection: '💭',
            testimony: '✨',
            prayer: '🙏',
            note: '📝',
        };
        return icons[type] || '📝';
    }

    private getMoodEmoji(mood: NonNullable<JournalEntry['mood']>): string {
        const moods: Record<NonNullable<JournalEntry['mood']>, string> = {
            grateful: '🙏',
            joyful: '😊',
            peaceful: '😌',
            hopeful: '🌟',
            blessed: '✨',
            struggling: '😔',
        };
        return moods[mood] || '💭';
    }

    // ============================================
    // FOOTER
    // ============================================
    private renderFooter(parent: HTMLElement): void {
        const footer = parent.createDiv({ cls: 'sec-footer' });
        const text = footer.createDiv({ cls: 'sec-footer-text' });
        text.innerHTML = '🔥 <a href="https://www.billaking.com" target="_blank">Greater Life Ministry</a>';
    }
}

// ============================================
// SETTINGS TAB
// ============================================
class StreetEvangelistSettingTab extends PluginSettingTab {
    plugin: StreetEvangelistPlugin;

    constructor(app: App, plugin: StreetEvangelistPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Street Evangelist Companion' });
        containerEl.createEl('p', { text: 'Configure your ministry companion settings.' });

        new Setting(containerEl)
            .setName('Minister Name')
            .setDesc('Your name or title for personalized greetings')
            .addText((text) =>
                text
                    .setPlaceholder('Minister')
                    .setValue(this.plugin.settings.ministerName)
                    .onChange(async (value) => {
                        this.plugin.settings.ministerName = value || 'Minister';
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Church/Ministry Name')
            .setDesc('Your church or ministry affiliation')
            .addText((text) =>
                text
                    .setPlaceholder('Enter church name')
                    .setValue(this.plugin.settings.churchName)
                    .onChange(async (value) => {
                        this.plugin.settings.churchName = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Default Tab')
            .setDesc('Which tab to show when opening the plugin')
            .addDropdown((dropdown) =>
                dropdown
                    .addOptions({
                        overview: 'Home',
                        timeline: 'Timeline',
                        ministry: 'Ministry',
                        doctrine: 'Doctrine',
                        journal: 'Journal',
                    })
                    .setValue(this.plugin.settings.defaultTab)
                    .onChange(async (value) => {
                        this.plugin.settings.defaultTab = value as TabId;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Show Daily Scripture')
            .setDesc('Display a scripture verse on the home screen')
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.showDailyScripture).onChange(async (value) => {
                    this.plugin.settings.showDailyScripture = value;
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName('Track Encounters')
            .setDesc('Enable encounter tracking and statistics')
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.trackEncounters).onChange(async (value) => {
                    this.plugin.settings.trackEncounters = value;
                    await this.plugin.saveSettings();
                })
            );

        // Note Creation Settings
        containerEl.createEl('hr');
        containerEl.createEl('h3', { text: '📝 Note Creation Settings' });
        containerEl.createEl('p', { 
            text: 'Create actual Obsidian notes with YAML frontmatter for your journal entries, prayers, and testimonies.',
            cls: 'setting-item-description'
        });

        new Setting(containerEl)
            .setName('Create Notes')
            .setDesc('Save entries as Obsidian notes (enables two-way sync)')
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.createNotes).onChange(async (value) => {
                    this.plugin.settings.createNotes = value;
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName('Journal Folder')
            .setDesc('Where to save journal entries')
            .addText((text) =>
                text
                    .setPlaceholder('Street Ministry/Journal')
                    .setValue(this.plugin.settings.journalFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.journalFolder = value || 'Street Ministry/Journal';
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Prayer Folder')
            .setDesc('Where to save prayer requests')
            .addText((text) =>
                text
                    .setPlaceholder('Street Ministry/Prayers')
                    .setValue(this.plugin.settings.prayerFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.prayerFolder = value || 'Street Ministry/Prayers';
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Testimony Folder')
            .setDesc('Where to save testimonies')
            .addText((text) =>
                text
                    .setPlaceholder('Street Ministry/Testimonies')
                    .setValue(this.plugin.settings.testimonyFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.testimonyFolder = value || 'Street Ministry/Testimonies';
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Sync Notes Now')
            .setDesc('Manually sync notes from folders back into the plugin')
            .addButton((button) =>
                button
                    .setButtonText('🔄 Sync Notes')
                    .setCta()
                    .onClick(async () => {
                        await this.plugin.syncAllNotes();
                        new Notice('✅ Notes synced successfully!');
                    })
            );

        // Donation Settings
        containerEl.createEl('hr');
        containerEl.createEl('h3', { text: '💝 Support This Ministry' });
        containerEl.createEl('p', { 
            text: 'Your generous donations help us continue developing tools for the Kingdom.',
            cls: 'setting-item-description'
        });

        const activeMethods = getActiveDonationMethods();
        const donationOptions: Record<string, string> = {};
        activeMethods.forEach(method => {
            donationOptions[method.id] = `${method.icon} ${method.name}`;
        });

        // Create donate container first so we can reference it in the dropdown
        const donateContainer = containerEl.createDiv({ cls: 'sec-donate-container' });
        
        // Helper function to update donate container without re-rendering whole page
        const updateDonateContainer = () => {
            donateContainer.empty();
            const selectedMethod = activeMethods.find(m => m.id === this.plugin.settings.selectedDonationMethod);
            if (selectedMethod) {
                donateContainer.style.cssText = `
                    margin-top: 12px;
                    padding: 16px;
                    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    border-radius: 12px;
                    text-align: center;
                `;

                if (selectedMethod.description) {
                    const desc = donateContainer.createEl('p', { 
                        text: selectedMethod.description,
                        cls: 'setting-item-description'
                    });
                    desc.style.cssText = 'margin-bottom: 12px; color: var(--text-muted);';
                }

                if (selectedMethod.url) {
                    const donateBtn = donateContainer.createEl('button', {
                        text: `${selectedMethod.icon} Donate via ${selectedMethod.name}`,
                        cls: 'mod-cta'
                    });
                    donateBtn.style.cssText = `
                        padding: 12px 24px;
                        font-size: 16px;
                        cursor: pointer;
                        border-radius: 8px;
                    `;
                    donateBtn.addEventListener('click', () => {
                        window.open(selectedMethod.url, '_blank');
                    });
                } else {
                    // For methods without URLs (like Zelle), just show the info
                    const infoText = donateContainer.createEl('p', {
                        text: `Use the ${selectedMethod.name} app to send your donation.`
                    });
                    infoText.style.cssText = 'font-weight: 600; color: var(--text-normal);';
                }
            }
        };

        new Setting(containerEl)
            .setName('Donation Method')
            .setDesc('Select your preferred way to support this ministry')
            .addDropdown((dropdown) =>
                dropdown
                    .addOptions(donationOptions)
                    .setValue(this.plugin.settings.selectedDonationMethod)
                    .onChange(async (value) => {
                        this.plugin.settings.selectedDonationMethod = value;
                        await this.plugin.saveSettings();
                        // Update only the donate container, not the whole page
                        updateDonateContainer();
                    })
            );

        // Initial render of donate container
        updateDonateContainer();

        containerEl.createEl('hr');
        containerEl.createEl('p', { 
            text: 'Greater Life Ministry — Spreading the Gospel one encounter at a time.',
            cls: 'setting-item-description'
        });
    }
}

// ============================================
// MAIN PLUGIN CLASS
// ============================================
export default class StreetEvangelistPlugin extends Plugin {
    settings: StreetEvangelistSettings = DEFAULT_SETTINGS;
    data: PluginData = DEFAULT_DATA;

    async onload(): Promise<void> {
        console.log('Loading Street Evangelist Companion');

        await this.loadSettings();
        await this.loadPluginData();

        // Register the custom view
        this.registerView(VIEW_TYPE, (leaf) => new StreetEvangelistView(leaf, this));

        // Add ribbon icon
        this.addRibbonIcon('flame', 'Street Evangelist', () => {
            this.activateView();
        });

        // Add command to open view
        this.addCommand({
            id: 'open-street-evangelist',
            name: 'Open Street Evangelist Companion',
            callback: () => this.activateView(),
        });

        // Add command to sync notes
        this.addCommand({
            id: 'sync-ministry-notes',
            name: 'Sync Ministry Notes',
            callback: () => this.syncAllNotes(),
        });

        // Add settings tab
        this.addSettingTab(new StreetEvangelistSettingTab(this.app, this));

        // Auto-sync notes on load if note creation is enabled
        if (this.settings.createNotes) {
            // Delay sync to allow vault to fully load
            setTimeout(() => this.syncAllNotes(), 2000);
        }
    }

    async onunload(): Promise<void> {
        console.log('Unloading Street Evangelist Companion');
    }

    async loadSettings(): Promise<void> {
        const loaded = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded?.settings || {});
    }

    async saveSettings(): Promise<void> {
        await this.savePluginData();
    }

    async loadPluginData(): Promise<void> {
        const loaded = await this.loadData();
        this.data = Object.assign({}, DEFAULT_DATA, loaded?.data || {});
    }

    async savePluginData(): Promise<void> {
        await this.saveData({
            settings: this.settings,
            data: this.data,
        });
    }

    async activateView(): Promise<void> {
        const { workspace } = this.app;

        let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];

        if (!leaf) {
            const newLeaf = workspace.getRightLeaf(false);
            if (newLeaf) {
                await newLeaf.setViewState({ type: VIEW_TYPE, active: true });
                leaf = newLeaf;
            }
        }

        if (leaf) {
            workspace.revealLeaf(leaf);
        }
    }

    // ============================================
    // NOTE CREATION METHODS
    // ============================================

    /**
     * Ensure a folder exists, create it if not
     */
    async ensureFolderExists(folderPath: string): Promise<void> {
        const normalizedPath = normalizePath(folderPath);
        const folder = this.app.vault.getAbstractFileByPath(normalizedPath);
        
        if (!folder) {
            await this.app.vault.createFolder(normalizedPath);
        }
    }

    /**
     * Create a journal note with frontmatter
     */
    async createJournalNote(entry: JournalEntry): Promise<TFile> {
        await this.ensureFolderExists(this.settings.journalFolder);
        
        const date = new Date(entry.date);
        const dateStr = formatDateForFilename(date);
        const safeTitle = sanitizeFilename(entry.title);
        const filename = `${dateStr} - ${safeTitle}.md`;
        const filePath = normalizePath(`${this.settings.journalFolder}/${filename}`);
        
        // Check if file already exists
        const existing = this.app.vault.getAbstractFileByPath(filePath);
        if (existing instanceof TFile) {
            // Update existing file
            const frontmatter = generateFrontmatter({
                id: entry.id,
                type: entry.type,
                date: entry.date,
                mood: entry.mood,
                scripture: entry.scripture,
                tags: entry.tags,
                plugin: 'street-evangelist-companion',
            });
            
            const noteContent = `${frontmatter}# ${entry.title}\n\n${entry.content}`;
            await this.app.vault.modify(existing, noteContent);
            return existing;
        }
        
        // Create new file
        const frontmatter = generateFrontmatter({
            id: entry.id,
            type: entry.type,
            date: entry.date,
            mood: entry.mood,
            scripture: entry.scripture,
            tags: entry.tags,
            plugin: 'street-evangelist-companion',
        });
        
        const noteContent = `${frontmatter}# ${entry.title}\n\n${entry.content}`;
        
        return await this.app.vault.create(filePath, noteContent);
    }

    /**
     * Create a prayer request note with frontmatter
     */
    async createPrayerNote(prayer: PrayerRequest): Promise<TFile> {
        await this.ensureFolderExists(this.settings.prayerFolder);
        
        const date = new Date(prayer.date);
        const dateStr = formatDateForFilename(date);
        const safeRequest = sanitizeFilename(prayer.request.substring(0, 50));
        const filename = `${dateStr} - ${safeRequest}.md`;
        const filePath = normalizePath(`${this.settings.prayerFolder}/${filename}`);
        
        // Check if file already exists
        const existing = this.app.vault.getAbstractFileByPath(filePath);
        if (existing instanceof TFile) {
            const frontmatter = generateFrontmatter({
                id: prayer.id,
                type: 'prayer-request',
                date: prayer.date,
                person: prayer.person,
                status: prayer.status,
                answeredDate: prayer.answeredDate,
                plugin: 'street-evangelist-companion',
            });
            
            const noteContent = `${frontmatter}# 🙏 Prayer Request\n\n${prayer.request}${prayer.notes ? `\n\n## Notes\n\n${prayer.notes}` : ''}`;
            await this.app.vault.modify(existing, noteContent);
            return existing;
        }
        
        const frontmatter = generateFrontmatter({
            id: prayer.id,
            type: 'prayer-request',
            date: prayer.date,
            person: prayer.person,
            status: prayer.status,
            answeredDate: prayer.answeredDate,
            plugin: 'street-evangelist-companion',
        });
        
        const noteContent = `${frontmatter}# 🙏 Prayer Request\n\n${prayer.request}${prayer.notes ? `\n\n## Notes\n\n${prayer.notes}` : ''}`;
        
        return await this.app.vault.create(filePath, noteContent);
    }

    /**
     * Create a testimony note with frontmatter
     */
    async createTestimonyNote(testimony: Testimony): Promise<TFile> {
        await this.ensureFolderExists(this.settings.testimonyFolder);
        
        const date = new Date(testimony.date);
        const dateStr = formatDateForFilename(date);
        const safeTitle = sanitizeFilename(testimony.title);
        const filename = `${dateStr} - ${safeTitle}.md`;
        const filePath = normalizePath(`${this.settings.testimonyFolder}/${filename}`);
        
        // Check if file already exists
        const existing = this.app.vault.getAbstractFileByPath(filePath);
        if (existing instanceof TFile) {
            const frontmatter = generateFrontmatter({
                id: testimony.id,
                type: 'testimony',
                date: testimony.date,
                scripture: testimony.scripture,
                tags: testimony.tags,
                plugin: 'street-evangelist-companion',
            });
            
            const noteContent = `${frontmatter}# ✨ ${testimony.title}\n\n${testimony.story}${testimony.scripture ? `\n\n> 📖 **Scripture:** ${testimony.scripture}` : ''}`;
            await this.app.vault.modify(existing, noteContent);
            return existing;
        }
        
        const frontmatter = generateFrontmatter({
            id: testimony.id,
            type: 'testimony',
            date: testimony.date,
            scripture: testimony.scripture,
            tags: testimony.tags,
            plugin: 'street-evangelist-companion',
        });
        
        const noteContent = `${frontmatter}# ✨ ${testimony.title}\n\n${testimony.story}${testimony.scripture ? `\n\n> 📖 **Scripture:** ${testimony.scripture}` : ''}`;
        
        return await this.app.vault.create(filePath, noteContent);
    }

    // ============================================
    // SYNC METHODS - Read notes back into plugin
    // ============================================

    /**
     * Sync all notes from folders back into plugin data
     */
    async syncAllNotes(): Promise<void> {
        if (!this.settings.createNotes) return;
        
        console.log('Street Evangelist: Syncing notes...');
        
        try {
            await this.syncJournalNotes();
            await this.syncPrayerNotes();
            await this.syncTestimonyNotes();
            await this.savePluginData();
            
            // Refresh the view
            const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
            for (const leaf of leaves) {
                const view = leaf.view as StreetEvangelistView;
                if (view && typeof view.render === 'function') {
                    (view as any).render();
                }
            }
            
            console.log('Street Evangelist: Notes synced successfully');
        } catch (error) {
            console.error('Street Evangelist: Error syncing notes:', error);
        }
    }

    /**
     * Sync journal notes from folder
     */
    async syncJournalNotes(): Promise<void> {
        const folder = this.app.vault.getAbstractFileByPath(normalizePath(this.settings.journalFolder));
        if (!(folder instanceof TFolder)) return;
        
        const files = folder.children.filter(f => f instanceof TFile && f.extension === 'md') as TFile[];
        
        for (const file of files) {
            try {
                const content = await this.app.vault.read(file);
                const { frontmatter, body } = parseFrontmatter(content);
                
                // Only process files created by this plugin
                if (frontmatter.plugin !== 'street-evangelist-companion') continue;
                if (!frontmatter.id) continue;
                
                // Find existing entry or create tracking
                const existingIndex = this.data.journalEntries.findIndex(e => e.id === frontmatter.id);
                
                // Extract title from markdown (remove # prefix)
                const titleMatch = body.match(/^#\s+(.+)/m);
                const title = titleMatch ? titleMatch[1] : file.basename;
                
                // Extract content (everything after the first heading)
                const contentMatch = body.replace(/^#\s+.+\n+/, '').trim();
                
                const entry: JournalEntry = {
                    id: frontmatter.id,
                    date: frontmatter.date || file.stat.ctime.toString(),
                    title: title,
                    content: contentMatch,
                    type: frontmatter.type || 'note',
                    scripture: frontmatter.scripture || '',
                    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
                    mood: frontmatter.mood,
                };
                
                if (existingIndex >= 0) {
                    this.data.journalEntries[existingIndex] = entry;
                } else {
                    this.data.journalEntries.push(entry);
                }
            } catch (error) {
                console.error(`Error reading journal note ${file.path}:`, error);
            }
        }
        
        // Sort by date descending
        this.data.journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    /**
     * Sync prayer notes from folder
     */
    async syncPrayerNotes(): Promise<void> {
        const folder = this.app.vault.getAbstractFileByPath(normalizePath(this.settings.prayerFolder));
        if (!(folder instanceof TFolder)) return;
        
        const files = folder.children.filter(f => f instanceof TFile && f.extension === 'md') as TFile[];
        
        for (const file of files) {
            try {
                const content = await this.app.vault.read(file);
                const { frontmatter, body } = parseFrontmatter(content);
                
                if (frontmatter.plugin !== 'street-evangelist-companion') continue;
                if (frontmatter.type !== 'prayer-request') continue;
                if (!frontmatter.id) continue;
                
                const existingIndex = this.data.prayerRequests.findIndex(p => p.id === frontmatter.id);
                
                // Extract request (content after heading)
                const requestMatch = body.replace(/^#[^#]+\n+/, '').split(/\n## Notes/)[0].trim();
                const notesMatch = body.match(/## Notes\n+([\s\S]*)/);
                
                const prayer: PrayerRequest = {
                    id: frontmatter.id,
                    date: frontmatter.date || file.stat.ctime.toString(),
                    request: requestMatch,
                    person: frontmatter.person,
                    status: frontmatter.status || 'active',
                    answeredDate: frontmatter.answeredDate,
                    notes: notesMatch ? notesMatch[1].trim() : undefined,
                };
                
                if (existingIndex >= 0) {
                    this.data.prayerRequests[existingIndex] = prayer;
                } else {
                    this.data.prayerRequests.push(prayer);
                }
            } catch (error) {
                console.error(`Error reading prayer note ${file.path}:`, error);
            }
        }
        
        this.data.prayerRequests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    /**
     * Sync testimony notes from folder
     */
    async syncTestimonyNotes(): Promise<void> {
        const folder = this.app.vault.getAbstractFileByPath(normalizePath(this.settings.testimonyFolder));
        if (!(folder instanceof TFolder)) return;
        
        const files = folder.children.filter(f => f instanceof TFile && f.extension === 'md') as TFile[];
        
        for (const file of files) {
            try {
                const content = await this.app.vault.read(file);
                const { frontmatter, body } = parseFrontmatter(content);
                
                if (frontmatter.plugin !== 'street-evangelist-companion') continue;
                if (frontmatter.type !== 'testimony') continue;
                if (!frontmatter.id) continue;
                
                const existingIndex = this.data.testimonies.findIndex(t => t.id === frontmatter.id);
                
                // Extract title from markdown
                const titleMatch = body.match(/^#\s+✨?\s*(.+)/m);
                const title = titleMatch ? titleMatch[1] : file.basename;
                
                // Extract story (content after heading, before scripture)
                let story = body.replace(/^#[^#]+\n+/, '');
                const scriptureQuoteMatch = story.match(/\n>\s*📖\s*\*\*Scripture:\*\*\s*.+$/m);
                if (scriptureQuoteMatch) {
                    story = story.replace(scriptureQuoteMatch[0], '').trim();
                }
                
                const testimony: Testimony = {
                    id: frontmatter.id,
                    date: frontmatter.date || file.stat.ctime.toString(),
                    title: title,
                    story: story,
                    scripture: frontmatter.scripture,
                    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
                };
                
                if (existingIndex >= 0) {
                    this.data.testimonies[existingIndex] = testimony;
                } else {
                    this.data.testimonies.push(testimony);
                }
            } catch (error) {
                console.error(`Error reading testimony note ${file.path}:`, error);
            }
        }
        
        this.data.testimonies.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
}
