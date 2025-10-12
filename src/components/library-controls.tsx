'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { ListFilter, ArrowUpDown } from 'lucide-react';
import type { BookStatus, MovieStatus, AnimeStatus, KDramaStatus } from '@/lib/types';
import { BOOK_STATUSES, MOVIE_STATUSES, ANIME_STATUSES, KDRAMA_STATUSES } from '@/lib/types';

const sortKeys = ['createdAt', 'title', 'rating', 'status'] as const;
type SortKey = typeof sortKeys[number];

export type SortOption = {
  key: SortKey;
  direction: 'asc' | 'desc';
};

const sortLabels: Record<SortKey, string> = {
    createdAt: 'Date Added',
    title: 'Title',
    rating: 'Rating',
    status: 'Status',
}

type LibraryControlsProps = {
  filter: BookStatus | MovieStatus | AnimeStatus | KDramaStatus | 'All';
  onFilterChange: (filter: BookStatus | MovieStatus | AnimeStatus | KDramaStatus | 'All') => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
};

export function LibraryControls({ filter, onFilterChange, sort, onSortChange }: LibraryControlsProps) {
  return (
    <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
      {/* Sort Control */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="shrink-0 w-full sm:w-auto">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup
                value={`${sort.key}-${sort.direction}`}
                onValueChange={(value) => {
                    const [key, direction] = value.split('-') as [SortKey, 'asc' | 'desc'];
                    onSortChange({ key, direction });
                }}
            >
                {sortKeys.map((key) => (
                    <React.Fragment key={key}>
                        <DropdownMenuRadioItem value={`${key}-desc`}>{sortLabels[key]} (Desc)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value={`${key}-asc`}>{sortLabels[key]} (Asc)</DropdownMenuRadioItem>
                    </React.Fragment>
                ))}
            </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Filter Control */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="shrink-0 w-full sm:w-auto">
            <ListFilter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={filter} onValueChange={(value) => onFilterChange(value as any)}>
            <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Book Statuses</DropdownMenuLabel>
            {BOOK_STATUSES.map(status => (
                <DropdownMenuRadioItem key={status} value={status}>{status}</DropdownMenuRadioItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Movie Statuses</DropdownMenuLabel>
            {MOVIE_STATUSES.map(status => (
                <DropdownMenuRadioItem key={status} value={status}>{status}</DropdownMenuRadioItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Anime Statuses</DropdownMenuLabel>
            {ANIME_STATUSES.map(status => (
                <DropdownMenuRadioItem key={status} value={status}>{status}</DropdownMenuRadioItem>
            ))}
             <DropdownMenuSeparator />
            <DropdownMenuLabel>K-Drama Statuses</DropdownMenuLabel>
            {KDRAMA_STATUSES.map(status => (
                <DropdownMenuRadioItem key={status} value={status}>{status}</DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
}
