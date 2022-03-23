export const formatDate = (timestampSeconds) => {
  const d = new Date(timestampSeconds * 1000);
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${mo} ${da}, ${ye}`;
};

export const formatDateWithMinutes = (timestampSeconds) => {
  const d = new Date(timestampSeconds * 1000);
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  const hr = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: false }).format(d);
  const mi = new Intl.DateTimeFormat('en', { minute: 'numeric' }).format(d);
  return `${hr}:${mi < 10 ? '0' : ''}${mi} ${mo} ${da}, ${ye}`;
};

export const containsObjectById = (list, obj) => {
  for(let i = 0; i < list.length; i++) {
    if(list[i].id === obj.id) {
      return true;
    }
  }
  return false;
};

export const getObjectIndexById = (list, obj) => {
  for(let i = 0; i < list.length; i++) {
    if(list[i].id === obj.id) {
      return i;
    }
  }
  return -1;
};

export const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    return {};
  }
};

export const filterItem = (inputVal, list) => {
  const japaneseChars = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
  const containsJapanese = inputVal.match(japaneseChars);
  let filtered;
  if(inputVal.includes('/')) {
    const key = inputVal.split('/')[0].trim();
    filtered = list.filter(item => item.name_english.toLowerCase().includes(key.toLowerCase()));
  } else if(containsJapanese) {
    filtered = list.filter(item => item.name_japanese.toLowerCase().includes(inputVal) || item.name_japanese_ruby.toLowerCase().includes(inputVal));
  } else {
    filtered = list.filter(item => item.name_english.toLowerCase().includes(inputVal.toLowerCase()));
  }
  return filtered;
};