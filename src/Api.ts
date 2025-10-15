import axios from 'axios';
import { Artwork } from '../types/artwork';


const BASE_URL = 'https://api.artic.edu/api/v1/artworks';


export const fetchArtworks = async (page: number = 1, limit: number = 12): Promise<{ data: Artwork[]; total: number }> => {
const response = await axios.get(`${BASE_URL}?page=${page}&limit=${limit}`);
const artworks = response.data.data.map((item: any) => ({
id: item.id,
title: item.title,
place_of_origin: item.place_of_origin,
artist_display: item.artist_display,
inscriptions: item.inscriptions,
date_start: item.date_start,
date_end: item.date_end,
}));
const total = response.data.pagination.total;
return { data: artworks, total };
};