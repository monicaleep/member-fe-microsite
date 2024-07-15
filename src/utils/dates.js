var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export const getDay = (p) => days[(new Date(p.day)).getDay()]