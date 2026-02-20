// ============================================================
// Taro 小程序页面组件 — 用户页
// 文件路径示例: src/pages/user/index.tsx
// ============================================================

import { useState, useCallback } from 'react'
import { View, Text, Image, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

/* ------------------------------------------------------------------ */
/*  类型定义                                                           */
/* ------------------------------------------------------------------ */

interface UserInfo {
    nickName: string
    avatarUrl: string
}

type MBTIType =
    | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
    | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
    | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
    | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'

/* ------------------------------------------------------------------ */
/*  常量数据                                                           */
/* ------------------------------------------------------------------ */

const MBTI_GROUPS: { label: string; types: MBTIType[] }[] = [
    { label: '分析家', types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'] },
    { label: '外交家', types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'] },
    { label: '守卫者', types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'] },
    { label: '探险家', types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'] },
]

const MBTI_NICKNAMES: Record<MBTIType, string> = {
    INTJ: '建筑师', INTP: '逻辑学家', ENTJ: '指挥官', ENTP: '辩论家',
    INFJ: '提倡者', INFP: '调停者', ENFJ: '主人公', ENFP: '竞选者',
    ISTJ: '物流师', ISFJ: '守卫者', ESTJ: '总经理', ESFJ: '执政官',
    ISTP: '鉴赏家', ISFP: '探险家', ESTP: '企业家', ESFP: '表演者',
}

const MBTI_COLORS: Record<string, { bg: string; text: string; border: string; activeBg: string }> = {
    '分析家': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', activeBg: 'bg-purple-600' },
    '外交家': { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200', activeBg: 'bg-lime-600' },
    '守卫者': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', activeBg: 'bg-sky-600' },
    '探险家': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', activeBg: 'bg-amber-600' },
}

/* ------------------------------------------------------------------ */
/*  子组件 — 未登录态                                                   */
/* ------------------------------------------------------------------ */

function LoginScreen({ onLogin }: { onLogin: () => void }) {
    return (
        <View className='flex flex-col items-center justify-center min-h-screen bg-white px-6'>
            {/* 顶部装饰 */}
            <View className='flex flex-col items-center mb-10'>
                <View className='flex h-20 w-20 items-center justify-center rounded-full bg-lime-100 mb-4'>
                    <Text className='text-3xl text-lime-600'>{'?'}</Text>
                </View>
                <View className='text-2xl font-bold text-slate-800 text-center'>
                    {'INFJ 世界'}
                </View>
                <View className='mt-2 text-sm text-slate-500 text-center leading-6'>
                    {'登录后可设置你的 MBTI 类型\n并个性化你的对话体验'}
                </View>
            </View>

            {/* 特性列表 */}
            <View className='w-full rounded-2xl border border-lime-200 bg-lime-50 p-5 mb-8'>
                {[
                    { icon: '01', title: '设置 MBTI 类型', desc: '选择你的人格类型，获得专属标识' },
                    { icon: '02', title: '个性化头像', desc: '可使用 MBTI 类型作为聊天头像' },
                    { icon: '03', title: '对话记忆', desc: '保存你与 INFJ 的对话历史' },
                ].map((item, i) => (
                    <View key={i} className={`flex items-start gap-3 ${i > 0 ? 'mt-4' : ''}`}>
                        <View className='shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-lime-600 text-xs font-bold text-white'>
                            {item.icon}
                        </View>
                        <View className='flex-1'>
                            <View className='text-sm font-medium text-slate-700'>{item.title}</View>
                            <View className='mt-0.5 text-xs text-slate-500'>{item.desc}</View>
                        </View>
                    </View>
                ))}
            </View>

            {/* 登录按钮 */}
            <View
                className='w-full rounded-2xl bg-lime-600 py-4 text-center text-base font-semibold text-white active:bg-lime-700'
                onClick={onLogin}
            >
                {'微信授权登录'}
            </View>
            <View className='mt-3 text-xs text-slate-400 text-center'>
                {'仅获取头像和昵称，不会读取其他信息'}
            </View>
        </View>
    )
}

/* ------------------------------------------------------------------ */
/*  子组件 — MBTI 类型选择器                                            */
/* ------------------------------------------------------------------ */

function MBTISelector({
    selected,
    onSelect,
}: {
    selected: MBTIType | null
    onSelect: (t: MBTIType) => void
}) {
    return (
        <View className='rounded-2xl border border-lime-200 bg-white p-4'>
            <View className='text-base font-semibold text-slate-800 mb-1'>
                {'我的 MBTI 类型'}
            </View>
            <View className='text-xs text-slate-500 mb-4'>
                {'选择你的人格类型'}
            </View>

            {MBTI_GROUPS.map((group) => {
                const colors = MBTI_COLORS[group.label]
                return (
                    <View key={group.label} className='mb-4 last:mb-0'>
                        <View className={`text-xs font-medium ${colors.text} mb-2`}>
                            {group.label}
                        </View>
                        <View className='grid grid-cols-4 gap-2'>
                            {group.types.map((t) => {
                                const isActive = selected === t
                                return (
                                    <View
                                        key={t}
                                        className={`flex flex-col items-center rounded-xl py-2.5 transition-all ${isActive
                                                ? `${colors.activeBg} text-white`
                                                : `${colors.bg} border ${colors.border} ${colors.text}`
                                            }`}
                                        onClick={() => onSelect(t)}
                                    >
                                        <View className='text-xs font-bold'>{t}</View>
                                        <View className={`mt-0.5 text-xs ${isActive ? 'text-white/80' : 'opacity-60'}`}>
                                            {MBTI_NICKNAMES[t]}
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                )
            })}
        </View>
    )
}

/* ------------------------------------------------------------------ */
/*  子组件 — 已登录用户页                                               */
/* ------------------------------------------------------------------ */

function ProfileScreen({
    userInfo,
    mbtiType,
    useMBTIAvatar,
    onSetMBTI,
    onToggleAvatar,
    onLogout,
}: {
    userInfo: UserInfo
    mbtiType: MBTIType | null
    useMBTIAvatar: boolean
    onSetMBTI: (t: MBTIType) => void
    onToggleAvatar: (v: boolean) => void
    onLogout: () => void
}) {
    // 找到当前类型所属的分组来获取颜色
    const currentGroup = mbtiType
        ? MBTI_GROUPS.find((g) => g.types.includes(mbtiType))
        : null
    const currentColors = currentGroup ? MBTI_COLORS[currentGroup.label] : null

    return (
        <View className='min-h-screen bg-lime-50 pb-8'>
            {/* 顶部用户信息卡片 */}
            <View className='bg-white px-5 pt-6 pb-5 mb-3'>
                <View className='flex items-center gap-4'>
                    {/* 头像 */}
                    <View className='relative'>
                        {useMBTIAvatar && mbtiType ? (
                            <View
                                className={`flex h-16 w-16 items-center justify-center rounded-full ${currentColors?.activeBg || 'bg-lime-600'
                                    } text-lg font-bold text-white`}
                            >
                                {mbtiType}
                            </View>
                        ) : (
                            <Image
                                className='h-16 w-16 rounded-full bg-lime-100'
                                src={userInfo.avatarUrl}
                                mode='aspectFill'
                            />
                        )}
                        {/* MBTI 徽章 */}
                        {mbtiType && (
                            <View
                                className={`absolute -bottom-1 -right-1 rounded-full ${currentColors?.activeBg || 'bg-lime-600'
                                    } px-1.5 py-0.5 text-xs font-bold text-white border-2 border-white`}
                            >
                                {mbtiType.slice(0, 2)}
                            </View>
                        )}
                    </View>
                    {/* 用户名和类型 */}
                    <View className='flex-1'>
                        <View className='text-lg font-bold text-slate-800'>
                            {userInfo.nickName}
                        </View>
                        {mbtiType ? (
                            <View className='flex items-center gap-2 mt-1'>
                                <View
                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${currentColors?.bg || 'bg-lime-50'
                                        } ${currentColors?.text || 'text-lime-700'}`}
                                >
                                    {mbtiType}
                                </View>
                                <View className='text-xs text-slate-500'>
                                    {MBTI_NICKNAMES[mbtiType]}
                                </View>
                            </View>
                        ) : (
                            <View className='mt-1 text-xs text-slate-400'>
                                {'尚未设置 MBTI 类型'}
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* 头像设置选项 */}
            <View className='bg-white px-5 py-4 mb-3'>
                <View className='flex items-center justify-between'>
                    <View className='flex-1'>
                        <View className='text-sm font-medium text-slate-800'>
                            {'使用 MBTI 类型作为聊天头像'}
                        </View>
                        <View className='mt-0.5 text-xs text-slate-500'>
                            {'开启后，你在模拟器中的头像将显示为 MBTI 类型'}
                        </View>
                    </View>
                    <Switch
                        checked={useMBTIAvatar}
                        onChange={(e) => onToggleAvatar(e.detail.value)}
                        color='#65a30d'
                    />
                </View>

                {/* 头像预览 */}
                {mbtiType && (
                    <View className='flex items-center gap-3 mt-4 pt-4 border-t border-lime-100'>
                        <View className='text-xs text-slate-500'>{'聊天中显示为:'}</View>
                        <View className='flex items-center gap-2'>
                            {useMBTIAvatar ? (
                                <View
                                    className={`flex h-8 w-8 items-center justify-center rounded-full ${currentColors?.activeBg || 'bg-lime-600'
                                        } text-xs font-bold text-white`}
                                >
                                    {mbtiType.slice(0, 2)}
                                </View>
                            ) : (
                                <Image
                                    className='h-8 w-8 rounded-full bg-lime-100'
                                    src={userInfo.avatarUrl}
                                    mode='aspectFill'
                                />
                            )}
                            <View className='text-xs text-slate-600'>
                                {useMBTIAvatar ? mbtiType : userInfo.nickName}
                            </View>
                        </View>
                    </View>
                )}
            </View>

            {/* MBTI 类型选择 */}
            <View className='px-4 mb-3'>
                <MBTISelector selected={mbtiType} onSelect={onSetMBTI} />
            </View>

            {/* 更多设置 */}
            <View className='bg-white px-5 py-4 mb-3'>
                <View className='text-base font-semibold text-slate-800 mb-3'>
                    {'更多'}
                </View>

                {/* 清除聊天记录 */}
                <View
                    className='flex items-center justify-between py-3 border-b border-lime-50'
                    onClick={() => {
                        Taro.showModal({
                            title: '提示',
                            content: '确定要清除所有对话记录吗？',
                            confirmColor: '#65a30d',
                            success(res) {
                                if (res.confirm) {
                                    Taro.removeStorageSync('chat_messages')
                                    Taro.showToast({ title: '已清除', icon: 'success' })
                                }
                            },
                        })
                    }}
                >
                    <View className='text-sm text-slate-700'>{'清除对话记录'}</View>
                    <View className='text-xs text-slate-400'>{'>'}</View>
                </View>

                {/* 关于 */}
                <View
                    className='flex items-center justify-between py-3'
                    onClick={() => {
                        Taro.showModal({
                            title: 'INFJ 世界',
                            content:
                                '这是一个 INFJ 人格探索小程序，旨在帮助你了解和体验 INFJ 提倡者的内心世界。\n\n基于 MBTI 理论和荣格认知功能。',
                            showCancel: false,
                            confirmColor: '#65a30d',
                        })
                    }}
                >
                    <View className='text-sm text-slate-700'>{'关于小程序'}</View>
                    <View className='text-xs text-slate-400'>{'>'}</View>
                </View>
            </View>

            {/* 退出登录 */}
            <View className='px-4'>
                <View
                    className='w-full rounded-2xl border border-red-200 bg-white py-3.5 text-center text-sm font-medium text-red-500 active:bg-red-50'
                    onClick={onLogout}
                >
                    {'退出登录'}
                </View>
            </View>
        </View>
    )
}

/* ------------------------------------------------------------------ */
/*  主页面                                                             */
/* ------------------------------------------------------------------ */

const STORAGE_KEYS = {
    USER_INFO: 'user_info',
    MBTI_TYPE: 'mbti_type',
    USE_MBTI_AVATAR: 'use_mbti_avatar',
}

export default function UserPage() {
    // 从本地缓存初始化状态
    const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
        try {
            const cached = Taro.getStorageSync(STORAGE_KEYS.USER_INFO)
            return cached ? JSON.parse(cached) : null
        } catch {
            return null
        }
    })

    const [mbtiType, setMbtiType] = useState<MBTIType | null>(() => {
        try {
            return (Taro.getStorageSync(STORAGE_KEYS.MBTI_TYPE) as MBTIType) || null
        } catch {
            return null
        }
    })

    const [useMBTIAvatar, setUseMBTIAvatar] = useState<boolean>(() => {
        try {
            return Taro.getStorageSync(STORAGE_KEYS.USE_MBTI_AVATAR) === 'true'
        } catch {
            return false
        }
    })

    /* ----- 登录 ----- */
    const handleLogin = useCallback(() => {
        // 微信小程序获取用户头像和昵称
        // 注意: wx.getUserProfile 在基础库 2.27.1+ 已调整
        // 推荐使用头像昵称填写组件，但这里做兼容处理
        Taro.getUserProfile({
            desc: '用于展示用户信息',
            success(res) {
                const info: UserInfo = {
                    nickName: res.userInfo.nickName,
                    avatarUrl: res.userInfo.avatarUrl,
                }
                setUserInfo(info)
                Taro.setStorageSync(STORAGE_KEYS.USER_INFO, JSON.stringify(info))
                Taro.showToast({ title: '登录成功', icon: 'success' })
            },
            fail() {
                // 如果用户拒绝授权，使用默认信息让用户体验
                Taro.showModal({
                    title: '授权提示',
                    content: '你拒绝了授权，是否使用默认身份继续？',
                    confirmColor: '#65a30d',
                    success(modalRes) {
                        if (modalRes.confirm) {
                            const defaultInfo: UserInfo = {
                                nickName: '匿名用户',
                                avatarUrl: '',
                            }
                            setUserInfo(defaultInfo)
                            Taro.setStorageSync(
                                STORAGE_KEYS.USER_INFO,
                                JSON.stringify(defaultInfo)
                            )
                        }
                    },
                })
            },
        })
    }, [])

    /* ----- 设置 MBTI ----- */
    const handleSetMBTI = useCallback((type: MBTIType) => {
        setMbtiType(type)
        Taro.setStorageSync(STORAGE_KEYS.MBTI_TYPE, type)
        Taro.showToast({
            title: `已设为 ${type}`,
            icon: 'success',
        })
    }, [])

    /* ----- 切换头像选项 ----- */
    const handleToggleAvatar = useCallback((value: boolean) => {
        setUseMBTIAvatar(value)
        Taro.setStorageSync(STORAGE_KEYS.USE_MBTI_AVATAR, value ? 'true' : 'false')
    }, [])

    /* ----- 退出登录 ----- */
    const handleLogout = useCallback(() => {
        Taro.showModal({
            title: '确认退出',
            content: '退出登录后将清除本地用户数据',
            confirmColor: '#65a30d',
            success(res) {
                if (res.confirm) {
                    setUserInfo(null)
                    setMbtiType(null)
                    setUseMBTIAvatar(false)
                    Taro.removeStorageSync(STORAGE_KEYS.USER_INFO)
                    Taro.removeStorageSync(STORAGE_KEYS.MBTI_TYPE)
                    Taro.removeStorageSync(STORAGE_KEYS.USE_MBTI_AVATAR)
                    Taro.showToast({ title: '已退出', icon: 'success' })
                }
            },
        })
    }, [])

    /* ----- 渲染 ----- */
    if (!userInfo) {
        return <LoginScreen onLogin={handleLogin} />
    }

    return (
        <ProfileScreen
            userInfo={userInfo}
            mbtiType={mbtiType}
            useMBTIAvatar={useMBTIAvatar}
            onSetMBTI={handleSetMBTI}
            onToggleAvatar={handleToggleAvatar}
            onLogout={handleLogout}
        />
    )
}
