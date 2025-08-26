import EventCard from '@/components/EventCard';
import FamilyCard from '@/components/FamilyCard';
import WishListCard from '@/components/WishListCard';
import { GetEvents } from '@/lib/queries/events';
import { GetFamilies } from '@/lib/queries/families';
import { getFavorites } from '@/lib/queries/favorites';
import { GetList } from '@/lib/queries/items';

export default async function FavoritesSection() {
  const favorites = await getFavorites();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 @container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Favorites</h2>
      </div>
      <div className="grid @lg:grid-cols-2 @3xl:grid-cols-3 gap-4">
        {favorites.map((favorite) => {
          if (favorite.familyId) {
            return <FamilyCard key={favorite.id} family={favorite.family as unknown as GetFamilies} />;
          }
          if (favorite.eventId) {
            return <EventCard key={favorite.id} event={favorite.event as GetEvents[number]} />;
          }
          if (favorite.listId) {
            return <WishListCard key={favorite.id} list={favorite.list as GetList} />;
          }
        })}
      </div>
    </section>
  );
}
