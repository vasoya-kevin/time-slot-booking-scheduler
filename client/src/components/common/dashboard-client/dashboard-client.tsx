"use client";

import { useState } from "react";
import Container from "../container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Copy, Check, Plus } from "lucide-react";

interface DashboardClientProps {
  user: {
    email: string;
    name: string;
    userId: number;
  };
  bookingLinks: BookingLink[];
}

type BookingLink = {
  id: number;
  uniqueCode: string;
  url: string;
  isActive: boolean;
  createdAt: string;
};

const DashboardClient = ({
  user,
  bookingLinks: initialBookingLinks,
}: DashboardClientProps) => {
  const [bookingLinks, setBookingLinks] =
    useState<BookingLink[]>(initialBookingLinks);
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(
    initialBookingLinks[0]?.id || null,
  );
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCopyLink = async (url: string, id: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/booking-links/generate", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to generate link");

      const data = await response.json();
      setBookingLinks([data.bookingLink, ...bookingLinks]);
      setSelectedLinkId(data.bookingLink.id);
    } catch (error) {
      console.error("Error generating link:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="font-sans py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Booking Links */}
        <section className="space-y-6">
          <Card>
            <CardHeader >
              <CardTitle className="text-2xl font-bold">
                Your Booking Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGenerateLink}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                {loading ? "Generating..." : "Generate New Link"}
              </Button>

              {bookingLinks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No booking links yet.</p>
                  <p className="text-sm">Generate one to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookingLinks?.map((booking) => (
                    <Card
                      key={booking.id}
                      className={`cursor-pointer transition-all hover:shadow-md p-2 ${
                        selectedLinkId === booking.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedLinkId(booking.id)}
                    >
                      <CardContent className="p-4 space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              Link #{booking.uniqueCode}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                booking.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {booking.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(
                              new Date(booking.createdAt),
                              "MMM dd, yyyy",
                            )}
                          </span>
                        </div>

                        {/* URL Display */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={booking.url}
                            readOnly
                            className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyLink(booking.url, booking.id);
                            }}
                            className="whitespace-nowrap"
                          >
                            {copiedId === booking.id ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t">
                          <div>
                            <span className="font-medium">ID:</span>{" "}
                            {booking.id}
                          </div>
                          <div>
                            <span className="font-medium">Code:</span>{" "}
                            {booking.uniqueCode}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Right Column - Add Availability */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Add Availability Slot
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedLinkId ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">Select a booking link first</p>
                  <p className="text-sm mt-2">
                    Choose a link from the left to add availability slots
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Selected Link:</span> #
                      {
                        bookingLinks.find((link) => link.id === selectedLinkId)
                          ?.uniqueCode
                      }
                    </p>
                  </div>

                  {/* Add your availability form here */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time
                        </label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Time
                        </label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      Add Availability
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </Container>
  );
};

export default DashboardClient;
