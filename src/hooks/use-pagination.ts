"use client";

import { useState, useCallback } from "react";

interface UsePaginationProps {
    itemsPerPage?: number;
}

interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
    cursor: string | undefined;
    cursors: string[];
}

export function usePagination({ itemsPerPage = 12 }: UsePaginationProps = {}) {
    const [state, setState] = useState<PaginationState>({
        currentPage: 1,
        itemsPerPage,
        cursor: undefined,
        cursors: [], // Store cursors for each page to enable back navigation
    });

    const goToPage = useCallback((page: number, cursor?: string) => {
        setState(prev => ({
            ...prev,
            currentPage: page,
            cursor,
        }));
    }, []);

    const goToNextPage = useCallback((nextCursor: string) => {
        setState(prev => {
            const newCursors = [...prev.cursors];
            // Store the cursor for the current page so we can go back
            if (prev.currentPage === newCursors.length + 1) {
                newCursors.push(prev.cursor || '');
            }

            return {
                ...prev,
                currentPage: prev.currentPage + 1,
                cursor: nextCursor,
                cursors: newCursors,
            };
        });
    }, []);

    const goToPreviousPage = useCallback(() => {
        setState(prev => {
            if (prev.currentPage <= 1) return prev;

            const newPage = prev.currentPage - 1;
            const previousCursor = newPage === 1 ? undefined : prev.cursors[newPage - 2];

            return {
                ...prev,
                currentPage: newPage,
                cursor: previousCursor,
            };
        });
    }, []);

    const reset = useCallback(() => {
        setState({
            currentPage: 1,
            itemsPerPage,
            cursor: undefined,
            cursors: [],
        });
    }, [itemsPerPage]);

    return {
        currentPage: state.currentPage,
        itemsPerPage: state.itemsPerPage,
        cursor: state.cursor,
        goToPage,
        goToNextPage,
        goToPreviousPage,
        reset,
        canGoBack: state.currentPage > 1,
    };
}