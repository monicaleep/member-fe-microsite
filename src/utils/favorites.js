export function mergePresentationsWithFavorites(presentations, favoriteIds){
  return presentations.map((p) => ({
    ...p,
    favorited: favoriteIds.includes(p.id),
  }));
}

