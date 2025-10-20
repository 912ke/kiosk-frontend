import type { CatalogInfo, Host, TimeSlot, Booking } from '@shared/schema';

const API_BASE = '';

export interface BookingRequest {
  hosts: number[];
  from: string;
  to: string;
  comment?: string;
  clientPhone?: string;
  clientName?: string;
}

export interface BookingResponse {
  ok: boolean;
  booking?: {
    id: number;
    hosts: number[];
    from: Date;
    to: Date;
    status: string;
  };
  error?: string;
}

export const api = {
  async getCatalog(): Promise<CatalogInfo> {
    const res = await fetch(`${API_BASE}/api/catalog`);
    if (!res.ok) throw new Error('Failed to fetch catalog');
    return res.json();
  },

  async getHosts(includeOffline = false, onlyGroups = false): Promise<Host[]> {
    const params = new URLSearchParams();
    if (includeOffline) params.append('include_offline', 'true');
    if (onlyGroups) params.append('only_groups', 'true');
    
    const res = await fetch(`${API_BASE}/api/hosts?${params}`);
    if (!res.ok) throw new Error('Failed to fetch hosts');
    return res.json();
  },

  async getSlots(params: {
    date: string;
    start?: string;
    end?: string;
    duration_minutes?: number;
    step_minutes?: number;
    count?: number;
  }): Promise<TimeSlot[]> {
    const queryParams = new URLSearchParams({
      date: params.date,
      start: params.start || '12:00',
      end: params.end || '00:00',
      duration_minutes: String(params.duration_minutes || 60),
      step_minutes: String(params.step_minutes || 30),
      count: String(params.count || 1),
    });

    const res = await fetch(`${API_BASE}/api/slots?${queryParams}`);
    if (!res.ok) throw new Error('Failed to fetch slots');
    return res.json();
  },

  async createBooking(booking: BookingRequest): Promise<BookingResponse> {
    const res = await fetch(`${API_BASE}/api/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create booking');
    return data;
  },
};
