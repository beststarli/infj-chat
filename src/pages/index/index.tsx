import { useState, useRef, useCallback, useEffect } from 'react'
import { View, Text, Input, ScrollView, Picker } from '@tarojs/components'
import './index.scss'

type INFJType = 'INFJ-A' | 'INFJ-T'
type MessageRole = 'user' | 'infj'

interface ChatMessage {
    id: string
    role: MessageRole
    content: string
    timestamp: number
}

interface ReplyRule {
    keywords: string[]
    replies: { 'INFJ-A': string; 'INFJ-T': string }
}

const INFJ_PROFILE = {
    'INFJ-A': {
        label: '自信型',
        avatar: 'A',
        color: 'bg-green-600',
        greeting:
            '你好，很高兴认识你。我是一位 INFJ-A 类型的人，我通常情绪比较稳定，对自己的判断也比较有信心。有什么想聊的吗？我很愿意倾听。',
        traits: [
            '情绪稳定，较少受外界评价影响',
            '对自己的决定更自信，不易陷入自我怀疑',
            '面对压力时能保持冷静，恢复力较强',
            '在社交中更放松，不刻意讨好他人',
        ],
        style: '温和而坚定，语气平稳，表达清晰直接',
    },
    'INFJ-T': {
        label: '动荡型',
        avatar: 'T',
        color: 'bg-lime-600',
        greeting:
            '你好...很高兴能和你交流。我是 INFJ-T 类型的人，我对周围的事物特别敏感，也常常反思自己。如果你愿意的话，我们可以慢慢聊。',
        traits: [
            '情绪波动较大，容易焦虑和紧张',
            '高度自我批判，常反思自己的不足',
            '追求完美，渴望不断提升自我',
            '非常在意他人看法，容易感到被误解',
        ],
        style: '细腻而谨慎，语气柔和，会更多地表达内心感受',
    },
}

const REPLY_RULES: ReplyRule[] = [
    {
        keywords: ['你好', '嗨', '嘿', '在吗', 'hi', 'hello'],
        replies: {
            'INFJ-A':
                '你好呀！感觉今天是个适合深聊的日子。你最近在想些什么呢？',
            'INFJ-T':
                '你好...谢谢你愿意来和我聊天。说实话我有时候会紧张，不过和你说话感觉挺舒服的。',
        },
    },
    {
        keywords: ['孤独', '寂寞', '一个人', '没人理解'],
        replies: {
            'INFJ-A':
                '我能理解那种感觉。作为 INFJ，我们经常感到与周围的人不太一样。但我学会了享受独处，它让我有更多时间去思考和沉淀。你不是一个人。',
            'INFJ-T':
                '嗯...我太能理解了。有时候我觉得自己像是活在一个透明的泡泡里，能看见所有人，却总觉得隔着什么。这种感觉会让我很焦虑，但我也在慢慢学着接受它。',
        },
    },
    {
        keywords: ['压力', '焦虑', '累', '疲惫', '难受'],
        replies: {
            'INFJ-A':
                '听到你这么说，我很心疼。压力大的时候，我会给自己一些独处的时间，看看书或者散散步。重要的是先照顾好自己的感受，你值得被温柔对待。',
            'INFJ-T':
                '我完全懂那种感觉...有时候我也会被压力压得喘不过气来，脑子里想太多事情了。我发现写日记对我帮助很大，把那些混乱的情绪写下来，心里会好受一些。你要不要也试试？',
        },
    },
    {
        keywords: ['梦想', '理想', '未来', '目标'],
        replies: {
            'INFJ-A':
                '谈到理想，这可能是我最有热情的话题了。我相信每个人都有独特的使命，关键是要听从内心的声音。我自己的愿景一直很清晰——我想要帮助更多的人找到自己的方向。你呢？你心中有怎样的愿景？',
            'INFJ-T':
                '理想啊...说实话我有很多很多想法，但有时候会怀疑自己到底能不能实现。不过我觉得这种"不安分"也许正是推动我前进的力量吧。你有没有那种，虽然害怕但还是想要去追的东西？',
        },
    },
    {
        keywords: ['朋友', '友情', '社交', '交朋友'],
        replies: {
            'INFJ-A':
                '我是那种宁缺毋滥的人，朋友不需要很多，但每一个都要真诚。表面的寒暄对我来说其实蛮消耗的，我更享受一对一的深度交流。你平时喜欢什么样的社交方式？',
            'INFJ-T':
                '社交对我来说是件又期待又紧张的事...我特别渴望深度的连接，但又怕自己说错话或者被误解。有时候聚会结束后我会反复回想自己说过的话，想着"我是不是不该那样说"...你会这样吗？',
        },
    },
    {
        keywords: ['感情', '恋爱', '喜欢', '爱情', '伴侣'],
        replies: {
            'INFJ-A':
                '在感情方面，我追求的是灵魂层面的共鸣。我不太看重外在的东西，更在意对方是否真诚、有没有自己的想法和价值观。我相信真正对的人出现时，你的内心会有很确定的感觉。',
            'INFJ-T':
                '爱情...这对我来说是最美好也最让人不安的东西。我会把对方放得很重要，有时候甚至比自己还重要。我知道这样不太好，但我就是忍不住会为对方多想...你觉得什么样的爱情才是健康的？',
        },
    },
    {
        keywords: ['mbti', 'MBTI', '人格', '性格', '测试'],
        replies: {
            'INFJ-A':
                'MBTI 对我来说是一个很好的自我认知工具。作为 INFJ，我的主导功能是内倾直觉(Ni)，它让我善于洞察本质和预见未来。不过我不会把自己完全框在类型里，毕竟每个人都是独特的。',
            'INFJ-T':
                '了解 MBTI 对我帮助特别大！当我知道自己是 INFJ-T 的时候，终于理解了为什么我总是那么敏感、那么在意别人的看法。原来不是我有问题，而是我的认知方式就是这样的。你也对 MBTI 感兴趣吗？',
        },
    },
    {
        keywords: ['工作', '职业', '上班', '事业'],
        replies: {
            'INFJ-A':
                '对我来说，工作最重要的是要有意义。赚多少钱当然也重要，但如果每天做的事情不能让我觉得有价值，我会非常痛苦。我比较适合需要洞察力和同理心的工作，比如咨询、教育或创作。',
            'INFJ-T':
                '工作方面我其实蛮纠结的...一方面我特别想做有意义的事，另一方面又总是怀疑自己做得够不够好。我发现自己特别适合需要深度思考的工作，但压力大的时候也会很崩溃。你现在做的工作开心吗？',
        },
    },
]

const GENERIC_REPLIES = {
    'INFJ-A': [
        '嗯，我能感受到你话语背后的含义。你愿意多说一些吗？',
        '这是一个很有深度的想法。我觉得每件事的发生都有它的意义，你觉得呢？',
        '我很欣赏你愿意分享这些。有时候把心里的话说出来，本身就是一种勇气。',
        '我仔细想了想你说的话，觉得你比自己以为的要更有洞察力。继续说，我在听。',
        '有意思。你知道吗，我一直觉得真正的理解不在于回答，而在于真诚地倾听。',
        '你的想法让我也开始思考了。INFJ 就是这样，我们容易被他人的思想触动。',
    ],
    'INFJ-T': [
        '嗯...你说的这些让我心里有好多感触。我需要想一想怎么表达...',
        '谢谢你告诉我这些，说实话我有点不确定该怎么回应比较好...但我是真的很在意你说的话。',
        '你的话让我想到了自己的一些经历...我们好像在某些方面蛮像的。',
        '我能感受到你的心情。虽然我有时候不太会表达，但请相信我是真的在认真听。',
        '这个话题让我有点触动...作为 INFJ-T，我很容易被情绪影响。但我觉得这种敏感也是一种礼物。',
        '嗯，我反复想了你说的话...可能想得有点多了，但我真的很想给你一个好的回应。',
    ],
}

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function getINFJReply(userMsg: string, type: INFJType): string {
    const lowerMsg = userMsg.toLowerCase()

    for (const rule of REPLY_RULES) {
        if (rule.keywords.some((kw) => lowerMsg.includes(kw.toLowerCase()))) {
            return rule.replies[type]
        }
    }

    const generics = GENERIC_REPLIES[type]
    return generics[Math.floor(Math.random() * generics.length)]
}

function formatTime(ts: number): string {
    const d = new Date(ts)
    const h = d.getHours().toString().padStart(2, '0')
    const m = d.getMinutes().toString().padStart(2, '0')
    return `${h}:${m}`
}

/** 类型选择按钮 */
function TypeSelector({
    selected,
    onChange,
}: {
    selected: INFJType
    onChange: (t: INFJType) => void
}) {
    return (
        <View className='flex items-center rounded-full border border-lime-200 bg-white p-1'>
            {(['INFJ-A', 'INFJ-T'] as INFJType[]).map((t) => (
                <View
                    key={t}
                    className={`flex-1 rounded-full px-4 py-2 text-center text-sm font-medium transition-all ${selected === t
                        ? t === 'INFJ-A'
                            ? 'bg-green-600 text-white'
                            : 'bg-lime-600 text-white'
                        : 'text-slate-500'
                        }`}
                    onClick={() => onChange(t)}
                >
                    {t} {INFJ_PROFILE[t].label}
                </View>
            ))}
        </View>
    )
}

/** 欢迎页（初始状态） */
function WelcomeScreen({
    type,
    onTypeChange,
    onSend,
}: {
    type: INFJType
    onTypeChange: (t: INFJType) => void
    onSend: (msg: string) => void
}) {
    const [inputVal, setInputVal] = useState('')

    const handleSend = useCallback(() => {
        const trimmed = inputVal.trim()
        if (!trimmed) return
        onSend(trimmed)
        setInputVal('')
    }, [inputVal, onSend])

    const profile = INFJ_PROFILE[type]

    return (
        <View className='flex flex-col items-center justify-center min-h-screen bg-white px-6 py-10 space-y-4'>
            {/* 标题区域 */}
            <View className='flex flex-col items-center'>
                <View
                    className={`flex h-16 w-16 items-center justify-center rounded-full ${profile.color} text-2xl font-bold text-white mb-4`}
                >
                    {profile.avatar}
                </View>
                <View className='text-2xl font-bold text-slate-800 text-center'>
                    INFJ 对话模拟器
                </View>
                <View className='mt-2 text-sm text-slate-500 text-center leading-6'>
                    选择一位 INFJ 类型，开始一段深度对话
                </View>
            </View>

            {/* 类型选择 */}
            <View className='w-full'>
                <TypeSelector selected={type} onChange={onTypeChange} />
            </View>



            {/* 输入区域 */}
            <View className='w-full rounded-2xl border border-lime-200 bg-lime-50 p-4'>
                <View className='text-xs text-slate-400 mb-3'>
                    {'输入任何你想说的话，开始与 ' + type + ' 交流'}
                </View>
                <View className='flex items-center gap-2'>
                    <Input
                        className={`flex-1 rounded-xl border ${profile.color.replace('bg-', 'border-')} bg-white px-4 py-3 text-sm text-slate-700`}
                        value={inputVal}
                        onInput={(e) => setInputVal(e.detail.value)}
                        onConfirm={handleSend}
                        placeholder='说点什么吧...'
                        confirmType='send'
                    />
                    <View
                        className={`shrink-0 rounded-xl px-4 py-3 text-sm font-medium text-white ${inputVal.trim() ? profile.color : 'bg-lime-300'}`}
                        onClick={handleSend}
                    >
                        发送
                    </View>
                </View>
            </View>
            {/* 类型描述卡片 */}
            <View className='w-full rounded-2xl border border-lime-200 bg-lime-50 p-4 mb-6'>
                <View className='text-sm font-semibold text-lime-700 mb-2'>
                    {type} {profile.label}
                </View>
                <View className='text-xs leading-5 text-slate-600 mb-3'>
                    {profile.style}
                </View>
                {profile.traits.map((trait, i) => (
                    <View key={i} className='flex items-start gap-2 mb-1'>
                        <View className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-400' />
                        <View className='text-xs leading-5 text-slate-500'>{trait}</View>
                    </View>
                ))}
            </View>
        </View>
    )
}

/** 单条消息气泡 */
function ChatBubble({
    message,
    type,
}: {
    message: ChatMessage
    type: INFJType
}) {
    const isUser = message.role === 'user'
    const profile = INFJ_PROFILE[type]

    return (
        <View
            className={`mb-4 flex w-full min-w-0 gap-2 ${isUser ? 'flex-row-reverse justify-start' : 'flex-row justify-start'
                }`}
        >
            {/* 头像 */}
            <View
                className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${isUser ? 'bg-slate-500' : profile.color}`}
            >
                {isUser ? 'Me' : profile.avatar}
            </View>

            {/* 气泡 + 时间 */}
            <View
                className={`flex min-w-0 max-w-[75%] flex-col ${isUser ? 'items-end' : 'items-start'
                    }`}
            >
                <View
                    className={`rounded-2xl px-4 py-3 text-sm leading-6 break-words whitespace-pre-wrap ${isUser
                        ? 'bg-white border border-slate-200 text-slate-700 rounded-tr-none'
                        : `${profile.color} text-white rounded-tl-none`
                        }`}
                >
                    {message.content}
                </View>

                <View
                    className={`mt-1 text-xs text-slate-400 ${isUser ? 'text-right' : 'text-left'
                        }`}
                >
                    {formatTime(message.timestamp)}
                </View>
            </View>
        </View>
    )
}

/** 正在输入指示器 */
function TypingIndicator({ type }: { type: INFJType }) {
    const profile = INFJ_PROFILE[type]

    return (
        <View className='flex gap-2 mb-4'>
            <View
                className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${profile.color}`}
            >
                {profile.avatar}
            </View>
            <View className='rounded-2xl rounded-tl-sm bg-white border border-lime-100 px-4 py-3'>
                <View className='typing-dots flex gap-1'>
                    <View className='h-2 w-2 rounded-full bg-lime-400' />
                    <View className='h-2 w-2 rounded-full bg-lime-400' />
                    <View className='h-2 w-2 rounded-full bg-lime-400' />
                </View>
            </View>
        </View>
    )
}

/** 聊天界面 */
function ChatScreen({
    type,
    messages,
    isTyping,
    onSend,
    onTypeChange,
    onNewConversation,
}: {
    type: INFJType
    messages: ChatMessage[]
    isTyping: boolean
    onSend: (msg: string) => void
    onTypeChange: (t: INFJType) => void
    onNewConversation: () => void
}) {
    const [inputVal, setInputVal] = useState('')
    const scrollId = useRef('msg-bottom')

    const handleSend = useCallback(() => {
        const trimmed = inputVal.trim()
        if (!trimmed || isTyping) return
        onSend(trimmed)
        setInputVal('')
    }, [inputVal, isTyping, onSend])

    const profile = INFJ_PROFILE[type]

    return (
        <View className='relative h-screen w-full min-w-0 bg-lime-50 overflow-hidden'>
            {/* 顶部导航 */}
            <View className='fixed left-0 right-0 top-0 z-30 flex items-center justify-between bg-white border-b border-lime-100 px-4 py-2'>
                <View className='flex items-center gap-2'>
                    <View
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${profile.color} text-xs font-bold text-white`}
                    >
                        {profile.avatar}
                    </View>
                    <View>
                        <View className='text-sm font-semibold text-slate-800'>
                            {'INFJ ' + profile.label}
                        </View>
                        <View className='text-xs text-slate-400'>
                            {isTyping ? '正在输入...' : '在线'}
                        </View>
                    </View>
                </View>
                <View className='flex items-center justify-between gap-1'>
                    <View
                        className={`flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium text-white ${profile.color}`}
                        onClick={() => {
                            onNewConversation()
                        }}
                    >
                        {'新对话'}
                    </View>
                    <Picker
                        mode='selector'
                        range={['INFJ-A 自信型', 'INFJ-T 动荡型']}
                        value={type === 'INFJ-A' ? 0 : 1}
                        onChange={(e) => {
                            const idx = Number((e as any).detail?.value)
                            const newType: INFJType = idx === 0 ? 'INFJ-A' : 'INFJ-T'
                            onTypeChange(newType)
                        }}
                    >
                        <View className={`flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium text-white ${profile.color}`}>
                            {'切换类型'}
                        </View>
                    </Picker>
                </View>
            </View>

            {/* 消息列表 */}
            <ScrollView
                className={`h-full max-w-[91.5%] min-w-0 px-4 mt-16  pb-[86px]`}
                scrollY
                scrollIntoView={scrollId.current}
                scrollWithAnimation
            >

                <View className='mb-4 flex w-full justify-center'>
                    <View className='rounded-full bg-lime-100 px-4 py-1.5 text-xs text-lime-600'>
                        {'对话已开始 - ' + type + ' ' + profile.label}
                    </View>
                </View>

                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} type={type} />
                ))}

                {isTyping && <TypingIndicator type={type} />}

                <View id='msg-bottom' />
            </ScrollView>


            {/* 底部输入栏 */}
            <View className='fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-lime-100 px-4 py-2'>
                <View className='flex items-center gap-2'>
                    <Input
                        className={`flex-1 rounded-full border ${profile.color.replace('bg-', 'border-')} bg-white px-4 py-2.5 text-sm text-slate-700`}
                        value={inputVal}
                        onInput={(e) => setInputVal(e.detail.value)}
                        onConfirm={handleSend}
                        placeholder={isTyping ? '对方正在输入...' : '输入消息...'}
                        confirmType='send'
                        disabled={isTyping}
                    />
                    <View
                        className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-full text-white ${inputVal.trim() && !isTyping ? profile.color : 'bg-lime-300'}`}
                        onClick={handleSend}
                    >
                        <Text className='text-lg font-bold'>{'>'}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const Index = () => {
    const [infjType, setInfjType] = useState<INFJType>('INFJ-A')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [chatStarted, setChatStarted] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // 清理 timer
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    const addINFJReply = useCallback(
        (userMsg: string, type: INFJType, isGreeting: boolean) => {
            setIsTyping(true)
            // 模拟思考时间（1~2.5秒）
            const delay = isGreeting ? 800 : 1000 + Math.random() * 1500
            timerRef.current = setTimeout(() => {
                const reply = isGreeting
                    ? INFJ_PROFILE[type].greeting
                    : getINFJReply(userMsg, type)

                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateId(),
                        role: 'infj',
                        content: reply,
                        timestamp: Date.now(),
                    },
                ])
                setIsTyping(false)
            }, delay)
        },
        []
    )

    const handleSend = useCallback(
        (msg: string) => {
            const userMessage: ChatMessage = {
                id: generateId(),
                role: 'user',
                content: msg,
                timestamp: Date.now(),
            }

            if (!chatStarted) {
                setChatStarted(true)
                setMessages([userMessage])
                // 先发一条 INFJ 的打招呼
                addINFJReply(msg, infjType, true)
            } else {
                setMessages((prev) => [...prev, userMessage])
                addINFJReply(msg, infjType, false)
            }
        },
        [chatStarted, infjType, addINFJReply]
    )

    const handleTypeChange = useCallback(
        (newType: INFJType) => {
            setInfjType(newType)
            if (chatStarted) {
                // 切换类型时添加一条系统消息风格的 INFJ 消息
                const profile = INFJ_PROFILE[newType]
                setMessages((prev) => [
                    ...prev,
                    {
                        id: generateId(),
                        role: 'infj',
                        content: `[已切换为 ${newType} ${profile.label}] ${newType === 'INFJ-A'
                            ? '嗯，我来了。我是比较自信稳定的类型，我们继续聊吧。'
                            : '嗯...你好，我来了。我是比较敏感细腻的类型，希望没有打扰到你...'
                            }`,
                        timestamp: Date.now(),
                    },
                ])
            }
        },
        [chatStarted]
    )

    if (!chatStarted) {
        return (
            <WelcomeScreen
                type={infjType}
                onTypeChange={handleTypeChange}
                onSend={handleSend}
            />
        )
    }

    return (
        <ChatScreen
            type={infjType}
            messages={messages}
            isTyping={isTyping}
            onSend={handleSend}
            onTypeChange={handleTypeChange}
            onNewConversation={() => {
                setChatStarted(false)
                setMessages([])
                setIsTyping(false)
                if (timerRef.current) {
                    clearTimeout(timerRef.current)
                    timerRef.current = null
                }
            }}
        />
    )
}

export default Index;
