export function mergePresentationsWithFavorites(presentations, favoriteIds){
  return presentations.map((p) => ({
    ...p,
    favorited: favoriteIds.includes(p.id),
    day: getDay(p)
  }))
}

var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export const getDay = (p) => days[(new Date(p.day)).getDay()]