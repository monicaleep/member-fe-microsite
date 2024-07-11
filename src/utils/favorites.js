export function mergePresentationsWithFavorites(presentations, favoriteIds){
  return presentations.map((p) => ({
    ...p,
    favorited: favoriteIds.includes(p._id),
  }));
}

export function getFavoritePresentations(presentations, favoriteIds){
  return mergePresentationsWithFavorites(presentations, favoriteIds).filter(presentation => presentation.favorited)
}