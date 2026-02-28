'use client';
import Image from 'next/image';

interface Movie {
  id: number;
  title: string;
  duration: number;
  imageUrl: string | null;
  likes?: string;
  genres?: string;
  isPromoted?: boolean;
}

interface RecommendedProps {
  movies: Movie[];
  title?: string;
}

const Recommended = ({ movies, title = 'Recommended Movies' }: RecommendedProps) => {
  return (
    <div className="w-full py-8">
      <div className="flex justify-between items-center mb-6 px-4">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <button className="text-red-500 hover:text-red-600 text-sm md:text-base">
          See All ›
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-4 pb-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="min-w-[200px] md:min-w-[280px] flex-shrink-0 cursor-pointer group"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                {movie.isPromoted && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded z-10">
                    PROMOTED
                  </div>
                )}
                
                {movie.imageUrl ? (
                  <Image
                    src={movie.imageUrl}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                
                {movie.likes && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center text-white text-sm">
                      <span className="text-green-400 mr-1">👍</span>
                      <span className="font-semibold">{movie.likes} Likes</span>
                    </div>
                  </div>
                )}
              </div>
              
              <h3 className="font-bold text-base md:text-lg mb-1 truncate">
                {movie.title}
              </h3>
              {movie.genres && (
                <p className="text-gray-500 text-sm truncate">{movie.genres}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommended;