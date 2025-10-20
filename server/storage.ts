import { type Host, type Booking, type InsertHost, type InsertBooking, type CatalogInfo, type TimeSlot, type SlotQuery } from "@shared/schema";

export interface IStorage {
  // Catalog
  getCatalog(): Promise<CatalogInfo>;
  
  // Hosts
  getHosts(includeOffline?: boolean, onlyGroups?: boolean): Promise<Host[]>;
  createHost(host: InsertHost): Promise<Host>;
  
  // Bookings
  getBooking(id: number): Promise<Booking | undefined>;
  getBookings(from?: Date, to?: Date): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  
  // Slots
  getAvailableSlots(query: SlotQuery): Promise<TimeSlot[]>;
}

export class MemStorage implements IStorage {
  private hosts: Map<number, Host>;
  private bookings: Map<number, Booking>;
  private nextHostId: number;
  private nextBookingId: number;

  constructor() {
    this.hosts = new Map();
    this.bookings = new Map();
    this.nextHostId = 1;
    this.nextBookingId = 1;
    
    // Initialize with sample hosts
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleHosts: InsertHost[] = [
      { name: 'Rig 1', groupId: 1, groupName: 'Главный зал', online: true },
      { name: 'Rig 2', groupId: 1, groupName: 'Главный зал', online: true },
      { name: 'Rig 3', groupId: 1, groupName: 'Главный зал', online: true },
      { name: 'Rig 4', groupId: 1, groupName: 'Главный зал', online: true },
      { name: 'Rig 5', groupId: 1, groupName: 'Главный зал', online: true },
      { name: 'Rig 6', groupId: 1, groupName: 'Главный зал', online: false },
      { name: 'Rig 7', groupId: 1, groupName: 'Главный зал', online: true },
      { name: 'Rig 8', groupId: 1, groupName: 'Главный зал', online: true },
      { name: 'Rig 9', groupId: 1, groupName: 'Главный зал', online: true },
      { name: 'Rig 10', groupId: 1, groupName: 'Главный зал', online: true },
      { name: 'VIP Rig 1', groupId: 2, groupName: 'VIP зал', online: true },
      { name: 'VIP Rig 2', groupId: 2, groupName: 'VIP зал', online: true },
      { name: 'VIP Rig 3', groupId: 2, groupName: 'VIP зал', online: true },
      { name: 'VIP Rig 4', groupId: 2, groupName: 'VIP зал', online: false },
      { name: 'VIP Rig 5', groupId: 2, groupName: 'VIP зал', online: true },
    ];

    sampleHosts.forEach(host => {
      const id = this.nextHostId++;
      this.hosts.set(id, { 
        id, 
        name: host.name,
        groupId: host.groupId ?? null,
        groupName: host.groupName ?? null,
        online: host.online ?? true,
      });
    });
  }

  async getCatalog(): Promise<CatalogInfo> {
    return {
      source: 'local',
      name: 'BurnoutZ',
      address: 'г. Алматы, ул. Жамбыла 204',
      currency: 'KZT',
      services: ['Аренда симулятора', 'Турниры', 'Обучение'],
    };
  }

  async getHosts(includeOffline = false, onlyGroups = false): Promise<Host[]> {
    let hosts = Array.from(this.hosts.values());
    
    if (!includeOffline) {
      hosts = hosts.filter(h => h.online);
    }
    
    if (onlyGroups) {
      const groupMap = new Map<number, Host>();
      hosts.forEach(h => {
        if (h.groupId && !groupMap.has(h.groupId)) {
          groupMap.set(h.groupId, h);
        }
      });
      return Array.from(groupMap.values());
    }
    
    return hosts;
  }

  async createHost(host: InsertHost): Promise<Host> {
    const id = this.nextHostId++;
    const newHost: Host = { 
      id, 
      name: host.name,
      groupId: host.groupId ?? null,
      groupName: host.groupName ?? null,
      online: host.online ?? true,
    };
    this.hosts.set(id, newHost);
    return newHost;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookings(from?: Date, to?: Date): Promise<Booking[]> {
    let bookings = Array.from(this.bookings.values());
    
    if (from) {
      bookings = bookings.filter(b => new Date(b.from) >= from);
    }
    
    if (to) {
      bookings = bookings.filter(b => new Date(b.to) <= to);
    }
    
    return bookings;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.nextBookingId++;
    const newBooking: Booking = {
      id,
      hosts: JSON.stringify(booking.hosts),
      from: new Date(booking.from),
      to: new Date(booking.to),
      status: 'confirmed',
      comment: booking.comment || null,
      clientPhone: booking.clientPhone || null,
      clientName: booking.clientName || null,
      createdAt: new Date(),
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async getAvailableSlots(query: SlotQuery): Promise<TimeSlot[]> {
    const { date, start, end, duration_minutes, step_minutes, count } = query;
    
    // Parse time range
    let startTime = this.parseTime(start);
    let endTime = this.parseTime(end);
    
    // If end time is 00:00 (midnight), treat it as end of day (24:00 = 1440 minutes)
    if (endTime === 0 || endTime <= startTime) {
      endTime = 24 * 60; // 1440 minutes = midnight next day
    }
    
    // Get bookings for the date (and potentially next day if slots extend past midnight)
    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);
    const dayBookings = await this.getBookings(dayStart, dayEnd);
    
    // Get available hosts
    const availableHosts = await this.getHosts(false, false);
    const totalHosts = availableHosts.length;
    
    // Generate slots
    const slots: TimeSlot[] = [];
    let currentTime = startTime;
    
    while (currentTime < endTime) {
      // Check if slot end would exceed the end time
      if (currentTime + duration_minutes > endTime) {
        break;
      }
      
      const slotStart = this.formatTime(date, currentTime);
      const slotEnd = this.formatTime(date, currentTime + duration_minutes);
      
      // Count how many hosts are booked during this slot
      const bookedHosts = new Set<number>();
      dayBookings.forEach(booking => {
        const bookingStart = new Date(booking.from).getTime();
        const bookingEnd = new Date(booking.to).getTime();
        const currentSlotStart = new Date(slotStart).getTime();
        const currentSlotEnd = new Date(slotEnd).getTime();
        
        // Check for overlap
        if (bookingStart < currentSlotEnd && bookingEnd > currentSlotStart) {
          const hostIds = JSON.parse(booking.hosts) as number[];
          hostIds.forEach(hostId => bookedHosts.add(hostId));
        }
      });
      
      const available = Math.max(0, totalHosts - bookedHosts.size);
      
      if (available >= count) {
        slots.push({
          start: slotStart,
          end: slotEnd,
          available,
        });
      }
      
      currentTime += step_minutes;
    }
    
    return slots;
  }

  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private formatTime(date: string, minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${date} ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
  }
}

export const storage = new MemStorage();
