import { View, Text } from '@tarojs/components'
import './index.scss'

/* ------------------------------------------------------------------ */
/*  数据                                                               */
/* ------------------------------------------------------------------ */

const cognitiveFunctions = [
    {
        name: '内倾直觉 (Ni)',
        tag: '主导',
        color: 'bg-lime-600',
        description:
            'Ni是INFJ的核心功能，负责整合无意识的模式、象征和未来可能性。让INFJ能够洞察事物的本质，预见潜在的结果，并形成深刻的洞见。',
    },
    {
        name: '外倾情感 (Fe)',
        tag: '辅助',
        color: 'bg-green-500',
        description:
            'Fe使INFJ高度关注他人的情感需求和群体和谐。擅长共情，能敏锐察觉他人的情绪变化。Fe与Ni结合，让INFJ关心如何通过人际关系实现积极改变。',
    },
    {
        name: '内倾思维 (Ti)',
        tag: '第三',
        color: 'bg-emerald-500',
        description:
            'Ti是INFJ的内在逻辑框架，用于分析信息、构建概念体系。帮助INFJ梳理复杂的思想，寻找内部一致性，在深度思考时尤为重要。',
    },
    {
        name: '外倾感觉 (Se)',
        tag: '劣势',
        color: 'bg-lime-400',
        description:
            'Se关注当下的感官体验和具体细节。处于劣势位置的INFJ可能对现实世界不够敏感，容易忽略身体需求或环境变化。',
    },
]

const infjATraits = [
    '情绪稳定，较少受外界评价影响',
    '对自己的决定更自信，不易陷入自我怀疑',
    '面对压力时能保持冷静，恢复力较强',
    '较少追求完美，更容易满足于现状',
    '在社交中更放松，不刻意讨好他人',
]

const infjTTraits = [
    '情绪波动较大，容易焦虑和紧张',
    '高度自我批判，常反思自己的不足',
    '对压力敏感，可能需要更长时间恢复',
    '追求完美，渴望不断提升自我',
    '非常在意他人看法，容易感到被误解',
]

const relationshipPoints = [
    '重视真诚和信任，对肤浅的社交感到厌倦',
    '善于倾听和共情，常成为朋友的"心灵导师"',
    '在亲密关系中追求灵魂伴侣，希望分享价值观和理想',
    '可能因过度付出而忽略自身需求，需学会设立边界',
    '沟通风格温和但坚定，必要时会捍卫自己的信念',
]

const careerFields = [
    { label: '助人行业', detail: '心理咨询、教育、社会工作' },
    { label: '创造性工作', detail: '写作、艺术、设计' },
    { label: '使命驱动', detail: '非营利组织、宗教或哲学领域' },
    { label: '理解他人', detail: '人力资源、用户研究' },
]

const growthTips = [
    '学习平衡理想与现实，接受不完美',
    '培养Se功能，关注当下和身体需求（如运动、正念）',
    '建立健康的边界，避免过度卷入他人问题',
    '定期独处以恢复能量，反思内心需求',
    '通过写作、艺术等方式表达内心世界',
    '接纳自己的敏感性，但不被情绪淹没',
    '寻找志同道合的社群，分享理想与困惑',
]

const misconceptions = [
    {
        myth: 'INFJ都是内向害羞的',
        fact: '虽然内向，但在涉及价值观和帮助他人时可以表现得非常外向和有感染力。',
    },
    {
        myth: 'INFJ是完美无缺的',
        fact: 'INFJ也有弱点，比如可能过于理想化、固执或忽略现实。',
    },
    {
        myth: '所有INFJ都一样',
        fact: '每个人都是独特的，成长环境、文化背景和亚型（A/T）会导致显著差异。',
    },
    {
        myth: 'INFJ总是情绪化',
        fact: '他们能理性分析，只是在决策中优先考虑情感因素。',
    },
]

const famousINFJs = [
    { name: '马丁·路德·金', desc: '民权运动领袖，以愿景和感召力闻名' },
    { name: '甘地', desc: '非暴力哲学倡导者，追求精神理想' },
    { name: '陀思妥耶夫斯基', desc: '作家，深刻探索人性与信仰' },
    { name: '泰勒·斯威夫特', desc: '创作型歌手，叙事性歌曲与情感连接' },
    { name: '奥普拉·温弗瑞', desc: '媒体人，善于共情和激励他人' },
]

// 字组件
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View className='rounded-2xl border border-lime-200 bg-white p-4'>
            <View className='mb-3 text-base font-bold text-lime-700'>{title}</View>
            {children}
        </View>
    )
}

export default function IntroPage() {
    return (
        <View className='page bg-lime-50 px-4 py-6 space-y-5'>

            {/* ====== Hero ====== */}
            <View className='rounded-2xl bg-gradient-to-br from-lime-600 to-green-700 px-5 py-6 text-white'>
                <View className='text-xs font-medium opacity-80'>MBTI 人格类型</View>
                <View className='mt-1 text-3xl font-extrabold tracking-wide'>INFJ · 提倡者</View>
                <View className='mt-2 text-sm leading-6 opacity-90'>
                    约占全球人口 1%~2%，是最稀有的人格类型之一。深刻、复杂、富有同情心，渴望理解生命的意义，并致力于让世界变得更好。
                </View>
                <View className='mt-4 flex flex-wrap gap-2'>
                    {['I 内向', 'N 直觉', 'F 情感', 'J 判断'].map((tag) => (
                        <View
                            key={tag}
                            className='rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs font-medium'
                        >
                            {tag}
                        </View>
                    ))}
                </View>
            </View>

            {/* ====== 概述 ====== */}
            <SectionCard title='概述：什么是INFJ？'>
                <View className='text-sm leading-6 text-slate-600 mb-3'>
                    INFJ是迈尔斯-布里格斯类型指标（MBTI）中16种人格类型之一，由卡尔·荣格的心理学理论发展而来。四个字母分别代表：
                </View>
                {[
                    { letter: 'I', label: '内向', desc: '关注内心世界，通过独处恢复能量' },
                    { letter: 'N', label: '直觉', desc: '关注抽象概念、未来可能性和模式' },
                    { letter: 'F', label: '情感', desc: '决策时以个人价值观和他人感受为导向' },
                    { letter: 'J', label: '判断', desc: '喜欢计划、组织和果断的生活方式' },
                ].map((item) => (
                    <View key={item.letter} className='flex items-start gap-2 mb-2'>
                        <View className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-lime-600 text-xs font-bold text-white'>
                            {item.letter}
                        </View>
                        <View className='text-sm leading-5 text-slate-600'>
                            <Text className='font-medium text-lime-700'>{item.label}</Text>
                            <Text>{' — '}</Text>
                            <Text>{item.desc}</Text>
                        </View>
                    </View>
                ))}
            </SectionCard>

            {/* ====== 认知功能 ====== */}
            <SectionCard title='荣格八维认知功能'>
                <View className='text-sm leading-6 text-slate-600 mb-3'>
                    INFJ的认知功能堆叠由四个主要功能和四个阴影功能组成，决定了思维、情感和行为模式。
                </View>
                <View className='space-y-3'>
                    {cognitiveFunctions.map((fn) => (
                        <View key={fn.name} className='rounded-xl border border-lime-100 bg-lime-50/60 p-3'>
                            <View className='flex items-center gap-2'>
                                <View className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${fn.color}`}>
                                    {fn.tag}
                                </View>
                                <View className='text-sm font-semibold text-slate-800'>{fn.name}</View>
                            </View>
                            <View className='mt-2 text-xs leading-5 text-slate-600'>{fn.description}</View>
                        </View>
                    ))}
                </View>
                <View className='mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3'>
                    <View className='text-sm font-semibold text-slate-700'>阴影功能</View>
                    <View className='mt-1 text-xs leading-5 text-slate-500'>
                        阴影功能在压力下显现，包括外倾直觉(Ne)、内倾情感(Fi)、外倾思维(Te)、内倾感觉(Si)，可能导致杂乱无章、自我怀疑、控制欲或固守习惯等表现。
                    </View>
                </View>
            </SectionCard>

            {/* ====== A / T 对比 ====== */}
            <SectionCard title='INFJ-A 与 INFJ-T 的区别'>
                <View className='text-sm leading-6 text-slate-600 mb-3'>
                    基于五因素模型补充的亚型，主要区别在于情绪调节和自我认知方式。
                </View>
                {/* INFJ-A */}
                <View className='rounded-xl border border-lime-200 bg-lime-50/70 p-3 mb-3'>
                    <View className='flex items-center gap-2 mb-2'>
                        <View className='rounded-full bg-lime-600 px-2.5 py-0.5 text-xs font-bold text-white'>A</View>
                        <View className='text-sm font-semibold text-lime-700'>自信型</View>
                    </View>
                    {infjATraits.map((trait, i) => (
                        <View key={i} className='flex items-start gap-2 mb-1'>
                            <View className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-400' />
                            <View className='text-xs leading-5 text-slate-600'>{trait}</View>
                        </View>
                    ))}
                </View>
                {/* INFJ-T */}
                <View className='rounded-xl border border-green-200 bg-green-50/70 p-3'>
                    <View className='flex items-center gap-2 mb-2'>
                        <View className='rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-bold text-white'>T</View>
                        <View className='text-sm font-semibold text-green-700'>动荡型</View>
                    </View>
                    {infjTTraits.map((trait, i) => (
                        <View key={i} className='flex items-start gap-2 mb-1'>
                            <View className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400' />
                            <View className='text-xs leading-5 text-slate-600'>{trait}</View>
                        </View>
                    ))}
                </View>
                <View className='mt-3 rounded-lg bg-lime-100/60 px-3 py-2 text-xs leading-5 text-lime-800'>
                    INFJ-A更倾向于"随遇而安"，INFJ-T更像"完美主义的奋斗者"。两者没有优劣之分，了解自己的亚型有助于更好地管理情绪和发挥优势。
                </View>
            </SectionCard>

            {/* ====== 人际关系 ====== */}
            <SectionCard title='人际关系与沟通'>
                <View className='text-sm leading-6 text-slate-600 mb-3'>
                    INFJ在人际关系中渴望深度连接和理解：
                </View>
                {relationshipPoints.map((point, i) => (
                    <View key={i} className='flex items-start gap-2 mb-2'>
                        <View className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-100 text-xs font-bold text-lime-600'>
                            {i + 1}
                        </View>
                        <View className='text-sm leading-5 text-slate-600'>{point}</View>
                    </View>
                ))}
            </SectionCard>

            {/* ====== 职业 ====== */}
            <SectionCard title='适合INFJ的职业领域'>
                <View className='text-sm leading-6 text-slate-600 mb-3'>
                    INFJ擅长需要洞察力、创造力和同理心的工作：
                </View>
                <View className='grid grid-cols-2 gap-2'>
                    {careerFields.map((field) => (
                        <View key={field.label} className='rounded-xl border border-lime-100 bg-lime-50/50 p-3'>
                            <View className='text-sm font-semibold text-lime-700'>{field.label}</View>
                            <View className='mt-1 text-xs text-slate-500'>{field.detail}</View>
                        </View>
                    ))}
                </View>
                <View className='mt-3 text-xs text-slate-400'>
                    建议避免过于机械、重复或缺乏意义的工作环境。
                </View>
            </SectionCard>

            {/* ====== 个人成长 ====== */}
            <SectionCard title='个人成长与发展建议'>
                <View className='space-y-2'>
                    {growthTips.map((tip, i) => (
                        <View key={i} className='flex items-start gap-2'>
                            <View className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-lime-600 text-xs font-bold text-white'>
                                {i + 1}
                            </View>
                            <View className='text-sm leading-5 text-slate-600'>{tip}</View>
                        </View>
                    ))}
                </View>
            </SectionCard>

            {/* ====== 常见误解 ====== */}
            <SectionCard title='关于INFJ的常见误解'>
                <View className='space-y-3'>
                    {misconceptions.map((item, i) => (
                        <View key={i} className='rounded-xl border border-lime-100 bg-lime-50/40 p-3'>
                            <View className='flex items-center gap-2'>
                                <View className='rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-500'>误解</View>
                                <View className='text-sm font-medium text-slate-700'>{item.myth}</View>
                            </View>
                            <View className='mt-2 flex items-start gap-2'>
                                <View className='rounded-full bg-lime-100 px-2 py-0.5 text-xs font-medium text-lime-600 shrink-0'>事实</View>
                                <View className='text-xs leading-5 text-slate-600'>{item.fact}</View>
                            </View>
                        </View>
                    ))}
                </View>
            </SectionCard>

            {/* ====== 著名INFJ ====== */}
            <SectionCard title='著名的INFJ代表'>
                <View className='space-y-2'>
                    {famousINFJs.map((person) => (
                        <View key={person.name} className='flex items-center gap-3 rounded-xl border border-lime-100 bg-lime-50/50 px-3 py-2.5'>
                            <View className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-600 text-sm font-bold text-white'>
                                {person.name.charAt(0)}
                            </View>
                            <View>
                                <View className='text-sm font-semibold text-slate-800'>{person.name}</View>
                                <View className='text-xs text-slate-500'>{person.desc}</View>
                            </View>
                        </View>
                    ))}
                </View>
            </SectionCard>

            {/* ====== 结语 ====== */}
            <View className='rounded-2xl bg-gradient-to-br from-lime-600 to-green-700 px-5 py-5 text-white'>
                <View className='text-base font-bold'>结语</View>
                <View className='mt-2 text-sm leading-6 opacity-90'>
                    INFJ是一种复杂而迷人的类型，他们带着使命感和同理心生活，努力为世界带来积极影响。理解自己的INFJ特质不仅有助于个人成长，也能帮助他们更好地与外界建立连接。
                </View>
            </View>

            <View className='h-4' />
        </View>
    )
}
