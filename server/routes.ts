import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, type SlotQuery } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // simple health endpoint
  app.get("/healthz", (_req, res) => res.json({ ok: true }));
  // GET /api/catalog - Get club information
  app.get("/api/catalog", async (_req, res) => {
    try {
      const catalog = await storage.getCatalog();
      res.json(catalog);
    } catch (error) {
      console.error('Error fetching catalog:', error);
      res.status(500).json({ error: 'Failed to fetch catalog' });
    }
  });

  // GET /api/hosts - Get list of stations/hosts
  app.get("/api/hosts", async (req, res) => {
    try {
      const includeOffline = req.query.include_offline === 'true';
      const onlyGroups = req.query.only_groups === 'true';
      
      const hosts = await storage.getHosts(includeOffline, onlyGroups);
      res.json(hosts);
    } catch (error) {
      console.error('Error fetching hosts:', error);
      res.status(500).json({ error: 'Failed to fetch hosts' });
    }
  });

  // GET /api/slots - Get available time slots
  app.get("/api/slots", async (req, res) => {
    try {
      const query: SlotQuery = {
        date: req.query.date as string,
        start: req.query.start as string || '12:00',
        end: req.query.end as string || '00:00',
        duration_minutes: parseInt(req.query.duration_minutes as string) || 60,
        step_minutes: parseInt(req.query.step_minutes as string) || 30,
        count: parseInt(req.query.count as string) || 1,
      };

      if (!query.date) {
        return res.status(400).json({ error: 'Date parameter is required' });
      }

      const slots = await storage.getAvailableSlots(query);
      res.json(slots);
    } catch (error) {
      console.error('Error fetching slots:', error);
      res.status(500).json({ error: 'Failed to fetch slots' });
    }
  });

  // POST /api/book - Create a booking
  app.post("/api/book", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      
      res.json({
        ok: true,
        booking: {
          id: booking.id,
          hosts: JSON.parse(booking.hosts),
          from: booking.from,
          to: booking.to,
          status: booking.status,
        },
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          ok: false, 
          error: 'Invalid booking data', 
          details: error.errors 
        });
      }
      res.status(500).json({ ok: false, error: 'Failed to create booking' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
