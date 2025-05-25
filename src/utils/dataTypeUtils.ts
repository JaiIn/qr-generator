// 데이터 타입 정의
export type DataType = 'phone' | 'email' | 'url' | 'sms' | 'wifi' | 'geo' | 'text'

export interface FormatResult {
  type: DataType
  original: string
  formatted: string
  description: string
}

// 정규표현식 패턴들
const patterns = {
  // 전화번호: 다양한 형태 지원
  phone: /^(\+?82[- ]?)?0?1[0-9][- ]?\d{3,4}[- ]?\d{4}$|^(\+?\d{1,3}[- ]?)?\d{2,4}[- ]?\d{3,4}[- ]?\d{4}$/,
  
  // 이메일: 기본적인 이메일 형태
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // URL: 다양한 URL 형태
  url: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$|^(https?:\/\/)?[a-zA-Z0-9-]+\.(com|net|org|co\.kr|kr|io|dev|tech)(\/.*)?$/,
  
  // SMS: SMS:번호 형태
  sms: /^(sms|SMS|문자)[:：]\s*(\+?82[- ]?)?0?1[0-9][- ]?\d{3,4}[- ]?\d{4}$/,
  
  // WiFi: WIFI:네트워크명:비밀번호 형태
  wifi: /^(wifi|WiFi|WIFI)[:：]\s*([^:]+)[:：]\s*(.+)$/,
  
  // 좌표: 위도,경도 형태
  geo: /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/
}

// 전화번호 정규화 (한국 번호 기준)
const normalizePhoneNumber = (phone: string): string => {
  // 모든 공백, 하이픈 제거
  let cleaned = phone.replace(/[\s-]/g, '')
  
  // +82로 시작하는 경우 처리
  if (cleaned.startsWith('+82')) {
    cleaned = '0' + cleaned.substring(3)
  } else if (cleaned.startsWith('82') && cleaned.length > 10) {
    cleaned = '0' + cleaned.substring(2)
  }
  
  // 0으로 시작하지 않으면 010 추가 (추측)
  if (!cleaned.startsWith('0') && cleaned.length === 8) {
    cleaned = '010' + cleaned
  }
  
  return cleaned
}

// URL 정규화
const normalizeUrl = (url: string): string => {
  let normalized = url.trim()
  
  // 프로토콜이 없으면 https 추가
  if (!normalized.match(/^https?:\/\//)) {
    // www로 시작하면 https://www. 추가
    if (normalized.startsWith('www.')) {
      normalized = 'https://' + normalized
    } else {
      // 그냥 도메인이면 https:// 추가
      normalized = 'https://' + normalized
    }
  }
  
  return normalized
}

// 메인 포맷팅 함수
export const formatDataType = (input: string): FormatResult => {
  const trimmed = input.trim()
  
  if (!trimmed) {
    return {
      type: 'text',
      original: input,
      formatted: input,
      description: '텍스트'
    }
  }
  
  // 전화번호 체크
  if (patterns.phone.test(trimmed)) {
    const normalized = normalizePhoneNumber(trimmed)
    return {
      type: 'phone',
      original: input,
      formatted: `tel:${normalized}`,
      description: `전화번호로 인식 → ${normalized}번으로 전화걸기`
    }
  }
  
  // 이메일 체크
  if (patterns.email.test(trimmed)) {
    return {
      type: 'email',
      original: input,
      formatted: `mailto:${trimmed}`,
      description: `이메일로 인식 → ${trimmed}로 메일 보내기`
    }
  }
  
  // SMS 체크
  const smsMatch = trimmed.match(patterns.sms)
  if (smsMatch) {
    const phoneNumber = normalizePhoneNumber(smsMatch[2] || '')
    return {
      type: 'sms',
      original: input,
      formatted: `sms:${phoneNumber}`,
      description: `문자 메시지로 인식 → ${phoneNumber}로 문자 보내기`
    }
  }
  
  // WiFi 체크
  const wifiMatch = trimmed.match(patterns.wifi)
  if (wifiMatch) {
    const [, , networkName, password] = wifiMatch
    return {
      type: 'wifi',
      original: input,
      formatted: `WIFI:T:WPA;S:${networkName.trim()};P:${password.trim()};;`,
      description: `WiFi 정보로 인식 → ${networkName.trim()} 네트워크 자동 연결`
    }
  }
  
  // 좌표 체크
  if (patterns.geo.test(trimmed)) {
    const [lat, lng] = trimmed.split(',').map(coord => coord.trim())
    return {
      type: 'geo',
      original: input,
      formatted: `geo:${lat},${lng}`,
      description: `좌표로 인식 → ${lat}, ${lng} 위치 지도에 표시`
    }
  }
  
  // URL 체크 (마지막에 체크 - 가장 관대함)
  if (patterns.url.test(trimmed)) {
    const normalized = normalizeUrl(trimmed)
    return {
      type: 'url',
      original: input,
      formatted: normalized,
      description: `웹사이트로 인식 → ${normalized} 페이지 열기`
    }
  }
  
  // 기본값: 일반 텍스트
  return {
    type: 'text',
    original: input,
    formatted: input,
    description: '일반 텍스트'
  }
}

// 예시 데이터 (개발 및 테스트용)
export const exampleData = [
  '010-1234-5678',
  'user@example.com',
  'https://www.google.com',
  'naver.com',
  'SMS:010-1234-5678',
  'WiFi:MyNetwork:password123',
  '37.5665,126.9780',
  '안녕하세요'
]
