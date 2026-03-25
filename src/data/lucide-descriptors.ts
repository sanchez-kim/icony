/**
 * lucide-descriptors.ts
 *
 * IconDescriptor records for Lucide icons.
 * No component imports here — components are loaded lazily via icon-registry.ts.
 *
 * Tag convention:
 *   - English tags first (for Latin-alphabet search)
 *   - Korean tags appended at the end (for Korean-language search)
 *
 * This file demonstrates the new lazy-loading-compatible data format.
 * The existing icons.ts / lucideIcons array continues to work in parallel
 * until the full migration is complete.
 */

import type { IconDescriptor } from '../types/icon';

export const lucideDescriptors: IconDescriptor[] = [
  // UI & Navigation
  {
    id: 'lucide-Home',
    name: 'Home',
    library: 'lucide',
    componentName: 'Home',
    category: 'ui',
    tags: ['house', 'main', 'start', 'homepage', '홈', '집', '메인', '시작'],
  },
  {
    id: 'lucide-Menu',
    name: 'Menu',
    library: 'lucide',
    componentName: 'Menu',
    category: 'ui',
    tags: ['hamburger', 'navigation', 'bars', '메뉴', '내비게이션', '햄버거'],
  },
  {
    id: 'lucide-Search',
    name: 'Search',
    library: 'lucide',
    componentName: 'Search',
    category: 'ui',
    tags: ['find', 'magnifying', 'glass', 'look', '검색', '찾기', '돋보기'],
  },
  {
    id: 'lucide-Settings',
    name: 'Settings',
    library: 'lucide',
    componentName: 'Settings',
    category: 'ui',
    tags: ['gear', 'config', 'preferences', 'options', '설정', '환경설정', '기어', '옵션'],
  },
  {
    id: 'lucide-Filter',
    name: 'Filter',
    library: 'lucide',
    componentName: 'Filter',
    category: 'ui',
    tags: ['funnel', 'sort', 'refine', '필터', '정렬', '깔때기'],
  },

  // Arrows & Chevrons
  {
    id: 'lucide-ChevronRight',
    name: 'Chevron Right',
    library: 'lucide',
    componentName: 'ChevronRight',
    category: 'arrows',
    tags: ['arrow', 'next', 'forward', '화살표', '다음', '오른쪽'],
  },
  {
    id: 'lucide-ChevronLeft',
    name: 'Chevron Left',
    library: 'lucide',
    componentName: 'ChevronLeft',
    category: 'arrows',
    tags: ['arrow', 'back', 'previous', '화살표', '뒤로', '왼쪽'],
  },
  {
    id: 'lucide-ChevronUp',
    name: 'Chevron Up',
    library: 'lucide',
    componentName: 'ChevronUp',
    category: 'arrows',
    tags: ['arrow', 'collapse', 'less', '화살표', '위', '접기'],
  },
  {
    id: 'lucide-ChevronDown',
    name: 'Chevron Down',
    library: 'lucide',
    componentName: 'ChevronDown',
    category: 'arrows',
    tags: ['arrow', 'expand', 'more', '화살표', '아래', '펼치기'],
  },

  // Users & People
  {
    id: 'lucide-User',
    name: 'User',
    library: 'lucide',
    componentName: 'User',
    category: 'users',
    tags: ['person', 'profile', 'account', 'avatar', '사용자', '프로필', '계정', '아바타'],
  },
  {
    id: 'lucide-Users',
    name: 'Users',
    library: 'lucide',
    componentName: 'Users',
    category: 'users',
    tags: ['people', 'group', 'team', 'multiple', '사람들', '그룹', '팀', '다수'],
  },
  {
    id: 'lucide-UserPlus',
    name: 'User Plus',
    library: 'lucide',
    componentName: 'UserPlus',
    category: 'users',
    tags: ['add', 'invite', 'new', 'member', '추가', '초대', '신규', '멤버'],
  },
  {
    id: 'lucide-UserMinus',
    name: 'User Minus',
    library: 'lucide',
    componentName: 'UserMinus',
    category: 'users',
    tags: ['remove', 'delete', 'kick', '삭제', '제거', '탈퇴'],
  },

  // Communication
  {
    id: 'lucide-Mail',
    name: 'Mail',
    library: 'lucide',
    componentName: 'Mail',
    category: 'communication',
    tags: ['email', 'message', 'envelope', 'letter', '이메일', '메시지', '편지', '메일'],
  },
  {
    id: 'lucide-MessageCircle',
    name: 'Message',
    library: 'lucide',
    componentName: 'MessageCircle',
    category: 'communication',
    tags: ['chat', 'conversation', 'bubble', 'talk', '채팅', '대화', '말풍선'],
  },
  {
    id: 'lucide-Send',
    name: 'Send',
    library: 'lucide',
    componentName: 'Send',
    category: 'communication',
    tags: ['submit', 'paper-plane', 'fly', '전송', '보내기', '제출'],
  },
  {
    id: 'lucide-Bell',
    name: 'Bell',
    library: 'lucide',
    componentName: 'Bell',
    category: 'communication',
    tags: ['notification', 'alert', 'ring', 'alarm', '알림', '벨', '경보'],
  },

  // Files & Media
  {
    id: 'lucide-File',
    name: 'File',
    library: 'lucide',
    componentName: 'File',
    category: 'files',
    tags: ['document', 'page', 'paper', '파일', '문서', '페이지'],
  },
  {
    id: 'lucide-Folder',
    name: 'Folder',
    library: 'lucide',
    componentName: 'Folder',
    category: 'files',
    tags: ['directory', 'storage', 'organize', '폴더', '디렉토리', '저장소'],
  },
  {
    id: 'lucide-Image',
    name: 'Image',
    library: 'lucide',
    componentName: 'Image',
    category: 'media',
    tags: ['photo', 'picture', 'gallery', '이미지', '사진', '갤러리', '그림'],
  },
  {
    id: 'lucide-Video',
    name: 'Video',
    library: 'lucide',
    componentName: 'Video',
    category: 'media',
    tags: ['movie', 'film', 'play', '비디오', '영상', '동영상', '영화'],
  },
  {
    id: 'lucide-Music',
    name: 'Music',
    library: 'lucide',
    componentName: 'Music',
    category: 'media',
    tags: ['audio', 'sound', 'song', '음악', '오디오', '소리', '노래'],
  },
  {
    id: 'lucide-Camera',
    name: 'Camera',
    library: 'lucide',
    componentName: 'Camera',
    category: 'media',
    tags: ['photo', 'picture', 'snapshot', '카메라', '사진', '촬영'],
  },

  // Actions
  {
    id: 'lucide-Download',
    name: 'Download',
    library: 'lucide',
    componentName: 'Download',
    category: 'actions',
    tags: ['save', 'import', 'get', '다운로드', '저장', '내려받기'],
  },
  {
    id: 'lucide-Upload',
    name: 'Upload',
    library: 'lucide',
    componentName: 'Upload',
    category: 'actions',
    tags: ['import', 'send', 'publish', '업로드', '올리기', '게시'],
  },
  {
    id: 'lucide-Edit',
    name: 'Edit',
    library: 'lucide',
    componentName: 'Edit',
    category: 'actions',
    tags: ['pencil', 'modify', 'change', 'write', '편집', '수정', '연필', '쓰기'],
  },
  {
    id: 'lucide-Trash',
    name: 'Trash',
    library: 'lucide',
    componentName: 'Trash',
    category: 'actions',
    tags: ['delete', 'remove', 'bin', 'garbage', '삭제', '제거', '휴지통'],
  },
  {
    id: 'lucide-Copy',
    name: 'Copy',
    library: 'lucide',
    componentName: 'Copy',
    category: 'actions',
    tags: ['duplicate', 'clone', 'paste', '복사', '복제', '붙여넣기'],
  },
  {
    id: 'lucide-Share',
    name: 'Share',
    library: 'lucide',
    componentName: 'Share',
    category: 'actions',
    tags: ['forward', 'send', 'distribute', '공유', '배포', '전달'],
  },

  // Status & Feedback
  {
    id: 'lucide-Check',
    name: 'Check',
    library: 'lucide',
    componentName: 'Check',
    category: 'status',
    tags: ['confirm', 'tick', 'success', 'yes', '확인', '체크', '성공', '완료'],
  },
  {
    id: 'lucide-X',
    name: 'X',
    library: 'lucide',
    componentName: 'X',
    category: 'status',
    tags: ['close', 'cancel', 'no', 'remove', '닫기', '취소', '제거'],
  },
  {
    id: 'lucide-CheckCircle',
    name: 'Check Circle',
    library: 'lucide',
    componentName: 'CheckCircle',
    category: 'status',
    tags: ['success', 'done', 'complete', '성공', '완료', '체크원'],
  },
  {
    id: 'lucide-XCircle',
    name: 'X Circle',
    library: 'lucide',
    componentName: 'XCircle',
    category: 'status',
    tags: ['error', 'fail', 'close', '오류', '실패', '닫기원'],
  },
  {
    id: 'lucide-AlertCircle',
    name: 'Alert Circle',
    library: 'lucide',
    componentName: 'AlertCircle',
    category: 'status',
    tags: ['warning', 'info', 'notification', '경고', '알림', '주의'],
  },
  {
    id: 'lucide-AlertTriangle',
    name: 'Alert Triangle',
    library: 'lucide',
    componentName: 'AlertTriangle',
    category: 'status',
    tags: ['warning', 'caution', 'danger', '경고', '주의', '위험'],
  },
  {
    id: 'lucide-Info',
    name: 'Info',
    library: 'lucide',
    componentName: 'Info',
    category: 'status',
    tags: ['information', 'help', 'question', '정보', '도움말', '안내'],
  },
  {
    id: 'lucide-HelpCircle',
    name: 'Help',
    library: 'lucide',
    componentName: 'HelpCircle',
    category: 'status',
    tags: ['question', 'support', 'info', '질문', '지원', '도움말'],
  },

  // Engagement
  {
    id: 'lucide-Heart',
    name: 'Heart',
    library: 'lucide',
    componentName: 'Heart',
    category: 'engagement',
    tags: ['like', 'love', 'favorite', '좋아요', '하트', '사랑', '즐겨찾기'],
  },
  {
    id: 'lucide-Star',
    name: 'Star',
    library: 'lucide',
    componentName: 'Star',
    category: 'engagement',
    tags: ['favorite', 'bookmark', 'rate', '별', '즐겨찾기', '평점'],
  },
  {
    id: 'lucide-ThumbsUp',
    name: 'Thumbs Up',
    library: 'lucide',
    componentName: 'ThumbsUp',
    category: 'engagement',
    tags: ['like', 'approve', 'good', '좋아요', '승인', '추천'],
  },
  {
    id: 'lucide-ThumbsDown',
    name: 'Thumbs Down',
    library: 'lucide',
    componentName: 'ThumbsDown',
    category: 'engagement',
    tags: ['dislike', 'disapprove', 'bad', '싫어요', '비추천', '반대'],
  },
  {
    id: 'lucide-Bookmark',
    name: 'Bookmark',
    library: 'lucide',
    componentName: 'Bookmark',
    category: 'engagement',
    tags: ['save', 'favorite', 'mark', '북마크', '저장', '즐겨찾기'],
  },

  // Time & Calendar
  {
    id: 'lucide-Calendar',
    name: 'Calendar',
    library: 'lucide',
    componentName: 'Calendar',
    category: 'time',
    tags: ['date', 'schedule', 'event', 'day', '달력', '일정', '날짜', '이벤트'],
  },
  {
    id: 'lucide-Clock',
    name: 'Clock',
    library: 'lucide',
    componentName: 'Clock',
    category: 'time',
    tags: ['time', 'hour', 'watch', '시계', '시간', '시'],
  },

  // Location
  {
    id: 'lucide-MapPin',
    name: 'Map Pin',
    library: 'lucide',
    componentName: 'MapPin',
    category: 'location',
    tags: ['location', 'marker', 'place', 'address', '위치', '마커', '주소', '장소'],
  },
  {
    id: 'lucide-Globe',
    name: 'Globe',
    library: 'lucide',
    componentName: 'Globe',
    category: 'location',
    tags: ['world', 'earth', 'international', 'web', '지구', '세계', '국제', '웹'],
  },

  // Devices
  {
    id: 'lucide-Smartphone',
    name: 'Smartphone',
    library: 'lucide',
    componentName: 'Smartphone',
    category: 'devices',
    tags: ['mobile', 'phone', 'cell', '스마트폰', '휴대폰', '모바일'],
  },
  {
    id: 'lucide-Laptop',
    name: 'Laptop',
    library: 'lucide',
    componentName: 'Laptop',
    category: 'devices',
    tags: ['computer', 'notebook', 'pc', '노트북', '컴퓨터'],
  },
  {
    id: 'lucide-Monitor',
    name: 'Monitor',
    library: 'lucide',
    componentName: 'Monitor',
    category: 'devices',
    tags: ['screen', 'display', 'desktop', '모니터', '화면', '디스플레이', '데스크톱'],
  },

  // Development
  {
    id: 'lucide-Code',
    name: 'Code',
    library: 'lucide',
    componentName: 'Code',
    category: 'development',
    tags: ['programming', 'developer', 'brackets', '코드', '프로그래밍', '개발자'],
  },
  {
    id: 'lucide-Terminal',
    name: 'Terminal',
    library: 'lucide',
    componentName: 'Terminal',
    category: 'development',
    tags: ['console', 'command', 'cli', '터미널', '콘솔', '명령어'],
  },
  {
    id: 'lucide-Github',
    name: 'GitHub',
    library: 'lucide',
    componentName: 'Github',
    category: 'development',
    tags: ['git', 'code', 'repository', '깃허브', '저장소', '버전관리'],
  },

  // Security
  {
    id: 'lucide-Lock',
    name: 'Lock',
    library: 'lucide',
    componentName: 'Lock',
    category: 'security',
    tags: ['secure', 'private', 'password', '잠금', '보안', '비밀번호', '개인정보'],
  },
  {
    id: 'lucide-Unlock',
    name: 'Unlock',
    library: 'lucide',
    componentName: 'Unlock',
    category: 'security',
    tags: ['open', 'unsecure', 'accessible', '잠금해제', '열기', '접근'],
  },
  {
    id: 'lucide-Eye',
    name: 'Eye',
    library: 'lucide',
    componentName: 'Eye',
    category: 'security',
    tags: ['view', 'show', 'visible', 'see', '보기', '표시', '눈'],
  },
  {
    id: 'lucide-EyeOff',
    name: 'Eye Off',
    library: 'lucide',
    componentName: 'EyeOff',
    category: 'security',
    tags: ['hide', 'invisible', 'hidden', '숨기기', '숨김', '비공개'],
  },

  // Commerce
  {
    id: 'lucide-ShoppingCart',
    name: 'Shopping Cart',
    library: 'lucide',
    componentName: 'ShoppingCart',
    category: 'commerce',
    tags: ['buy', 'purchase', 'basket', 'shop', '장바구니', '구매', '쇼핑'],
  },
  {
    id: 'lucide-CreditCard',
    name: 'Credit Card',
    library: 'lucide',
    componentName: 'CreditCard',
    category: 'commerce',
    tags: ['payment', 'money', 'pay', 'card', '신용카드', '결제', '카드', '돈'],
  },
  {
    id: 'lucide-DollarSign',
    name: 'Dollar',
    library: 'lucide',
    componentName: 'DollarSign',
    category: 'commerce',
    tags: ['money', 'price', 'payment', 'currency', '달러', '돈', '가격', '통화'],
  },
  {
    id: 'lucide-Gift',
    name: 'Gift',
    library: 'lucide',
    componentName: 'Gift',
    category: 'commerce',
    tags: ['present', 'reward', 'bonus', '선물', '보상', '보너스'],
  },

  // Analytics
  {
    id: 'lucide-BarChart',
    name: 'Bar Chart',
    library: 'lucide',
    componentName: 'BarChart',
    category: 'analytics',
    tags: ['graph', 'stats', 'data', 'analysis', '막대그래프', '통계', '데이터', '분석'],
  },
  {
    id: 'lucide-TrendingUp',
    name: 'Trending Up',
    library: 'lucide',
    componentName: 'TrendingUp',
    category: 'analytics',
    tags: ['increase', 'growth', 'arrow', 'up', '증가', '성장', '상승'],
  },
  {
    id: 'lucide-TrendingDown',
    name: 'Trending Down',
    library: 'lucide',
    componentName: 'TrendingDown',
    category: 'analytics',
    tags: ['decrease', 'decline', 'arrow', 'down', '감소', '하락', '하강'],
  },
  {
    id: 'lucide-Activity',
    name: 'Activity',
    library: 'lucide',
    componentName: 'Activity',
    category: 'analytics',
    tags: ['pulse', 'heartbeat', 'live', 'monitor', '활동', '펄스', '심박', '모니터링'],
  },

  // Cloud & Network
  {
    id: 'lucide-Cloud',
    name: 'Cloud',
    library: 'lucide',
    componentName: 'Cloud',
    category: 'network',
    tags: ['storage', 'sync', 'backup', '클라우드', '저장소', '동기화', '백업'],
  },
  {
    id: 'lucide-Wifi',
    name: 'Wifi',
    library: 'lucide',
    componentName: 'Wifi',
    category: 'network',
    tags: ['wireless', 'internet', 'connection', '와이파이', '무선', '인터넷', '연결'],
  },

  // Theme
  {
    id: 'lucide-Sun',
    name: 'Sun',
    library: 'lucide',
    componentName: 'Sun',
    category: 'theme',
    tags: ['light', 'day', 'bright', '태양', '낮', '밝기', '라이트모드'],
  },
  {
    id: 'lucide-Moon',
    name: 'Moon',
    library: 'lucide',
    componentName: 'Moon',
    category: 'theme',
    tags: ['dark', 'night', 'dim', '달', '밤', '다크모드', '어두운'],
  },

  // Symbols
  {
    id: 'lucide-Plus',
    name: 'Plus',
    library: 'lucide',
    componentName: 'Plus',
    category: 'symbols',
    tags: ['add', 'new', 'create', 'positive', '추가', '더하기', '생성', '새로운'],
  },
  {
    id: 'lucide-Minus',
    name: 'Minus',
    library: 'lucide',
    componentName: 'Minus',
    category: 'symbols',
    tags: ['subtract', 'remove', 'negative', '빼기', '제거', '뺄셈'],
  },

  // Media controls
  {
    id: 'lucide-Play',
    name: 'Play',
    library: 'lucide',
    componentName: 'Play',
    category: 'media-controls',
    tags: ['start', 'video', 'audio', '재생', '시작', '플레이'],
  },
  {
    id: 'lucide-Pause',
    name: 'Pause',
    library: 'lucide',
    componentName: 'Pause',
    category: 'media-controls',
    tags: ['stop', 'video', 'audio', '일시정지', '멈춤'],
  },
  {
    id: 'lucide-Volume2',
    name: 'Volume High',
    library: 'lucide',
    componentName: 'Volume2',
    category: 'media-controls',
    tags: ['sound', 'loud', 'speaker', '소리', '볼륨', '스피커'],
  },
  {
    id: 'lucide-VolumeX',
    name: 'Volume Mute',
    library: 'lucide',
    componentName: 'VolumeX',
    category: 'media-controls',
    tags: ['sound', 'mute', 'silent', '음소거', '무음', '조용히'],
  },
];
