import { DashboardClient } from "@/components/common";
import { getProfile } from "../layout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getBookingLinks() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/sign-in");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/booking-links`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch booking links");
    }

    const finalResponse = await res.json();
    return finalResponse;
  } catch (e) {
    console.error("Booking links fetch error:", e);
    return { bookingLinks: [] };
  }
}

const Dashboard = async () => {
  const user = await getProfile();
  const bookingLinks = await getBookingLinks();
  return (
    <DashboardClient user={user} bookingLinks={bookingLinks.bookingLinks} />
  );
};

export default Dashboard;
