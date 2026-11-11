// Privacy policy + account deletion copy for 주유소를부탁해 (com.motoraa.fuelkr).
// Facts come from the app's own bundled policy (site/privacy.html in the 1.0.5 build) and app strings (i18n.js, app-config.js).
// Owner rules: no ads wording on web pages (the privacy policy may carry one AdMob line only if the app ever shows ads; it does not today).
// {op} = legal operator (config.policyOperator), {email}, {date}, {pkg}
export const P = {
  ko: {
    title: '개인정보처리방침 — 주유소를부탁해', h1: '개인정보처리방침', meta: '주유소를부탁해 · {pkg} · 최종 업데이트 {date}',
    secs: [
      ['운영자', '“주유소를부탁해” 앱은 {op}가 운영합니다. 문의: {email}'],
      ['로그인', '지도, 주유소 목록, 가격, 유종, 길 안내는 로그인 없이 쓸 수 있습니다. 가격을 보려면 로그인 화면이 필요하지 않습니다. 앱은 Firebase 프로젝트 fuelkr-motoraa에서 익명 인증으로 세션을 만들고, 그 ID 토큰으로 가격 조회 서버에 요청합니다. 즐겨찾기, 주유 기록, 가격 알림, 기기 간 동기화를 쓸 때만 Google 계정으로 로그인합니다.'],
      ['수집하는 정보', '• 로그인한 경우: Google 계정의 이메일, 이름, 프로필 사진, Firebase 사용자 ID\n• 위치: 주변 주유소를 조회할 때만 사용합니다. 현재 좌표는 한국석유공사 오피넷 조회(앱에서 직접 또는 MOTOR AA 조회 서버를 거쳐)에만 쓰이며, 이동 기록으로 저장하지 않습니다.\n• 즐겨찾기, 선택한 유종, 직접 입력한 주유 기록\n• 의견: 휴대폰의 메일 앱으로 보내는 내용'],
      ['하지 않는 것', '오피넷 공개 API에는 주유소 재고가 없어 재고를 수집하거나 표시하지 않습니다. 개인정보를 판매하지 않습니다. 유가 조회 인증키는 공개하지 않습니다.'],
      ['보관과 삭제', '계정 데이터는 계정을 삭제할 때까지, 휴대폰 안의 데이터는 로그아웃·삭제·앱 삭제 전까지 보관합니다. 앱의 메뉴 → 내 계정 → 내 계정 삭제에서 지울 수 있고, 아래 계정 삭제 안내로도 요청할 수 있습니다.'],
      ['대상', '만 18세 이상을 대상으로 합니다.'],
    ],
    del: '계정 및 데이터 삭제 →', back: '← 앱 소개',
    dTitle: '계정 및 데이터 삭제 — 주유소를부탁해', dH1: '계정 및 데이터 삭제',
    dSecs: [
      ['앱에서 삭제', '주유소를부탁해({pkg}) 앱에서 메뉴 → 내 계정 → 내 계정 삭제를 누르면 로그인 계정, 즐겨찾기, 선택한 유종, 주유 기록, 이 휴대폰의 데이터가 지워집니다. 되돌릴 수 없습니다.'],
      ['이메일로 요청', '앱을 쓸 수 없으면 {email} 로 계정 이메일과 함께 삭제를 요청하세요. 비밀번호나 인증키는 보내지 마세요.'],
      ['로그인하지 않은 경우', '서버에 계정 데이터가 없습니다. 휴대폰 안의 즐겨찾기와 기록은 앱을 삭제하면 함께 지워집니다.'],
    ],
    pp: '← 개인정보처리방침',
  },
  en: {
    title: 'Privacy policy — 주유소를부탁해', h1: 'Privacy policy', meta: '주유소를부탁해 · {pkg} · Last updated {date}',
    secs: [
      ['Who we are', 'The app “주유소를부탁해” is operated by {op}. Contact: {email}'],
      ['Sign-in', 'The map, station list, prices, fuel types and directions work without signing in. You do not need a sign-in screen to see prices. The app creates an anonymous Firebase session in project fuelkr-motoraa and uses that ID token to request prices from the lookup server. A Google account is used only for favourites, the fuel log, price alerts and syncing between devices.'],
      ['What we collect', '• If you sign in: your Google email, name, profile photo and Firebase user ID\n• Location: used only to look up nearby stations. The current coordinates are used only for a Korea National Oil Corporation Opinet lookup (from the app directly or through a MOTOR AA lookup server) and are not stored as a travel history.\n• Favourites, the fuel you chose, and a fuel log you type yourself\n• Feedback you send with your mail app'],
      ['What we do not do', 'Opinet’s public API has no station stock, so the app neither collects nor shows stock. We do not sell personal data. The price lookup key is not published.'],
      ['Keeping and deleting', 'Account data is kept until you delete the account; data on your phone until you sign out, delete it or uninstall. Delete it in the app under Menu → My account → Delete my account, or use the account deletion page below.'],
      ['Audience', 'For users aged 18 and over.'],
    ],
    del: 'Delete account and data →', back: '← About the app',
    dTitle: 'Delete account and data — 주유소를부탁해', dH1: 'Delete account and data',
    dSecs: [
      ['In the app', 'In 주유소를부탁해 ({pkg}), tap Menu → My account → Delete my account. This removes your sign-in account, favourites, chosen fuel, fuel log and the data on this phone. It cannot be undone.'],
      ['By email', 'If you cannot use the app, email {email} from (or naming) your account email and ask for deletion. Never send passwords or keys.'],
      ['If you never signed in', 'There is no account data on the server. Favourites and records on your phone are removed when you uninstall the app.'],
    ],
    pp: '← Privacy policy',
  },
  th: {
    title: 'นโยบายความเป็นส่วนตัว — 주유소를부탁해', h1: 'นโยบายความเป็นส่วนตัว', meta: '주유소를부탁해 · {pkg} · อัปเดต {date}',
    secs: [
      ['สรุป', 'แอปนี้ดำเนินการโดย {op} ติดต่อ {email} ใช้แผนที่ รายการปั๊ม และราคาได้โดยไม่ต้องเข้าสู่ระบบ บัญชี Google ใช้เฉพาะรายการโปรด บันทึกการเติม การแจ้งเตือนราคา และการซิงก์ ตำแหน่งใช้เพื่อค้นหาปั๊มใกล้ ๆ ผ่านโอพีเน็ตเท่านั้น ไม่เก็บประวัติการเดินทาง และไม่มีข้อมูลสต็อก ลบบัญชีได้ที่เมนู → บัญชีของฉัน → ลบบัญชี'],
    ],
    del: 'ขอลบบัญชีและข้อมูล →', back: '← เกี่ยวกับแอป',
    dTitle: 'ขอลบบัญชีและข้อมูล — 주유소를부탁해', dH1: 'ขอลบบัญชีและข้อมูล',
    dSecs: [['วิธีลบ', 'ในแอป ({pkg}) แตะเมนู → บัญชีของฉัน → ลบบัญชี หรืออีเมลถึง {email} พร้อมอีเมลบัญชี ห้ามส่งรหัสผ่านหรือคีย์ ถ้าไม่เคยเข้าสู่ระบบ ไม่มีข้อมูลบนเซิร์ฟเวอร์']],
    pp: '← นโยบายความเป็นส่วนตัว',
  },
  zh: {
    title: '隐私政策 — 주유소를부탁해', h1: '隐私政策', meta: '주유소를부탁해 · {pkg} · 最后更新 {date}',
    secs: [
      ['摘要', '本应用由 {op} 运营，联系 {email}。地图、加油站列表和价格无需登录即可使用；Google 账号只用于收藏、加油记录、价格提醒和同步。位置只用于通过 Opinet 查询附近加油站，不保存行程记录，也没有库存数据。可在 菜单 → 我的账号 → 删除账号 中删除。'],
    ],
    del: '删除账号和数据 →', back: '← 应用介绍',
    dTitle: '删除账号和数据 — 주유소를부탁해', dH1: '删除账号和数据',
    dSecs: [['删除方法', '在应用（{pkg}）中点击 菜单 → 我的账号 → 删除账号，或附上账号邮箱发邮件至 {email}。请勿发送密码或密钥。从未登录则服务器上没有账号数据。']],
    pp: '← 隐私政策',
  },
  hi: {
    title: 'गोपनीयता नीति — 주유소를부탁해', h1: 'गोपनीयता नीति', meta: '주유소를부탁해 · {pkg} · अपडेट {date}',
    secs: [
      ['सारांश', 'यह ऐप {op} द्वारा चलाया जाता है, संपर्क {email}। नक्शा, पंप सूची और दाम बिना साइन-इन के चलते हैं; Google खाता केवल पसंदीदा, ईंधन रिकॉर्ड, दाम अलर्ट और सिंक के लिए है। लोकेशन केवल Opinet से पास के पंप खोजने में लगती है, यात्रा इतिहास सेव नहीं होता, स्टॉक डेटा नहीं है। मेन्यू → मेरा खाता → खाता हटाएँ से हटाएँ।'],
    ],
    del: 'खाता और डेटा हटाएँ →', back: '← ऐप के बारे में',
    dTitle: 'खाता और डेटा हटाएँ — 주유소를부탁해', dH1: 'खाता और डेटा हटाएँ',
    dSecs: [['कैसे हटाएँ', 'ऐप ({pkg}) में मेन्यू → मेरा खाता → खाता हटाएँ टैप करें, या खाते के ईमेल के साथ {email} पर ईमेल करें। पासवर्ड या कुंजी कभी न भेजें। कभी साइन-इन नहीं किया तो सर्वर पर कोई डेटा नहीं है।']],
    pp: '← गोपनीयता नीति',
  },
};
